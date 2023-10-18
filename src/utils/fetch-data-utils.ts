import { Document } from 'mongodb';
import { Query } from 'mongoose';


class fetchDataUtils {
    projection:string = '';
    query:Query<Document, any>;
    queryString:{[k:string]:any};
    page:number;
    limit:number;
    totalPages:number;
    totalDocs:number;
    constructor(query:Query<Document, any>, queryString:{[k:string]:any}) {
        this.query = query;  
        this.queryString = queryString;
        this.page = queryString.page || 1;
        this.limit = queryString.limit || 5;
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
    selection(){
        const { select } = this.queryString
        this.projection = select?.split(',').join(' ');
        this.query.select(this.projection);
        return this;
    }
}

export default fetchDataUtils;