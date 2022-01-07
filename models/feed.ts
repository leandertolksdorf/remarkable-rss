import mongoose from "mongoose";

export interface IFeed extends mongoose.Document {
  title: string;
  url: string;
  lastParsed: Date;
}

export const FeedSchema = new mongoose.Schema<IFeed>({
  url: { type: String, required: true },
  title: { type: String, required: true },
  lastParsed: Date,
});

const FeedModel: mongoose.Model<IFeed> =
  mongoose.models.Feed || mongoose.model("Feed", FeedSchema);

export default FeedModel;
