import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class S3Service {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      endpoint: process.env.S3_ENDPOINT || process.env.AWS_ENDPOINT,
      region: process.env.S3_REGION || process.env.AWS_REGION || 'eu-west-1',
      credentials: {
        accessKeyId:
          process.env.S3_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey:
          process.env.S3_SECRET_ACCESS_KEY ||
          process.env.AWS_SECRET_ACCESS_KEY ||
          '',
      },
      forcePathStyle: true, 
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const bucketName = process.env.S3_BUCKET_NAME || 'heyama-bucket';
    const fileName = `uploads/${Date.now()}-${file.originalname}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    const endpoint = process.env.S3_ENDPOINT || process.env.AWS_ENDPOINT || '';

    let publicHost = endpoint.replace('.storage.supabase.co', '.supabase.co');

    publicHost = publicHost.replace(/\/storage\/v1\/s3\/?$/, '');

    return `${publicHost}/storage/v1/object/public/${bucketName}/${fileName}`;
  }
}