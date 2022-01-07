import mongoose from "mongoose";
import { FeedSchema, IFeed } from "./feed";

export interface IUser extends mongoose.Document {
  username: string;
  password: string;
  deviceToken: string | null;
  feeds: IFeed[];
}

export const UserSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  deviceToken: { type: String },
  feeds: [FeedSchema],
});

const UserModel: mongoose.Model<IUser> =
  mongoose.models.User || mongoose.model("User", UserSchema);

export default UserModel;
