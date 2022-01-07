import bcrypt from "bcrypt";
import { serialize } from "cookie";
import jwt from "jsonwebtoken";
import _ from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import { object, string } from "yup";
import config from "../../../lib/config";
import UserModel from "../../../models/user";
import buildRouteHandler, { handlers } from "../../../util/buildRouteHandler";

const handlers: handlers = {
  GET: async (req: NextApiRequest, res: NextApiResponse) => {
    const { cookies } = req;
    const cookiesSchema = object({
      token: string().required(),
    });
    const { token } = cookiesSchema.validateSync(cookies);
    const decodedToken = jwt.verify(token, config.JWT_SECRET);
    const user = await UserModel.findOne({
      username: (<any>decodedToken).username as string,
    });
    if (!user) {
      throw new Error("404");
    }
    const response = {
      username: user.username,
      hasDeviceToken: user.deviceToken !== null,
      feeds: user.feeds,
    };
    return res.status(200).json(response);
  },
  POST: async (req: NextApiRequest, res: NextApiResponse) => {
    const { body } = req;
    const bodySchema = object({
      username: string().required(),
      password: string().required(),
    });
    const user = bodySchema.validateSync(body);
    user.password = bcrypt.hashSync(user.password, 10);
    const createdUser = await UserModel.create({ deviceToken: null, ...user });
    const payload = _.pick(createdUser, "username");
    const token = jwt.sign(payload, config.JWT_SECRET);
    res.setHeader(
      "Set-Cookie",
      serialize("token", token, {
        httpOnly: true,
        secure: process.env.NOVE_ENV === "production",
        path: "/",
      })
    );
    return res.status(201).json({ success: true });
  },
};

export default buildRouteHandler(handlers);
