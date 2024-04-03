import mongoose ,{ ConnectOptions } from "mongoose";
import { DatabaseConnectionError } from "../errors/database-connection-error";

const databaseConnectionAsync = async (databseUrl:string) => {
    mongoose.set('strictQuery',false);
    try {
        const DB_OPTIONS :ConnectOptions  = {dbName :'codemarch_customer_service'}
        await mongoose.connect(databseUrl, DB_OPTIONS);
        console.log('Database connection established')
    } catch (error) {
        throw new DatabaseConnectionError()
    }
}

export default databaseConnectionAsync;