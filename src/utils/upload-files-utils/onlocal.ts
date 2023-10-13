// localFileUpload.ts
import { Request } from 'express';
import multer, { Multer, diskStorage } from 'multer';
import path from 'path';
import * as crypto from 'crypto';
import config from '../../config';
import { ApiError } from '../../lib';
import errorMsg from '../errorMsg';
import HttpStatusCode from '../../types/http-status-code';
const { 
  uploadedFile : { allowedFileExtension ,limits }
} = config
const uploadsFolderPath = path.join(__dirname, '../../../uploads');
const imagesFolderPath = path.join(uploadsFolderPath, '/uploaded-images');
const pdfsFolderPath = path.join(uploadsFolderPath, '/uploaded-pdfs');

// Define functions for destination and filename
const filesDestination = (req: Request, file: Express.Multer['File'], callback: (error: Error | null, destination: string) => void) => {
  let fileType = file.mimetype.split("/")[0];
  fileType === "image"
    ? callback(null, imagesFolderPath)
    : callback(null, pdfsFolderPath);
};

const renameFilename = async (req: Request, file: Express.Multer['File'], callback: (error: Error | null, destination: string) => void) => {
  let fileExtension = path.extname(file.originalname);
  const randomImageName = crypto.randomUUID() + fileExtension;
  callback(null, randomImageName);
};
// Create diskStorage with local file storage configuration
const storage = diskStorage({
  destination: filesDestination,
  filename: renameFilename,
});

const fileFilter = (req:Request, file : any, callback: (error: ApiError | null, acceptFile: boolean) => void) => {   
  const fileType = file.mimetype.split("/")[0]
  const mediaTypeName = file.mimetype.split("/")[1]
  const fileExtension = path.extname(file.originalname);
  
  // if ( fileType !== "image" && mediaTypeName !== "pdf") {
  //     return callback(new ApiError(errorMsg.ImageOrPdfOnly, HttpStatusCode.UNSUPPORTED_MEDIA_TYPE), null);
  //   }
    
  if (!allowedFileExtension.includes(fileExtension)) {
      return callback(new ApiError(errorMsg.ImageOrPdfOnly, HttpStatusCode.UNSUPPORTED_MEDIA_TYPE), null);
    }
    return callback(null, true);  
  }
  
// Export the multer upload middleware configured for local storage
const localFileUpload = multer({
  storage,
  fileFilter,
  limits
});

export default localFileUpload;