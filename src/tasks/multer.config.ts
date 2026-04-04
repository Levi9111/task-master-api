import { v2 as cloudinary } from 'cloudinary';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { config } from 'dotenv';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

config();

// 1. Configure the Cloudinary SDK with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Export the new multer options using CloudinaryStorage
export const multerOptions = {
  storage: new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'taskflow_attachments', // The folder name inside your Cloudinary account
      // Optional: limit allowed formats. If you want any file type, remove this line.
      // allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
    } as any,
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
};
