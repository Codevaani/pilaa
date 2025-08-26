import mongoose from 'mongoose'

const BookingSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: false },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  guests: {
    adults: Number,
    children: Number
  },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['confirmed', 'completed', 'cancelled', 'upcoming'], default: 'confirmed' },
  confirmationNumber: String
}, {
  timestamps: true
})

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema)