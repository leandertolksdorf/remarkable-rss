import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { object, string } from "yup";
import config from "../../../../lib/config";
import UserModel from "../../../../models/user";
import buildRouteHandler, {
  handlers,
} from "../../../../util/buildRouteHandler";
const handlers: handlers = {
  DELETE: async (req: NextApiRequest, res: NextApiResponse) => {
    const { cookies, query } = req;
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

    const querySchema = object({
      id: string().required(),
    });
    const { id } = querySchema.validateSync(query);

    const feed = await user.feeds.id(id);

    if (!feed) {
      throw new Error("404");
    }
    await feed.remove();
    await user.save();

    return res.status(200).json({ success: true });
  },
};

export default buildRouteHandler(handlers);
