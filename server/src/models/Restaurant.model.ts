import mongoose, { Document, Schema } from 'mongoose';

export type PriceRange = 'cheap' | 'medium' | 'premium';

export interface IRestaurant extends Document {
  name: string;
  owner?: mongoose.Types.ObjectId;
  description: string;
  address: string;
  priceRange: PriceRange;
  tags: string[];
  menus?: string[];
  imageUrl?: string;
  googleMapsUrl?: string;
  sourceUrl?: string;
  lineManUrl?: string;
  grabUrl?: string;
  isOpen: boolean;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

const RestaurantSchema = new Schema<IRestaurant>(
  {
    name: { type: String, required: true, trim: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    description: { type: String, default: '' },
    address: { type: String, default: '' },
    priceRange: {
      type: String,
      enum: ['cheap', 'medium', 'premium'],
      required: true,
      default: 'medium',
    },
    tags: { type: [String], default: [] },
    menus: { type: [String], default: [] },
    imageUrl: { type: String, default: '' },
    googleMapsUrl: { type: String, default: '' },
    sourceUrl: { type: String, default: '' },
    lineManUrl: { type: String, default: '' },
    grabUrl: { type: String, default: '' },
    isOpen: { type: Boolean, default: true },
    rating: { type: Number, min: 0, max: 5, default: 0 },
  },
  { timestamps: true }
);

// Index for filter queries
RestaurantSchema.index({ tags: 1, priceRange: 1, isOpen: 1 });

export const Restaurant = mongoose.model<IRestaurant>('Restaurant', RestaurantSchema);
