import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['umrah', 'hajj'], required: true },
  image: { type: String, required: true },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  price: { type: Number, required: true },
  cleaning_fee: { type: Number, required: true },
  service_fee: { type: Number, required: true },
  description: { type: String },
  features: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Package = mongoose.model('Package', packageSchema);

export default Package; 