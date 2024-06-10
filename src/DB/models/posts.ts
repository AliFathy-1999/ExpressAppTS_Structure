import { Schema, model } from 'mongoose';
import { IPost } from '../../interfaces/posts';

const schema = new Schema<IPost>({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true,
        ref: "User"
    },
}, {
    timestamps: true,
    versionKey: false,
})


export default model<IPost>('Post', schema)
