import { NextApiRequest, NextApiResponse } from "next";
import { ValidationError } from "yup";
import connectToDatabase from "../lib/mongoose";

type method = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

type handler = (req: NextApiRequest, res: NextApiResponse) => void;

export type handlers = {
  [key in method]?: handler;
};

function buildRouteHandler(handlers: handlers) {
  async function handler(req: NextApiRequest, res: NextApiResponse) {
    connectToDatabase();
    const method = req.method as method;
    try {
      if (handlers[method] === undefined) {
        throw new Error("404");
      }
      await (handlers[method] as handler)(req, res);
    } catch (e: any) {
      console.log(e);
      let status;
      if (e instanceof ValidationError) {
        status = 400;
      } else if (e.code === 11000 || e.message === "409") {
        status = 409;
      } else if (e.message === "404") {
        status = 404;
      } else if (e.message === "401") {
        status = 401;
      } else if (e.code === "ERR_NON_2XX_3XX_RESPONSE") {
        status = 400;
      } else {
        status = 500;
      }
      return res.status(status).json({ success: false });
    }
  }
  return handler;
}

export default buildRouteHandler;
