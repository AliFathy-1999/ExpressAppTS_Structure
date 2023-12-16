import dotenv, { config } from 'dotenv';
config();
const { PORT, DB_URL, NODE_ENV, DB_LOCAL_URL, SENDER_EMAIL } = process.env;

import uploadConfig from './upload-files';
const localMongoURL = DB_LOCAL_URL;

const configIndex = {
    app: {
        port : PORT || 4000,
        environment : NODE_ENV || 'development',
    },
    db: {
        url: NODE_ENV === 'production' ? DB_URL : localMongoURL,
        conn_message: NODE_ENV === 'production' ? 'MongoDB Atlas connected successfully' : 'MongoDB Local connected successfully',
    },
    uploadConfig,
};


export default configIndex;