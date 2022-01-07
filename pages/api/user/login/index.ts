import bcrypt from "bcrypt";
import { serialize } from "cookie";
import jwt from "jsonwebtoken";
import _ from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import { object, string } from "yup";
import config from "../../../../lib/config";
import UserModel from "../../../../models/user";
import buildRouteHandler, {
  handlers,
} from "../../../../util/buildRouteHandler";

const handlers: handlers = {
  POST: async (req: NextApiRequest, res: NextApiResponse) => {
    const { body } = req;
    const bodySchema = object({
      username: string().required(),
      password: string().required(),
    });
    const { username, password } = bodySchema.validateSync(body);
    const user = await UserModel.findOne({ username });

    if (!user) {
      throw new Error("404");
    }

    const isValidPassword = bcrypt.compareSync(password, user.password);

    if (!isValidPassword) {
      throw new Error("401");
    }

    const payload = _.pick(user, "username");
    const token = jwt.sign(payload, config.JWT_SECRET);
    res.setHeader(
      "Set-Cookie",
      serialize("token", token, {
        httpOnly: true,
        secure: process.env.NOVE_ENV === "production",
        path: "/",
      })
    );
    return res.status(200).json({ success: true });
  },
};

export default buildRouteHandler(handlers);
