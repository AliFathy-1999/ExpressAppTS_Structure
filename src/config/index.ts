import dotenv from 'dotenv';
dotenv.config();
const { 
    PORT,DB_USERNAME,DB_PASSWORD,DB_NAME,
    CLOUDNAIRY_CLOUD_NAME, CLOUDNAIRY_API_KEY, CLOUDNAIRY_API_SECRET 
} = process.env;


const config = {
    app: {
        port: PORT || 4000
    },
    db: {
        username: DB_USERNAME,
        password: DB_PASSWORD,
        name: DB_NAME,
    },
    cloudnairy: {
        cloud_name: CLOUDNAIRY_CLOUD_NAME,
        api_key: CLOUDNAIRY_API_KEY,
        api_secret: CLOUDNAIRY_API_SECRET,
    }
};


export default config;