import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ObjectDocument = AppObject & Document;

@Schema({ timestamps: true })
export class AppObject {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  imageUrl: string;
}

export const ObjectSchema = SchemaFactory.createForClass(AppObject);