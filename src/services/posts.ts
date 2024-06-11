import Post from '../DB/models/posts';
import { IPost } from '../interfaces/posts';


const getPostService = async (filterBy: { [key:string] : any}, cacheFlag: boolean = false) : Promise<Array<IPost>> => {
    if(cacheFlag) return await Post.find(filterBy).cache().exec()
    return await Post.find(filterBy)
}; 

const createPostService = async (postData: Partial<IPost>) : Promise<IPost>=> await Post.create(postData);

const updatePostService = async (filterBy: { [key:string] : any}, updateData: { [key:string] : any}) : Promise<IPost> => await Post.findOneAndUpdate(filterBy, updateData, {runValidation: true, new : true});

const deletePostService = async (filterBy: { [key:string] : any}) : Promise<IPost> => await Post.findOneAndDelete(filterBy);

const getPostByIdService = async (filterBy: { [key:string] : any}) : Promise<IPost> => await Post.findOne(filterBy);

const getPostServicess  = async (filterBy: { [key:string] : any}) : Promise<Array<IPost>> => await Post.find(filterBy).exec(); 
export default{
    getPostService,
    createPostService,
    updatePostService,
    deletePostService,
    getPostByIdService,
    getPostServicess
}
