import mongoose from 'mongoose';

const vehicleRecordSchema = new mongoose.Schema({
  factory: { type: mongoose.Schema.Types.ObjectId, ref: 'Factory', required: true },
  factoryName: { type: String, default: '' },
  individualName: { type: String, default: '' },
  useType: { type: String, enum: ['Personal', 'Factory'], default: 'Factory' },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  vehicleType: { type: String },
  category: { type: String, enum: ['2 Wheeler', '4 Wheeler', 'Cycle'], required: true },
  fuelType: { type: String, enum: ['Petrol', 'Diesel', 'None', 'Electric', 'None (Cycle)'], required: true },
  distance: { type: Number, required: true }, // C1
  co2Saved: { type: Number, required: true }, // Calculated based on formula
  documentUrl: { type: String }
}, { timestamps: true });

const VehicleRecord = mongoose.model('VehicleRecord', vehicleRecordSchema);
export default VehicleRecord;
