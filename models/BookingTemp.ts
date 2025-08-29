import mongoose from 'mongoose'

const BookingTempSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true 
  },
  propertyId: { 
    type: String, 
    required: true 
  },
  roomId: { 
    type: String 
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
      default: 1
    },
    children: { 
      type: Number, 
      default: 0
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
    required: true
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
  nights: Number
}, {
  timestamps: true
})

export default mongoose.models.BookingTemp || mongoose.model('BookingTemp', BookingTempSchema)
