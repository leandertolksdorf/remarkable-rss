import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import Parser from "rss-parser";
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
      url: string().url().required(),
    });
    const { url } = bodySchema.validateSync(body);

    const alreadyHasFeed =
      (await user.feeds.find((feed) => feed.url === url)) !== undefined;

    if (alreadyHasFeed) {
      throw new Error("409");
    }

    const RSSParser = new Parser();
    const parsedFeed = await RSSParser.parseURL(url);

    const feed = {
      url: url,
      title: parsedFeed.title || url,
      lastParsed: new Date(),
    };

    user.feeds.push(feed);
    await user.save();

    return res.status(201).json({ success: true });
  },
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
      throw new Error("401");
    }

    return res.status(201).json({ success: true, feeds: user.feeds });
  },
};

export default buildRouteHandler(handlers);
