import  { Document, ObjectId } from 'mongoose';

enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

  interface IUser extends Document{
      _id: ObjectId;
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      userName: string;
      verified: boolean;
      pImage?: string;
      role: Role;
  }



export { IUser, Role }