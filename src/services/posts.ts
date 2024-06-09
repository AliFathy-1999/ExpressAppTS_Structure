import Post from '../DB/models/posts';
import { IPost } from '../interfaces/posts';


const getPostService = async (filterBy: { [key:string] : any}) : Promise<IPost> => await Post.findOne(filterBy); 

const createPostService = async (postData: { [key:string] : any}) : Promise<IPost>=> await Post.create(postData);

const updatePostService = async (filterBy: { [key:string] : any}, updateData: { [key:string] : any}) : Promise<IPost> => await Post.findOneAndUpdate(filterBy, updateData, {runValidation: true, new : true});

const deletePostService = async (filterBy: { [key:string] : any}) : Promise<IPost> => await Post.findOneAndDelete(filterBy);

const getPostByIdService = async (filterBy: { [key:string] : any}) : Promise<IPost> => await Post.findOne(filterBy);


export default{
    getPostService,
    createPostService,
    updatePostService,
    deletePostService,
    getPostByIdService,
}
