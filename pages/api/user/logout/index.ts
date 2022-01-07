import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import buildRouteHandler, {
  handlers,
} from "../../../../util/buildRouteHandler";

const handlers: handlers = {
  POST: async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader(
      "Set-Cookie",
      serialize("token", "deleted", {
        httpOnly: true,
        secure: process.env.NOVE_ENV === "production",
        path: "/",
        expires: new Date(0),
      })
    );
    return res.status(200).json({ success: true });
  },
};

export default buildRouteHandler(handlers);
