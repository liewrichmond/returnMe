import {Document, Schema} from "mongoose";

export interface IUser extends Document{
    username: string,
    password: string,
    name: string,
    userId: string
}

export const UserSchema: Schema<IUser> = new Schema<IUser> ({
    username: String,
    password: String,
    name: String,
    userId: Number
})

