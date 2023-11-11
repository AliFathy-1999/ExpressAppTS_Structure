import { Error } from 'mongoose';
import mongoose from 'mongoose';

import config from '../config'
import errorMsg from '../utils/messages/errorMsg';
import { Application } from 'express';
import startExpressApp from '../config/start-app';
const { 
  db: { url, conn_message }
} = config;

  function connectToDB(app: Application) {
    mongoose.connect(url)
        .then(() => {
            console.log(conn_message);
            startExpressApp(app);
        })
        .catch((error:Error) => {
          console.error(errorMsg.mongoConnection(error));
      });
  } 
  export default connectToDB;