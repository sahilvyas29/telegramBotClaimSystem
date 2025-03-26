import mongoose, { Document, Schema } from 'mongoose';

export interface IClaim extends Document {
  walletAddress: string;
  telegramId: string;
  txHash: string;
  claimedAt: Date;
}

const ClaimSchema: Schema = new Schema({
  walletAddress: { type: String, required: true, unique: true },
  telegramId: { type: String, required: true },
  txHash: { type: String, required: true },
  claimedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IClaim>('Claim', ClaimSchema);
