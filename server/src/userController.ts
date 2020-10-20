import mongoose, { Connection } from "mongoose"
import { IUser, UserSchema } from "./models/user.model"
import bcrypt from "bcrypt"



export class Controller {

    private db: Connection;
    private Users: mongoose.Model<IUser>;

    constructor(dbName = "test_users") {
        //Connect to db
        const uri: string = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uxkyr.mongodb.net/${process.env.USER_DB_NAME}?retryWrites=true&w=majority`;
        // mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        this.db = mongoose.createConnection(uri, { useNewUrlParser: true, useUnifiedTopology: true });

        // this.db = mongoose.connection;
        this.db.on('error', console.error.bind(console, 'connection error:'));

        //Initialize Schema & Model
        this.Users = mongoose.models["users"] || this.db.model<IUser>("users", UserSchema)
    }

    private async userExists(username: string): Promise<IUser | null> {
        const user: IUser | null = await this.Users.findOne({ username: username }).exec()
        return user;
    }

    public async verify(username: string, password: string): Promise<IUser> {
        const user: IUser | null = await this.userExists(username);
        this.db.close()
        if (user === null) {
            throw (new Error("user does not exist!"))
        }
        const result: boolean = await bcrypt.compare(password, user.password)
        if(result) {
            return user
        }
        else {
            throw(new Error("Invalid Username and password!"))
        }
    }

    public async addNewUser(user: IUser): Promise<IUser> {
        const userExists: IUser | null = await this.userExists(user.username);
        if (userExists) {
            throw(new Error("Username is taken!"));
        }
        else {
            const newUser: IUser = new this.Users(user)
            const saltRounds = 10;
            const hash: string = await bcrypt.hash(newUser.password, saltRounds)
            newUser.password = hash
            try {
                const savedUser: IUser = await newUser.save();
                this.db.close()
                return (savedUser)
            }
            catch(err: any) {
                console.log("I have an error")
                throw(err)
            }
        }
    }

    public async getUserById(userId: string): Promise<IUser> {
        const user: IUser | null = await this.Users.findById({ _id: userId });
        this.db.close()
        if (user) {
            return user
        }
        else {
            throw(new Error("Invalid user id"))
        }
    }

}