import {Document, Schema} from "mongoose";

export interface IUser extends Document{
    username: string,
    password: string,
    name: string,
}

export const UserSchema: Schema<IUser> = new Schema<IUser> ({
    username: {type: String, required: true},
    password: {type: String, required: true},
    name: {type: String, required: false},
})

