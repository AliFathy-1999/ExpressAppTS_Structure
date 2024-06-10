// import * as redis from 'redis'
import Redis from 'ioredis'
const redisClient = new Redis({
    host: '127.0.0.1',
    port: 6379
});
// redis.createClient({
//     url: process.env.REDIS_URL
// })

export default redisClient;