import {  Schema,model } from "mongoose";
import validator from "validator"
import bcryptjs from 'bcryptjs'


import { ApiError } from "../../lib";
import { IUser, Role } from '../../interfaces/user';


const schema = new Schema<IUser>({
    firstName : {
        type :      String,
        minLength : [3, 'First name must be at least 3 characters'],
        maxLength : [15, 'First name must be at less than 15 characters'],
        required :  [true, 'First name is a required field'],
        trim :      true,
        match :     /^[A-Za-z\s]+$/,
        validate(value:string) {
          if (!value.match(/^[A-Za-z\s]+$/)) {
            throw new Error('First Name should contain alphabetic characters only');
          }
        },
      },
      lastName : {
        type :      String,
        minLength : [3, 'Last name must be at least 3 characters'],
        maxLength : [15, 'Last name must be at less than 15 characters'],
        required :  [true, 'Last name is a required field'],
        trim :      true,
        match :     /^[A-Za-z\s]+$/,
        validate(value:string) {
          if (!value.match(/^[A-Za-z\s]+$/)) {
            throw new Error('Last Name should contain alphabetic characters only');
          }
        },
    },
    userName: {
      type: String,
      minLength: [3, 'Username must be at least 3 characters'],
      maxLength: [30, 'Username must be at less than 30 characters'],
      required: [true, 'Username is a required field'],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Email is a required field'],
      unique: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new ApiError('Invalid email',400);
        }
      },
    },
    password: {
      type: String,
      required: [true, 'Password is a required field'],
      trim: true,
      minlength: [6, 'Password must be at least 6 characters'],
      match: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]/,
      //@iti43OS
      validate(value: string) {
        if (!value.match(/(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]/)) {
          throw new ApiError('Password must contain at least one number , Capital letter and one special character' , 400);
        }
      },
    },
    pImage: {
      type: String,
      default: 'https://res.cloudinary.com/dttgbrris/image/upload/v1681003634/3899618_mkmx9b.png',
    },
    verified:{
      type:Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
},{
  timestamps: true
})

schema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};


schema.pre('save', async function () {
  if (this.isModified('password')) 
    this.password = await bcryptjs.hash(this.password, 10);
});

export default model<IUser>("User",schema)
