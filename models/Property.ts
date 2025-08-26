import mongoose from 'mongoose'

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
})

export default mongoose.models.Property || mongoose.model('Property', PropertySchema)