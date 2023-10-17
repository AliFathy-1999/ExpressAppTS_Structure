import { File } from "buffer";

interface IFiles {
    [fieldname: string]: Express.Multer.File[] | File[];
}

export default IFiles;