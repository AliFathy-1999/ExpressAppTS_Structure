import connectToDB from './DB/connects';
import app from './app';

//Run MongoDB server and app server

connectToDB(app);


