import { Query } from 'mongoose';
import fetchDataUtils from '../utils/fetch-data-utils';
import Ipaginate from '../interfaces/paginate';
import { Document } from 'mongodb';

const getModelService = async (Model:Query<Document, any>, utilities: { [key:string] : any} ): Promise<Ipaginate> => {
    const { page, limit, sort, select } = utilities
    const model = Model.find()
    const fetchData = new fetchDataUtils(model, { page, limit, sort, select });
    (await fetchData.sort().paginate()).selection();
    const results = await fetchData.query;
    const data : Ipaginate = {
        page : +fetchData.page,
        limit : +fetchData.limit,
        totalDocs : fetchData.totalDocs,
        totalPages:fetchData.totalPages,            
        data : results as any[]
    }
    return data
};

export default {
    getModelService
}