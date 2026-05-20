import express from 'express';
import ElectricityRecord from '../models/ElectricityRecord.js';
import VehicleRecord from '../models/VehicleRecord.js';
import Factory from '../models/Factory.js';

const router = express.Router();

const PERSONAL_REG = 'PERSONAL-USER';
const DEFAULT_FACTORY_REG = 'RSPCB-981';

async function resolveFactory({ useType, factoryName }) {
  const isPersonal = useType === 'Personal';
  const regNumber = isPersonal
    ? PERSONAL_REG
    : (factoryName ? `RSPCB-${factoryName.replace(/\s+/g, '-').toUpperCase().slice(0, 24)}` : DEFAULT_FACTORY_REG);

  const displayName = isPersonal
    ? (factoryName?.trim() ? `Personal — ${factoryName.trim()}` : 'Personal User')
    : (factoryName?.trim() || 'Rajasthan Steels Ltd.');

  let factory = await Factory.findOne({ registrationNumber: regNumber });
  if (!factory) {
    factory = await Factory.create({
      name: displayName,
      registrationNumber: regNumber,
      address: isPersonal ? 'N/A' : 'Jaipur',
      city: isPersonal ? 'N/A' : 'Jaipur'
    });
  } else if (factory.name !== displayName && factoryName?.trim()) {
    factory.name = displayName;
    await factory.save();
  }
  return factory;
}

router.get('/stats', async (req, res) => {
  try {
    const electricity = await ElectricityRecord.find().populate('factory').sort({ createdAt: 1 });
    const vehicles = await VehicleRecord.find().populate('factory').sort({ createdAt: 1 });
    const factories = await Factory.find();

    const trendMap = {};
    let totalCO2Saved = 0;
    let totalEnergyOffset = 0;

    electricity.forEach(record => {
      const date = new Date(record.createdAt);
      const monthStr = date.toLocaleString('default', { month: 'short' });
      if (!trendMap[monthStr]) trendMap[monthStr] = { name: monthStr, co2: 0, energy: 0 };
      trendMap[monthStr].co2 += record.co2Saved;
      trendMap[monthStr].energy += record.consumption;
      totalCO2Saved += record.co2Saved;
      totalEnergyOffset += record.consumption;
    });

    let totalVehicleCO2 = 0;
    vehicles.forEach(record => {
      const date = new Date(record.createdAt);
      const monthStr = date.toLocaleString('default', { month: 'short' });
      if (!trendMap[monthStr]) trendMap[monthStr] = { name: monthStr, co2: 0, energy: 0 };
      // Vehicle co2Saved is in Kg; convert to Tons before aggregating with electricity tons.
      trendMap[monthStr].co2 += (record.co2Saved || 0) / 1000;
      totalVehicleCO2 += record.co2Saved || 0;
    });

    let trendData = Object.values(trendMap);
    if (trendData.length === 0) {
       trendData = [
         { name: 'Jan', co2: 40, energy: 24 },
         { name: 'Feb', co2: 30, energy: 13 },
         { name: 'Mar', co2: 20, energy: 98 }
       ];
    }

    res.json({
      factories,
      electricity,
      vehicles,
      trendData,
      totalCO2Saved: totalCO2Saved || 1200000,
      totalEnergyOffset: totalEnergyOffset || 450000,
      totalVehicleCO2: totalVehicleCO2 || 0,
      factoryCount: factories.length || 8420
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/electricity', async (req, res) => {
  try {
    const { consumption, nonConsumption, co2Saved, documentUrl, docName, factoryName, individualName, useType } = req.body;
    const factory = await resolveFactory({ useType, factoryName });

    const record = await ElectricityRecord.create({
      factory: factory._id,
      factoryName: factoryName || '',
      individualName: individualName || '',
      useType: useType === 'Personal' ? 'Personal' : 'Factory',
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      consumption: Number(consumption) || 0,
      nonConsumption: Number(nonConsumption) || 0,
      co2Saved: Number(co2Saved) || 0,
      documentUrl,
      docName: docName || 'Unknown Document'
    });
    const populated = await record.populate('factory');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/vehicle', async (req, res) => {
  try {
    const { category, fuelType, distance, co2Saved, factoryName, individualName, useType } = req.body;
    const factory = await resolveFactory({ useType, factoryName });

    const record = await VehicleRecord.create({
      factory: factory._id,
      factoryName: factoryName || '',
      individualName: individualName || '',
      useType: useType === 'Personal' ? 'Personal' : 'Factory',
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      vehicleType: category || 'Unknown',
      category: category || '2 Wheeler',
      fuelType: fuelType || 'None',
      distance: Number(distance) || 0,
      co2Saved: Number(co2Saved) || 0
    });
    const populated = await record.populate('factory');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/leaderboard', async (req, res) => {
  try {
    const LIMIT = 20;

    const electricityFactories = await ElectricityRecord.aggregate([
      { $match: { useType: 'Factory' } },
      { $lookup: { from: 'factories', localField: 'factory', foreignField: '_id', as: 'factoryDoc' } },
      { $unwind: { path: '$factoryDoc', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$factory',
          name: { $first: { $ifNull: ['$factoryDoc.name', { $ifNull: ['$factoryName', 'Unknown Factory'] }] } },
          co2Saved: { $sum: '$co2Saved' },
          energySaved: { $sum: { $add: [{ $ifNull: ['$consumption', 0] }, { $ifNull: ['$nonConsumption', 0] }] } },
          entries: { $sum: 1 }
        }
      },
      { $sort: { co2Saved: -1 } },
      { $limit: LIMIT }
    ]);

    const electricityIndividuals = await ElectricityRecord.aggregate([
      { $match: { useType: 'Personal' } },
      {
        $group: {
          _id: {
            $let: {
              vars: {
                trimmedIndiv: { $trim: { input: { $ifNull: ['$individualName', ''] } } },
                trimmedFactory: { $trim: { input: { $ifNull: ['$factoryName', ''] } } }
              },
              in: {
                $cond: [
                  { $gt: [{ $strLenCP: '$$trimmedIndiv' }, 0] },
                  '$$trimmedIndiv',
                  { $cond: [{ $gt: [{ $strLenCP: '$$trimmedFactory' }, 0] }, '$$trimmedFactory', 'Anonymous'] }
                ]
              }
            }
          },
          co2Saved: { $sum: '$co2Saved' },
          energySaved: { $sum: { $add: [{ $ifNull: ['$consumption', 0] }, { $ifNull: ['$nonConsumption', 0] }] } },
          entries: { $sum: 1 }
        }
      },
      { $project: { _id: 0, name: '$_id', co2Saved: 1, energySaved: 1, entries: 1 } },
      { $sort: { co2Saved: -1 } },
      { $limit: LIMIT }
    ]);

    const fuelFactories = await VehicleRecord.aggregate([
      { $match: { useType: 'Factory' } },
      { $lookup: { from: 'factories', localField: 'factory', foreignField: '_id', as: 'factoryDoc' } },
      { $unwind: { path: '$factoryDoc', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$factory',
          name: { $first: { $ifNull: ['$factoryDoc.name', { $ifNull: ['$factoryName', 'Unknown Factory'] }] } },
          co2Saved: { $sum: '$co2Saved' },
          distance: { $sum: { $ifNull: ['$distance', 0] } },
          entries: { $sum: 1 }
        }
      },
      { $sort: { co2Saved: -1 } },
      { $limit: LIMIT }
    ]);

    const fuelIndividuals = await VehicleRecord.aggregate([
      { $match: { useType: 'Personal' } },
      {
        $group: {
          _id: {
            $let: {
              vars: {
                trimmedIndiv: { $trim: { input: { $ifNull: ['$individualName', ''] } } },
                trimmedFactory: { $trim: { input: { $ifNull: ['$factoryName', ''] } } }
              },
              in: {
                $cond: [
                  { $gt: [{ $strLenCP: '$$trimmedIndiv' }, 0] },
                  '$$trimmedIndiv',
                  { $cond: [{ $gt: [{ $strLenCP: '$$trimmedFactory' }, 0] }, '$$trimmedFactory', 'Anonymous'] }
                ]
              }
            }
          },
          co2Saved: { $sum: '$co2Saved' },
          distance: { $sum: { $ifNull: ['$distance', 0] } },
          entries: { $sum: 1 }
        }
      },
      { $project: { _id: 0, name: '$_id', co2Saved: 1, distance: 1, entries: 1 } },
      { $sort: { co2Saved: -1 } },
      { $limit: LIMIT }
    ]);

    const rankList = (arr) => arr.map((entry, i) => ({ rank: i + 1, ...entry, _id: undefined }));

    res.json({
      electricity: {
        factories: rankList(electricityFactories),
        individuals: rankList(electricityIndividuals)
      },
      fuel: {
        factories: rankList(fuelFactories),
        individuals: rankList(fuelIndividuals)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/leaderboard/combined', async (req, res) => {
  try {
    const nameGroupStage = {
      $group: {
        _id: {
          $let: {
            vars: {
              trimmedIndiv: { $trim: { input: { $ifNull: ['$individualName', ''] } } },
              trimmedFactory: { $trim: { input: { $ifNull: ['$factoryName', ''] } } }
            },
            in: {
              $cond: [
                { $gt: [{ $strLenCP: '$$trimmedIndiv' }, 0] },
                '$$trimmedIndiv',
                { $cond: [{ $gt: [{ $strLenCP: '$$trimmedFactory' }, 0] }, '$$trimmedFactory', 'Anonymous'] }
              ]
            }
          }
        },
        co2Saved: { $sum: { $ifNull: ['$co2Saved', 0] } }
      }
    };

    const [electricityTotals, vehicleTotals] = await Promise.all([
      ElectricityRecord.aggregate([nameGroupStage]),
      VehicleRecord.aggregate([nameGroupStage])
    ]);

    const byName = new Map();
    for (const row of electricityTotals) {
      byName.set(row._id, { name: row._id, electricity: row.co2Saved, vehicle: 0 });
    }
    for (const row of vehicleTotals) {
      const existing = byName.get(row._id);
      if (existing) existing.vehicle = row.co2Saved;
      else byName.set(row._id, { name: row._id, electricity: 0, vehicle: row.co2Saved });
    }

    const combined = [...byName.values()]
      .map((e) => {
        const hasElec = e.electricity > 0;
        const hasVeh = e.vehicle > 0;
        let category = 'Combined';
        if (hasElec && !hasVeh) category = 'Electricity';
        else if (!hasElec && hasVeh) category = 'Vehicle';
        return {
          username: e.name,
          category,
          totalCO2: e.electricity + e.vehicle
        };
      })
      .filter((e) => e.totalCO2 > 0)
      .sort((a, b) => b.totalCO2 - a.totalCO2)
      .slice(0, 50)
      .map((e, i) => ({ rank: i + 1, ...e }));

    res.json(combined);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
