import { Error } from "mongoose";
import mongoose from "mongoose";

import config from '../config'
const { db: { url },app: { environment } } = config;

const maxRetryAttempts = 3;
const retryDelayMs = 3000;
let retryAttempts = 0;
let db_conn_message  = environment === 'production' ? `MongoDB Atlas connected successfully`: `MongoDB Local connected successfully` ;
const MongoUrl = environment === 'production' ? url : 'mongodb://localhost:27017/ecommerce-app' 
  function connectToDB() {
    mongoose.connect(MongoUrl)
        .then(() => {
            console.log(db_conn_message);
        })
        .catch((error:Error) => {
        console.error(`MongoDB connection error: ${error.message}`);
        retryAttempts++;
        if (retryAttempts < maxRetryAttempts) {
          console.log(`Retrying connection attempt ${retryAttempts} in ${retryDelayMs} ms`);
          setTimeout(connectToDB, retryDelayMs);
        } else {
          console.error(`Max retry attempts (${maxRetryAttempts}) reached. Exiting...`);
          process.exit(1);
        }
      });
  } 
  export default connectToDB;