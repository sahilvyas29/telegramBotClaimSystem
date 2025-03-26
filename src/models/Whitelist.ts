import mongoose, { Document, Schema } from 'mongoose';

export interface IWhitelist extends Document {
  walletAddress: string;
}

const WhitelistSchema: Schema = new Schema({
  walletAddress: { type: String, required: true, unique: true },
});

export default mongoose.model<IWhitelist>('Whitelist', WhitelistSchema);
