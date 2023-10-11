
import { Request } from 'express';
import  localFileUpload  from './onlocal';
import { cloudinaryFileUpload } from './oncloud';
import multer from 'multer';
import { ApiError } from '../../lib';
import errorMsg from '../errorMsg';
import HttpStatusCode from '../../types/http-status-code';
import config from '../../config';
const { uploadFileStatus: { type } } = config


const fileFilter = (req:Request, file : multer.File, callback: (error: ApiError | null, acceptFile: boolean) => void) => {   
  const fileType = file.mimetype.split("/")[0]
  const mediaTypeName = file.mimetype.split("/")[1]

  if ( fileType !== "image" ) {
      return callback(new ApiError(errorMsg.ImageOnly, HttpStatusCode.UNSUPPORTED_MEDIA_TYPE), null);
    }
    
  // if (!allowedFileExtension.includes(path.extname(file.originalname))) {
  //     return callback(new ApiError('Only images are allowed', 400), null);
  //   }
    return callback(null, true);  
  }

// Use the selected upload middleware
const uploadStatus = type === 'multer-cloudinary' ? cloudinaryFileUpload : localFileUpload;

const upload = uploadStatus; // Adjust the field name as needed

export { upload, fileFilter } ;
