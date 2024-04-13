import { Document, ObjectId } from 'mongoose';

enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

enum ORDER {
  ASC = 1,
  DESC = -1,
}

  interface IUser extends Document{
      _id: ObjectId;
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      userName: string;
      activated: boolean;
      activatedToken: string;
      pImage?: string;
      role: Role;
      comparePassword(password: string): Promise<Boolean>;
  }


export { IUser, Role, ORDER }