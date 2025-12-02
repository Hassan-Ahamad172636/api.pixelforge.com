import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const DBConnection = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_DB_URI}/${DB_NAME}`)
        console.log('Mongo db connected successfully!')
    } catch (error) {
        console.log(error)
    }
}

export default DBConnection;