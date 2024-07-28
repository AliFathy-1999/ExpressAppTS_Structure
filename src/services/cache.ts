import redisClient from "../config/redis.config"
import { debugLogger, errorLogger } from "../utils/logger";

const clearCache = (hashKey: string): void => {
    //Called when there are changes in data cached
    redisClient.del(JSON.stringify(hashKey))
    .then((data)=> {
        if(data){
            debugLogger(`${hashKey} was deleted successfully`)
        }
    })
    .catch(err => errorLogger(err.message,"Redis"));
}

export {
    clearCache
}