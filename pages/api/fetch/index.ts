import cheerio from "cheerio";
import { NextApiRequest, NextApiResponse } from "next";
import { Remarkable } from "remarkable-typescript";
import Parser from "rss-parser";
import pdf from "html-pdf";
import UserModel from "../../../models/user";
import { v4 as uuidv4 } from "uuid";
import buildRouteHandler, { handlers } from "../../../util/buildRouteHandler";

const handlers: handlers = {
  GET: async (req: NextApiRequest, res: NextApiResponse) => {
    const { headers } = req;
    const { api_key } = headers;
    console.log(api_key);
    if (!(api_key === process.env.API_KEY)) {
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

      const remarkableItems = await remarkableClient.getAllItems();
      const remarkableRssFolder = remarkableItems.find(
        (item) =>
          item.VissibleName === "remarkable-rss" && item.Parent !== "trash"
      );
      const remarkableRssFolderId =
        remarkableRssFolder?.ID ||
        (await remarkableClient.createDirectory("remarkable-rss", uuidv4()));

      const feeds = user.feeds;
      for (const feed of feeds) {
        const parsed = await parser.parseURL(feed.url);
        console.log(feed.lastParsed);

        const itemsToConvert = parsed.items.filter(
          (item) => new Date(item.isoDate as string) > new Date(feed.lastParsed)
        );

        feed.lastParsed = new Date();
        if (itemsToConvert.length === 0) continue;

        const remarkableFeedFolder = remarkableItems.find(
          (item) =>
            item.VissibleName === feed.title &&
            item.Parent === remarkableRssFolderId
        );
        const remarkableFeedFolderId =
          remarkableFeedFolder?.ID ||
          (await remarkableClient.createDirectory(
            feed.title,
            uuidv4(),
            remarkableRssFolderId
          ));

        for (const item of itemsToConvert) {
          if (!item.link) continue;
          const response = await fetch(item.link);
          const rawHtml = await response.text();
          const $ = cheerio.load(rawHtml);
          $(
            [
              "script",
              "footer",
              "head",
              "svg",
              "nav",
              "input",
              "button",
              "img",
              "*[class*=menu]",
              "*[class*=navigation]",
              "*[class*=nav]",
              "*[class*=sidebar]",
              "*[class*=recommendation]",
              "*[class*=newsletter]",
              "*[class*=cookie]",
            ].join(", ")
          ).remove();
          const body = $.html();
          const minified = body.replace(/>\s+|\s+</g, (m) => m.trim());
          const pdfOptions = {
            border: "1cm",
          };
          await pdf
            .create(minified, pdfOptions)
            .toBuffer(async function (err, buffer) {
              const pdfUploadedId = await remarkableClient.uploadPDF(
                item.title as string,
                uuidv4(),
                buffer,
                remarkableFeedFolderId
              );
            });
        }
      }
      await user.save();
    }

    return res.status(200).json({ success: true });
  },
};

export default buildRouteHandler(handlers);
