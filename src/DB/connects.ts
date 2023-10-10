import { Error } from "mongoose";
import mongoose from "mongoose";

import config from '../config'
import errorMsg from "../utils/errorMsg";
const { 
  db: { url, conn_message }
} = config;

const maxRetryAttempts = 3;
const retryDelayMs = 3000;
let retryAttempts = 0;

  function connectToDB() {
    mongoose.connect(url)
        .then(() => {
            console.log(conn_message);
        })
        .catch((error:Error) => {
        console.error(errorMsg.mongoConnection(error));
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