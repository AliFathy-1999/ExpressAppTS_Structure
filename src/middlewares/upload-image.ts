import { Request } from "express";
import { v2 as cloudinary } from 'cloudinary';
const { CloudinaryStorage } =  require('multer-storage-cloudinary');
import multer from 'multer';
import { ApiError } from "../lib";

import config  from '../config'
const { 
  cloudnairy,
  uploadedFile: { allowedFileExtension, maxFileSize }
} = config

import { extractPublicId } from 'cloudinary-build-url';
import path from "path";
// Configuration 

cloudinary.config(cloudnairy);


const storage  = new CloudinaryStorage({
  cloudinary : cloudinary,
  params : {
    folder : 'user-images',
    public_id :  (req:Request, file: multer.File) => {
      const myFileName = `${Date.now()}-${file.originalname.split('.')[0]}`;
      return myFileName;
    },
    },

    
});
const fileFilter = (req:Request, file : multer.File, callback: (error: ApiError | null, acceptFile: boolean) => void) => {   

  if (file.mimetype.split("/")[0] !== "image") {
      return callback(new ApiError('Only images are allowed', 400), null);
    }
    
  // if (!allowedFileExtension.includes(path.extname(file.originalname))) {
  //     return callback(new ApiError('Only images are allowed', 400), null);
  //   }
    return callback(null, true);  
  }
const upload = multer({
  storage,
  limits : {
    fileSize : maxFileSize,
  },

  fileFilter 
  });

const removeImage = async(url:string) =>{
  const publicId = extractPublicId(url);
  if(url === 'https://res.cloudinary.com/dttgbrris/image/upload/v1681003634/3899618_mkmx9b.png') return;
  cloudinary.uploader.destroy(publicId, { resource_type : 'image'})
}


export { upload, removeImage };
