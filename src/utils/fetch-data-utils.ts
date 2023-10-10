import { Document } from "mongodb";
import { Query } from "mongoose";


class fetchDataUtils {
    projection:string = '';
    query:Query<Document,any>;
    queryString:{[k:string]:any};
    page:number = 0;
    limit:number = 5;
    totalPages:number;
    totalDocs:number;
    constructor(query:Query<Document,any>, queryString:{[k:string]:any}) {
        this.query = query;  
        this.queryString = queryString;
        this.page = queryString.page;
        this.limit = queryString.limit;
      }
    filter(){
        return this.query.select(this.projection);
    }
    sort(){
        const sortedBy = this.queryString.sort?.split(',').join(' ');
        if (sortedBy) this.query = this.query.sort(sortedBy);
        else this.query = this.query.sort('-createdAt');  
        return this;
     }

    async paginate() {
        const skip = this.page * this.limit;
        this.query.skip(skip).limit(this.limit);
        // Get a copy of the query
        const countQuery = this.query.model.find(this.query.getQuery()).countDocuments();
        this.totalDocs = await countQuery;
        this.totalPages = Math.ceil(this.totalDocs / this.limit);
        return this;
    }

    
}

export default fetchDataUtils;