// Wipes calculator data and accounts from MongoDB. Run from the backend directory:
//   node scripts/reset-data.js
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import ElectricityRecord from '../models/ElectricityRecord.js';
import VehicleRecord from '../models/VehicleRecord.js';
import PoolingRecord from '../models/PoolingRecord.js';
import Factory from '../models/Factory.js';
import User from '../models/User.js';

dotenv.config();

const targets = [
  ['ElectricityRecord', ElectricityRecord],
  ['VehicleRecord',     VehicleRecord],
  ['PoolingRecord',     PoolingRecord],
  ['Factory',           Factory],
  ['User',              User],
];

(async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/emission_tracking';
  await mongoose.connect(uri);
  console.log(`connected to ${mongoose.connection.host}/${mongoose.connection.name}`);

  for (const [name, Model] of targets) {
    const before = await Model.countDocuments();
    const { deletedCount } = await Model.deleteMany({});
    console.log(`${name.padEnd(20)} before=${before}  deleted=${deletedCount}  after=0`);
  }

  await mongoose.disconnect();
  console.log('done.');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
