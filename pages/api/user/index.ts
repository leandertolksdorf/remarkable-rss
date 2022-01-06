import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import _ from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import { object, string, ValidationError } from "yup";
import config from "../../../lib/config";
import { withDatabase } from "../../../lib/mongoose";
import { UserModel } from "../../../models/user";

const postBodySchema = object({
  username: string().required(),
  password: string().required(),
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { body, method } = req;

  switch (method) {
    case "GET":
      break;
    case "POST":
      try {
        const user = postBodySchema.validateSync(body);
        user.password = bcrypt.hashSync(user.password, 10);
        const createdUser = await UserModel.create(user);
        const payload = _.pick(createdUser, "username");
        const token = jwt.sign(payload, config.JWT_SECRET);
        return res
          .status(201)
          .json({ success: true, token: "Bearer " + token });
      } catch (e: any) {
        let status;
        if (e instanceof ValidationError) {
          status = 400;
        } else if (e.code === 11000) {
          status = 409;
        } else {
          status = 500;
        }
        return res.status(status).json({ success: false });
      }

      break;
  }
  res.status(200).send("OK");
}

export default withDatabase(handler);
