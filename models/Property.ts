import mongoose, { Document } from 'mongoose';

export interface IProperty extends Document {
  name: string;
  slug: string;
  description: string;
  images: string[];
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  amenities: string[];
  propertyType: 'hotel' | 'resort' | 'villa' | 'apartment';
  rating: number;
  reviewCount: number;
  priceRange: {
    min: number;
    max: number;
  };
  partnerId: string;
  status: 'active' | 'pending' | 'suspended';
}

const PropertySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  images: [String],
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  amenities: [String],
  propertyType: { type: String, enum: ['hotel', 'resort', 'villa', 'apartment'] },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  priceRange: {
    min: Number,
    max: Number
  },
  partnerId: String,
  status: { type: String, enum: ['active', 'pending', 'suspended'], default: 'pending' }
}, {
  timestamps: true
});

export default mongoose.models.Property || mongoose.model<IProperty>('Property', PropertySchema);