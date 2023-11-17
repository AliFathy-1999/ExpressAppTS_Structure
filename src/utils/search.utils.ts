import { Document } from 'mongodb';
import { Model, Query } from 'mongoose';
import { ApiError } from '../lib';
import errorMsg from './messages/errorMsg';
import { StatusCodes } from 'http-status-codes';
import fetchDataUtils from './fetch-data-utils';


// class searchUtils {
//     query:Query<Document, any>;
//     schemaPaths:string[];
//     filterBy:{[k:string]:any} = {}
//     fetchDataUtils:fetchDataUtils
//     constructor(private model:Model<Document>,private queryString:{[k:string]:any}) {
//         this.queryString = queryString;
//         this.schemaPaths = Object.keys(this.model.schema.paths);

//     }

//     async search(){
//         const { searchField, searchValue } = this.queryString
        
//         this.schemaPaths.forEach((field:string) => {
//             if (field === searchField) 
//                 this.filterBy[field] = new RegExp(searchValue, 'i')
//         })
        
//         if(!this.schemaPaths.includes(searchField)) {
//             throw new ApiError(
//                 errorMsg.searchByInvalidField('User', searchField),
//                 StatusCodes.UNPROCESSABLE_ENTITY
//             );
//         }
//         if(searchField && searchValue) this.query = this.model.find(this.filterBy);
//         this.fetchDataUtils = new fetchDataUtils(this.query, this.queryString);
//         const fetchQuery = await this.fetchDataUtils.sort().paginate();
//         this.query = fetchQuery.query;
//         return this;
//     }
// }

// export default searchUtils;

class searchUtils {
    query: Query<Document, any>;
    schemaPaths: string[];
    filterBy: { [k: string]: any } = {};

    constructor(private model: Model<Document>, private queryString: { [k: string]: any }) {
      this.queryString = queryString;
      this.schemaPaths = Object.keys(this.model.schema.paths);
      this.query = this.model.find();

    }
  
    search() {
      const { searchField, searchValue } = this.queryString;
  
      this.schemaPaths.forEach((field: string) => {
        if (field === searchField) this.filterBy[field] = new RegExp(searchValue, 'i');
      });
  
      if (!this.schemaPaths.includes(searchField)) {
        throw new ApiError(
          errorMsg.searchByInvalidField('User', searchField),
          StatusCodes.UNPROCESSABLE_ENTITY
        );
      }
  
      if (searchField && searchValue) {
        this.query = this.model.find(this.filterBy);
      }

      return this;
    }
  }
  
  export default searchUtils;