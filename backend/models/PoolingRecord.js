import mongoose from 'mongoose';

const poolingRecordSchema = new mongoose.Schema({
  factory: { type: mongoose.Schema.Types.ObjectId, ref: 'Factory', required: true },
  factoryName: { type: String, default: '' },
  individualName: { type: String, default: '' },
  useType: { type: String, enum: ['Personal', 'Factory'], default: 'Factory' },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  vehicleType: { type: String, enum: ['Car', 'Bike'], required: true },
  individualDistanceSum: { type: Number, required: true },
  sharedDistance: { type: Number, required: true },
  peopleCount: { type: Number, required: true },
  co2ReducedPerPerson: { type: Number, required: true }
}, { timestamps: true });

const PoolingRecord = mongoose.model('PoolingRecord', poolingRecordSchema);
export default PoolingRecord;
