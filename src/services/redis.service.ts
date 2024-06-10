import redisClient from '../config/redis.config';
import util from 'util'
import { Model, Document, FilterQuery, ObjectId } from 'mongoose';


const getCachedDataService = async <T extends Document>(
        cachedKey: string | ObjectId,
        model: Model<T>,
        filterBy: FilterQuery<T>
    ): Promise<T[] | null>  => {
    //Replace callack redisClient.get(()=>{}) with util.promisify
    redisClient.get = util.promisify(redisClient.get)
    // Do we have any cached data in redis related to this query
    const cachedData = await redisClient.get(cachedKey as string)
    //If yes, then respond to the request right away and return
    if(cachedData){
        return JSON.parse(cachedData) as T[]
    }
    //If no, we need to respond to request and update our cache to store the data
    const retrivedData = await model.find(filterBy)
    redisClient.set(cachedKey as string,JSON.stringify(retrivedData))
    return retrivedData;
};




export default {
    getCachedDataService,
}
