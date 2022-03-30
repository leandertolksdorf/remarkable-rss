import cheerio from "cheerio";
import { NextApiRequest, NextApiResponse } from "next";
import { Remarkable } from "remarkable-typescript";
import Parser from "rss-parser";
import UserModel from "../../../models/user";
import { v4 as uuidv4 } from "uuid";
import buildRouteHandler, { handlers } from "../../../util/buildRouteHandler";
import { saveItemToRemarkable } from "../../../util/saveItemToRemarkable";
import { getRemarkableFolderId } from "../../../util/getRemarkableFolderId";

const handlers: handlers = {
  GET: async (req: NextApiRequest, res: NextApiResponse) => {
    if (!(req.headers["api-key"] === process.env.API_KEY)) {
      throw new Error("401");
    }

    const parser = new Parser();

    const users = await UserModel.find({ deviceToken: { $ne: null } });

    for (const user of users) {
      if (!user.deviceToken) continue;

      const remarkableClient = new Remarkable({
        deviceToken: user.deviceToken,
      });
      await remarkableClient.refreshToken();

      const rssFolderId = await getRemarkableFolderId({
        name: "remarkable-rss",
        remarkableClient,
      });

      for (const feed of user.feeds) {
        const parsed = await parser.parseURL(feed.url);

        const itemsToConvert = parsed.items.filter(
          item => new Date(item.isoDate as string) > new Date(feed.lastParsed)
        );

        feed.lastParsed = new Date();
        if (!itemsToConvert.length) continue;

        const feedFolderId = await getRemarkableFolderId({
          name: feed.title,
          remarkableClient,
          parentFolderId: rssFolderId,
        });

        const savedItems = Promise.all(
          itemsToConvert
            .filter(item => item.link)
            .map(
              async item =>
                await saveItemToRemarkable({
                  item,
                  remarkableClient,
                  folderId: feedFolderId,
                })
            )
        );
      }
      await user.save();
    }

    return res.status(200).json({ success: true });
  },
};

export default buildRouteHandler(handlers);
