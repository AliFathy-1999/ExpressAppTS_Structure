import { Application } from 'express';
import config from './index'
import redisClient from './redis.config';
import { infoLogger, warnLogger } from '../utils/logger';
const { port } = config.app;

const startExpressApp = (app :Application) =>{
    app.listen( port || 4000, () => {
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
    });
}

export default startExpressApp;