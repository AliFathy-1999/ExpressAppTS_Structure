import mongoose from 'mongoose';
import { DuplicateKeyError } from '../lib/apiError'

const errorMsg = {
    mongooseInvalidInput:(err: mongoose.Error.ValidationError) : string => `${Object.keys(err.errors).join(' ')} is not valid `,
    DuplicatedKey: (err: DuplicateKeyError) : string => `Value of field ${Object.keys(err.keyValue)[0]} is Duplicated please choose another one`,
    IncorrectField: (field:string) : string => `Incorrect ${field}, please try again`,
    NotFound: (model:string,field:string) : string => `No ${model} with ID ${field}`,
    customMsg: (msg:string) => msg
}
export default errorMsg;