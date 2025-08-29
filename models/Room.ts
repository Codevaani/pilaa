import mongoose, { Document } from 'mongoose';

export interface IRoom extends Document {
  propertyId: mongoose.Schema.Types.ObjectId;
  name: string;
  description: string;
  images: string[];
  type: string;
  capacity: {
    adults: number;
    children: number;
  };
  amenities: string[];
  price: number;
  availability: boolean;
  totalRooms: number;
  availableRooms: number;
}

const RoomSchema = new mongoose.Schema({
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  name: { type: String, required: true },
  description: String,
  images: [String],
  type: String,
  capacity: {
    adults: Number,
    children: Number
  },
  amenities: [String],
  price: { type: Number, required: true },
  availability: { type: Boolean, default: true },
  totalRooms: Number,
  availableRooms: Number
}, {
  timestamps: true
});

export default mongoose.models.Room || mongoose.model<IRoom>('Room', RoomSchema);