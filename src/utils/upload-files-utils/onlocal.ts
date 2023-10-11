// localFileUpload.ts
import { Request } from 'express';
import multer, { diskStorage } from 'multer';
import { fileFilter } from './index';
import path from 'path';
import * as crypto from 'crypto';

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

// Export the multer upload middleware configured for local storage
const localFileUpload = multer({
  storage,
  fileFilter
});

export default localFileUpload;