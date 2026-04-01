import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from 'src/common/enums/role.enum';

// Schema tells NestJs this class Maps to a MongoDB collection
@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [String], default: [] })
  refreshToken: string[];

  @Prop({ type: String, enum: Role, default: Role.Member })
  role: Role;

  @Prop()
  avatar?: string;
}

// This factory compiles class into a standard Mongoose schema
export const UserSchema = SchemaFactory.createForClass(User);
