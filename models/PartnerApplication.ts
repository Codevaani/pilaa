import mongoose from 'mongoose'

const PartnerApplicationSchema = new mongoose.Schema({
  applicantName: { type: String, required: true },
  businessName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  location: { type: String, required: true },
  propertyType: { type: String, required: true },
  documents: {
    selfie: String,
    aadharFront: String,
    aadharBack: String,
    businessLicense: String,
    ownershipProof: String,
    taxDocuments: String
  },
  status: { 
    type: String, 
    enum: ['pending', 'under_review', 'approved', 'rejected'], 
    default: 'pending' 
  },
  notes: { type: String, default: '' },
  userId: String
}, {
  timestamps: true
})

export default mongoose.models.PartnerApplication || mongoose.model('PartnerApplication', PartnerApplicationSchema)