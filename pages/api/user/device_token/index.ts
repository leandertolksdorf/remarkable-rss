import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { Remarkable } from "remarkable-typescript";
import { object, string } from "yup";
import config from "../../../../lib/config";
import UserModel from "../../../../models/user";
import buildRouteHandler, {
  handlers,
} from "../../../../util/buildRouteHandler";

const handlers: handlers = {
  POST: async (req: NextApiRequest, res: NextApiResponse) => {
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
      throw new Error("401");
    }

    const { body } = req;
    const bodySchema = object({
      oneTimeCode: string()
        .matches(/[a-zA-Z]{8}/)
        .required(),
    });
    const { oneTimeCode } = bodySchema.validateSync(body);

    const client = new Remarkable();
    const deviceToken = await client.register({ code: oneTimeCode });
    await client.refreshToken();
    const directoryId = await client.createDirectory(
      "remarkable-rss", // directory name
      "remarkable-rss" // directory id
    );

    user.deviceToken = deviceToken;
    user.save();

    return res.status(201).json({ success: true });
  },
};

export default buildRouteHandler(handlers);
