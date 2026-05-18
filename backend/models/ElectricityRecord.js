import mongoose from 'mongoose';

const electricityRecordSchema = new mongoose.Schema({
  factory: { type: mongoose.Schema.Types.ObjectId, ref: 'Factory', required: true },
  factoryName: { type: String, default: '' },
  useType: { type: String, enum: ['Personal', 'Factory'], default: 'Factory' },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  consumption: { type: Number, required: true }, // C1: Monthly Consumption
  nonConsumption: { type: Number, required: true }, // C2: Non-consumption or grid saving
  co2Saved: { type: Number, required: true }, // C1 * C2 * 0.001134
  documentUrl: { type: String }, // GridFS file ID or URL
  docName: { type: String }
}, { timestamps: true });

const ElectricityRecord = mongoose.model('ElectricityRecord', electricityRecordSchema);
export default ElectricityRecord;
