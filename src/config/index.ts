import dotenv, { config } from 'dotenv';
config();
const { 
    PORT, DB_URL, NODE_ENV, DB_LOCAL_URL,
    PAYMOB_API_KEY, PAYMOB_SECRET_KEY, PAYMOB_PUBLIC_KEY,PAYMOB_EXPIRATION_TIME,
    PAYMOB_INTEGRATION_ID,
    PAYMOB_IFRAME_ID
} = process.env;

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
    paymob:{
        apiKey: PAYMOB_API_KEY,
        secretKey: PAYMOB_SECRET_KEY,
        publicKey: PAYMOB_PUBLIC_KEY,
        accessLink: "https://accept.paymob.com/api/auth/tokens",
        orderLink : "https://accept.paymob.com/api/ecommerce/orders",
        paymentKeyRefLink: "https://accept.paymob.com/api/acceptance/payment_keys",
        expirationTime:+PAYMOB_EXPIRATION_TIME,
        integration_id: +PAYMOB_INTEGRATION_ID,
        callBackBaseURL: `https://accept.paymob.com/api/acceptance/iframes/${PAYMOB_IFRAME_ID}?payment_token=` 
    }
};


export default configIndex;