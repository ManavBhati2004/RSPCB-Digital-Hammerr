import mongoose from 'mongoose';

const certificateRecordSchema = new mongoose.Schema({
  name: { type: String, default: 'Participant' },
  co2: { type: Number, default: 0 },
  unit: { type: String, default: 'tonnes' },
  source: { type: String, enum: ['electricity', 'vehicle'], required: true },
  useType: { type: String, enum: ['Personal', 'Factory'], default: 'Personal' },
}, { timestamps: true });

const CertificateRecord = mongoose.model('CertificateRecord', certificateRecordSchema);
export default CertificateRecord;
