import mongoose, { Document, Schema } from 'mongoose';

export interface IRandomHistory extends Document {
  user?: mongoose.Types.ObjectId;
  mode: 'restaurant';
  filters: Record<string, unknown>;
  result: {
    restaurantId: string;
    snapshot: Record<string, unknown>;
  };
  createdAt: Date;
}

const RandomHistorySchema = new Schema<IRandomHistory>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    mode: { type: String, enum: ['restaurant'], default: 'restaurant' },
    filters: { type: Schema.Types.Mixed, default: {} },
    result: {
      restaurantId: { type: String, required: true },
      snapshot: { type: Schema.Types.Mixed, required: true },
    },
  },
  { timestamps: true }
);

export const RandomHistory = mongoose.model<IRandomHistory>('RandomHistory', RandomHistorySchema);
