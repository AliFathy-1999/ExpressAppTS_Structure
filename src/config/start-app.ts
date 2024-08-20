import { Application } from 'express';
import config from './index'
import redisClient from './redis.config';
import { infoLogger, warnLogger } from '../utils/logger';
import path from 'path';
import fs from 'fs';
import https from "https"
const { port } = config.app;

const startExpressApp = (app :Application) =>{
    const keyPath = path.resolve(__dirname, '../../','key.pem');
    const certPath = path.resolve(__dirname, '../../', 'cert.pem');

    const sslOptions = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
    };
    https.createServer(sslOptions,app).listen(port || 4000, ()=> {
        const source = "Redis"
        redisClient.on('error', (err) => {
            warnLogger(`Redis connection error: ${err.message}`, source)
            process.exit(0);
        });
        
        // If the connection is successful
        redisClient.on('connect', () => {
            infoLogger('Connected to Redis',source)
        });
        infoLogger(`Server Running here ${process.env.DEV_URL}`)
    })
}

export default startExpressApp;