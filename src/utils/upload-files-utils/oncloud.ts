// cloudinaryUpload.ts
import { Request } from 'express';
import * as crypto from 'crypto';
import multer from 'multer';

import { extractPublicId } from 'cloudinary-build-url';
const { CloudinaryStorage } =  require('multer-storage-cloudinary');

import { v2 as cloudinary } from 'cloudinary';

import { fileFilter } from './index';
import config  from '../../config'
import path from 'path';

const { cloudinaryConfig, uploadedFile : { limits } } = config.uploadConfig
// Configure Cloudinary
cloudinary.config(cloudinaryConfig);

const renameFilename = async (req: Request, file: Express.Multer['File'], callback: (error: Error | null, destination: string) => void) => {
  let fileExtension = path.extname(file.originalname);
  const randomImageName = crypto.randomUUID() + fileExtension;
  callback(null, randomImageName);
};

// Create a multer storage engine for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinaryConfig,
  params: {
    folder: 'user-images',
    public_id: renameFilename,
  },
});

// Export the multer upload middleware configured for Cloudinary
const cloudinaryFileUpload = multer({
  storage,
  fileFilter,
  limits
});

const removeImage = async(url:string | Array<string>) =>{
  let publicId = null;
  if(typeof url == "string"){
    publicId = extractPublicId(url)
    if(url === 'https://res.cloudinary.com/dttgbrris/image/upload/v1681003634/3899618_mkmx9b.png') return;
      cloudinary.uploader.destroy(publicId, { resource_type : 'image'})

  }
  if(Array.isArray(url)){
    url.forEach((item) => {
      publicId = extractPublicId(item)
      cloudinary.uploader.destroy(publicId, { resource_type : 'image'})
    })
  }
}

export { cloudinaryFileUpload, removeImage };