import { Error } from "mongoose";
import mongoose from "mongoose";

import config from '../config'
const { db: { username,password,name } } = config;

const maxRetryAttempts = 3;
const retryDelayMs = 3000;
let retryAttempts = 0;

const MongoUrl = `mongodb+srv://${username}:${password}@uploadimagecluster.bkyhx90.mongodb.net/${name}?retryWrites=true&w=majority`
  function connectToDB() {
    mongoose.connect(MongoUrl)
        .then(() => {
        console.log('MongoDB connected successfully');
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