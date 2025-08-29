import mongoose from 'mongoose'

// Force delete existing model if it exists
delete mongoose.models.Booking
delete mongoose.connection.models.Booking

const BookingSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true 
  },
  propertyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Property', 
    required: true 
  },
  roomId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Room', 
    required: false 
  },
  checkIn: { 
    type: Date, 
    required: true 
  },
  checkOut: { 
    type: Date, 
    required: true 
  },
  guests: {
    adults: { 
      type: Number, 
      default: 1, 
      required: true 
    },
    children: { 
      type: Number, 
      default: 0, 
      required: true 
    }
  },
  totalAmount: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String,
    default: 'pending'
  },
  confirmationNumber: { 
    type: String, 
    required: true, 
    unique: true 
  },
  guestName: { 
    type: String, 
    required: true 
  },
  guestEmail: { 
    type: String, 
    required: true 
  },
  guestPhone: String,
  propertyName: String,
  roomType: String,
  location: String,
  propertyImage: String,
  nights: Number,
  specialRequests: String,
  commission: { 
    type: Number, 
    default: 0 
  },
  rating: { 
    type: Number, 
    min: 1, 
    max: 5 
  }
}, {
  timestamps: true
})

export default mongoose.model('Booking', BookingSchema)
