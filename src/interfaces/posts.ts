import { Document } from "mongoose";

interface IPost extends Document {
    title: string;
    content: string;
    author: string;
}

export { IPost }