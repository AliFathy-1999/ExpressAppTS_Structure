import dotenv, { config } from 'dotenv';
config();
const { 
    CLOUDNAIRY_CLOUD_NAME, CLOUDNAIRY_API_KEY, CLOUDNAIRY_API_SECRET,MAX_FILE_SIZE,
    NODE_ENV,ALLOWED_FILE_EXTENSIONS
} = process.env;


const uploadConfig = {
    uploadFileStatus: {
        type: NODE_ENV === 'production' ? 'multer-cloudinary' : 'multer-local',
    },
    cloudinaryConfig: {
        cloud_name: CLOUDNAIRY_CLOUD_NAME,
        api_key: CLOUDNAIRY_API_KEY,
        api_secret: CLOUDNAIRY_API_SECRET,
    },
    uploadedFile:{
        limits: {
            fileSize: Number(MAX_FILE_SIZE) * 1024 * 1024,
            files: 4,
            
        },
        allowedFileExtension : ALLOWED_FILE_EXTENSIONS,
    },
};


export default uploadConfig;