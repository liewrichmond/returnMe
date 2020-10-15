import mongoose, { Connection } from "mongoose"
// import { IReturn, Handler } from "./Returns"
import {IReturn, ReturnsSchema} from "./models/returns.model"

export class Controller {

    private db: Connection;
    private Returns: mongoose.Model<IReturn>;

    constructor(dbName = "test_returns") {
        //Connect to db
        const uri: string = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uxkyr.mongodb.net/${process.env.RETURNS_DB_NAME}?retryWrites=true&w=majority`;
        // mongoose.connect(uri, { useNewUrlParser: true });
        this.db = mongoose.createConnection(uri, { useNewUrlParser: true, useUnifiedTopology: true });

        // this.db = mongoose.connection;
        this.db.on('error', console.error.bind(console, 'connection error:'));

        //Initialize Model
        this.Returns = mongoose.models["returns"] || this.db.model<IReturn>("returns", ReturnsSchema)
    }

    public async listReturns(inUser: string): Promise<IReturn[]> {
        const returns:IReturn[] = await this.Returns.find({ userId: inUser });
        returns.reverse()
        this.db.close();
        return returns
    }

    public async createReturn(inReturn: IReturn): Promise<IReturn> {
        //Make new IReturn object
        const obj: IReturn = new this.Returns({ ...inReturn })
        //save it to model
        const result:IReturn = await obj.save();
        this.db.close();
        return result
    }

    public async deleteReturn(returnId: string): Promise<number> {
        const res: any = await this.Returns.deleteOne({ _id: returnId });
        this.db.close();
        return res.deletedCount
    }
}