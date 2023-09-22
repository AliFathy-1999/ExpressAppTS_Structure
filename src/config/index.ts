import dotenv from 'dotenv';
dotenv.config();
const { 
    PORT,DB_URL,
    CLOUDNAIRY_CLOUD_NAME, CLOUDNAIRY_API_KEY, CLOUDNAIRY_API_SECRET,MAX_FILE_SIZE,
    NODE_ENV,ALLOWED_FILE_EXTENSIONS
} = process.env;


const config = {
    app: {
        port: PORT || 4000,
        environment : NODE_ENV || 'development',
    },
    db: {
        url: DB_URL
        // username: DB_USERNAME,
        // password: DB_PASSWORD,
        // name: DB_NAME,
    },
    cloudnairy: {
        cloud_name: CLOUDNAIRY_CLOUD_NAME,
        api_key: CLOUDNAIRY_API_KEY,
        api_secret: CLOUDNAIRY_API_SECRET,
    },
    uploadedFile:{
        maxFileSize : +MAX_FILE_SIZE,
        allowedFileExtension : ALLOWED_FILE_EXTENSIONS,
    },
};


export default config;