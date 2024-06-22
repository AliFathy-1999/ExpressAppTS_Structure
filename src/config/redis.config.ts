import Redis from 'ioredis'
import { Query } from 'mongoose';

import util from 'util';
const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: +process.env.REDIS_PORT
});

redisClient.get = util.promisify(redisClient.get)

//Take a copy of original exec()
const exec = Query.prototype.exec;

//Create a function cache to ensure that only the query data I chose is cached.
Query.prototype.cache = function (): Query<any, any> {
    this.useCache = true;
    return this;
}
//Cache data when Any exec query happens
Query.prototype.exec = async function() {
    //If not chose cache find().cache() return the original implementation of exec
    if(!this.useCache){
        return exec.apply(this,arguments);
    }
    //Replace callack redisClient.get(()=>{}) with util.promisify
    redisClient.get = util.promisify(redisClient.get)
    //Make key unique { _id: '123', collection: "users"} { userId: '123', collection: "posts"} for each model it has a userId
    const key = JSON.stringify(Object.assign({}, this.getQuery(), {
        collection: this.mongooseCollection.name
    }));

    const cachedData = await redisClient.get(key);
    if (cachedData) {
        //JSON.parse(cachedData) ==> plain object not mongoose document  
        //Query.prototype.exec expects to return document not plain object, to convert it to document use new this.model to new instance 
        const doc =  JSON.parse(cachedData);
        return Array.isArray(doc) 
                ? doc.map((document)=> new this.model(document))
                : new this.model(doc)
    }
    const result = await exec.apply(this);
    redisClient.set(key, JSON.stringify(result),'EX',+process.env.REDIS_CACHE_EXP_TIME);
    return result;
};


export default redisClient;