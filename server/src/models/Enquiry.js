import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 100 },
    organisation: { type: String, trim: true, maxlength: 150, default: '' },
    phone: { type: String, required: true, trim: true, maxlength: 20 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 150 },
    productOrService: { type: String, required: true, trim: true, maxlength: 200 },
    quantity: { type: String, trim: true, maxlength: 50, default: '' },
    location: { type: String, trim: true, maxlength: 150, default: '' },
    requirements: { type: String, required: true, trim: true, maxlength: 2000 },
    status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
  },
  { timestamps: true }
);

export default mongoose.model('Enquiry', enquirySchema);
