import mongoose from 'mongoose';

const factorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  registrationNumber: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, default: 'Rajasthan' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sustainabilityScore: { type: Number, default: 0 },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }
}, { timestamps: true });

const Factory = mongoose.model('Factory', factorySchema);
export default Factory;
