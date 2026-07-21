import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppObject, ObjectDocument } from './object.schema';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class ObjectsService {
  private s3Client: S3Client;
  private bucketName = process.env.S3_BUCKET_NAME || 'heyama-bucket';

  constructor(
    @InjectModel(AppObject.name) private objectModel: Model<ObjectDocument>,
  ) {
    this.s3Client = new S3Client({
      region: process.env.S3_REGION || 'us-east-1',
      endpoint: process.env.S3_ENDPOINT,
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
      },
    });
  }

  async create(title: string, description: string, file: Express.Multer.File): Promise<AppObject> {
    if (!file) {
      throw new BadRequestException('Un fichier image est obligatoire.');
    }

    
    const fileKey = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;

    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: fileKey,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );

      const publicBaseUrl = process.env.S3_PUBLIC_URL || `${process.env.S3_ENDPOINT}/${this.bucketName}`;
      const imageUrl = `${publicBaseUrl}/${fileKey}`;

      const newObject = new this.objectModel({ title, description, imageUrl });
      return await newObject.save();

    } catch (error) {
      console.error(" Erreur Upload S3 :", error);
      throw new BadRequestException(`Échec de l'envoi vers S3 : ${error.message}`);
    }
  }

  async findAll(): Promise<AppObject[]> {
    return this.objectModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<AppObject> {
    const obj = await this.objectModel.findById(id).exec();
    if (!obj) throw new NotFoundException('Objet introuvable');
    return obj;
  }

  async delete(id: string): Promise<void> {
    const obj = await this.findOne(id);
    const fileKey = obj.imageUrl.split('/').pop();

    if (fileKey) {
      try {
        await this.s3Client.send(
          new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: fileKey,
          }),
        );
      } catch (error) {
        console.error("Erreur lors de la suppression sur S3 :", error.message);
      }
    }

    await this.objectModel.findByIdAndDelete(id).exec();
  }
}