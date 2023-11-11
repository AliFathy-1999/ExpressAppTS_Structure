import mongoose from 'mongoose';
import { DuplicateKeyError } from '../../lib/apiError'

const errorMsg = {
    mongooseInvalidInput:(err: mongoose.Error.ValidationError) : string => `${Object.keys(err.errors).join(' ')} is not valid `,
    DuplicatedKey: (err: DuplicateKeyError) : string => `Value of field ${Object.keys(err.keyValue)[0]} is Duplicated please choose another one`,
    IncorrectField: (field:string) : string => `Incorrect ${field}, please try again`,
    NotFound: (model:string,field:string) : string => `No ${model} with ID ${field}`,
    RouteNotFound: (route:string) : string => `Can't find ${route} on this server`,
    mongoConnection: (error:Error) : string => `MongoDB connection error: ${error.message}`,
    AllowedFile: (extensions:string) : string => `Allowed file extensions are ${extensions}`,
    ImageOrPdfOnly: 'Only images and pdfs are allowed',
    fileCount: (fileCount:number) : string =>`Exactly ${fileCount} file is uploaded. You should upload more than ${fileCount} file.` ,
    searchNotFoundValue: (model:string,field:string,value:string) : string => `No results found for ${model} has ${field} with ${value}`,
    searchByInvalidField: (model:string,field:string) : string => `No such field with this name ${field} in ${model}`,
    customMsg: (msg:string) => msg
}
export default errorMsg;