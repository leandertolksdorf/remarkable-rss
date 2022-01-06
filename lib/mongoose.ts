import mongoose, { connect, ConnectOptions } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";

const MONGO_URL = process.env.MONGO_URL as string;

if (!MONGO_URL) {
  throw new Error("MONGO_URL must be defined in environment");
}

const options: ConnectOptions = {};

export const withDatabase = (
  handler: (req: NextApiRequest, res: NextApiResponse) => void
) => {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    if (mongoose.connection.readyState === 0) {
      await connect(MONGO_URL, options);
    }

    await handler(req, res);

    mongoose.connection.close();
  };
};
