import { connect, ConnectOptions } from "mongoose";
import config from "./config";

const MONGO_URL = config.MONGO_URL;

if (!MONGO_URL) {
  throw new Error("MONGO_URL must be defined in environment");
}

const options: ConnectOptions = {
  autoIndex: true,
  autoCreate: true,
};

let cachedMongooseConnection = (global as any).mongoose;

if (!cachedMongooseConnection) {
  cachedMongooseConnection = (global as any).mongoose = null;
}

async function connectToDatabase() {
  if (cachedMongooseConnection) {
    return cachedMongooseConnection;
  }

  cachedMongooseConnection = await connect(MONGO_URL, options);
  return cachedMongooseConnection;
}

export default connectToDatabase;
