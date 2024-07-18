import { Error } from 'mongoose';
import mongoose from 'mongoose';

import config from '../config'
import errorMsg from '../utils/messages/errorMsg';
import { Application } from 'express';
import startExpressApp from '../config/start-app';
import { criticalLogger, infoLogger } from '../utils/logger';
const {
  db: { url, conn_message }
} = config;

function connectToDB(app: Application) {
  mongoose.connect(url)
    .then(() => {
      infoLogger(conn_message, "Database");
      startExpressApp(app);
    })
    .catch((error: Error) => {
      criticalLogger(errorMsg.mongoConnection(error))
    });
}
export default connectToDB;