// import User from "../DB/models/users";
// import { ApiError } from "../lib";
// import HttpStatusCode from "../types/http-status-code";
// import errorMsg from "../utils/errorMsg";
// import bcryptjs from 'bcryptjs';

// const signInService = async (email: string, password: string){
//     const user = await User.findOne({email});
//     if(!user) 
//         throw new ApiError(errorMsg.IncorrectField('Email'), HttpStatusCode.UNAUTHORIZED);

//     const valid = bcryptjs.compareSync(password, user.password);
//     if(!valid)
//         throw new ApiError(errorMsg.IncorrectField('Password'), HttpStatusCode.UNAUTHORIZED);
// }

// export default{
//     signInService,
// }
