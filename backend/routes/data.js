import express from 'express';
import ElectricityRecord from '../models/ElectricityRecord.js';
import VehicleRecord from '../models/VehicleRecord.js';
import PoolingRecord from '../models/PoolingRecord.js';
import Factory from '../models/Factory.js';
import CertificateRecord from '../models/CertificateRecord.js';

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

    const trendData = Object.values(trendMap);

    const factoryUnits = factories.filter(f => f.registrationNumber !== PERSONAL_REG).length;
    const personalNames = new Set();
    const pickPersonalName = (r) => {
      if (r.useType !== 'Personal') return null;
      const n = (r.individualName && r.individualName.trim()) ||
                (r.factoryName && r.factoryName.trim()) ||
                'anonymous';
      return n.toLowerCase();
    };
    for (const r of electricity) { const n = pickPersonalName(r); if (n) personalNames.add(n); }
    for (const r of vehicles)    { const n = pickPersonalName(r); if (n) personalNames.add(n); }
    const registeredUnits = factoryUnits + personalNames.size;

    const sumKg =
      electricity.reduce((acc, r) => acc + (Number(r.co2Saved) || 0), 0) +
      vehicles.reduce((acc, r) => acc + (Number(r.co2Saved) || 0), 0);
    const totalCO2Tonnes = sumKg / 1000;

    res.json({
      factories,
      electricity,
      vehicles,
      trendData,
      totalCO2Saved,
      totalEnergyOffset,
      totalVehicleCO2,
      factoryCount: factories.length,
      registeredUnits,
      totalCO2Tonnes
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

router.post('/pooling', async (req, res) => {
  try {
    const { vehicleType, individualDistanceSum, sharedDistance, peopleCount, co2ReducedPerPerson, factoryName, individualName, useType } = req.body;
    const factory = await resolveFactory({ useType, factoryName });

    const record = await PoolingRecord.create({
      factory: factory._id,
      factoryName: factoryName || '',
      individualName: individualName || '',
      useType: useType === 'Personal' ? 'Personal' : 'Factory',
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      vehicleType: vehicleType === 'Bike' ? 'Bike' : 'Car',
      individualDistanceSum: Number(individualDistanceSum) || 0,
      sharedDistance: Number(sharedDistance) || 0,
      peopleCount: Number(peopleCount) || 0,
      co2ReducedPerPerson: Number(co2ReducedPerPerson) || 0
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
          name: {
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
          useType: { $ifNull: ['$useType', 'Personal'] }
        },
        co2Saved: { $sum: { $ifNull: ['$co2Saved', 0] } }
      }
    };

    const [electricityTotals, vehicleTotals] = await Promise.all([
      ElectricityRecord.aggregate([nameGroupStage]),
      VehicleRecord.aggregate([nameGroupStage])
    ]);

    const keyOf = (name, useType) => `${name}${useType}`;
    const byKey = new Map();
    for (const row of electricityTotals) {
      const k = keyOf(row._id.name, row._id.useType);
      byKey.set(k, { name: row._id.name, useType: row._id.useType, electricity: row.co2Saved, vehicle: 0 });
    }
    for (const row of vehicleTotals) {
      const k = keyOf(row._id.name, row._id.useType);
      const existing = byKey.get(k);
      if (existing) existing.vehicle = row.co2Saved;
      else byKey.set(k, { name: row._id.name, useType: row._id.useType, electricity: 0, vehicle: row.co2Saved });
    }

    const combined = [...byKey.values()]
      .map((e) => {
        const hasElec = e.electricity > 0;
        const hasVeh = e.vehicle > 0;
        let category = 'Combined';
        if (hasElec && !hasVeh) category = 'Electricity';
        else if (!hasElec && hasVeh) category = 'Vehicle';
        const totalCO2Kg = e.electricity + e.vehicle;
        const isFactory = e.useType === 'Factory';
        return {
          username: e.name,
          category,
          useType: e.useType,
          totalCO2: isFactory ? totalCO2Kg / 1000 : totalCO2Kg,
          unit: isFactory ? 'tonnes' : 'kg',
          totalCO2Kg
        };
      })
      .filter((e) => e.totalCO2Kg > 0)
      .sort((a, b) => b.totalCO2Kg - a.totalCO2Kg)
      .slice(0, 50)
      .map((e, i) => ({ rank: i + 1, ...e }));

    res.json(combined);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/certificate', async (req, res) => {
  try {
    const { name, co2, unit, source, useType } = req.body;
    if (source !== 'electricity' && source !== 'vehicle') {
      return res.status(400).json({ error: 'source must be "electricity" or "vehicle"' });
    }
    await CertificateRecord.create({
      name: (name || '').toString().trim() || 'Participant',
      co2: Number(co2) || 0,
      unit: unit || 'tonnes',
      source,
      useType: useType === 'Factory' ? 'Factory' : 'Personal',
    });
    const total = await CertificateRecord.countDocuments();
    res.json({ ok: true, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/certificate/count', async (_req, res) => {
  try {
    const count = await CertificateRecord.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/recent', async (req, res) => {
  try {
    const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 30));
    const [elec, veh] = await Promise.all([
      ElectricityRecord.find().sort({ createdAt: -1 }).limit(limit).lean(),
      VehicleRecord.find().sort({ createdAt: -1 }).limit(limit).lean(),
    ]);

    const pickName = (r) =>
      (r.individualName && r.individualName.trim()) ||
      (r.factoryName && r.factoryName.trim()) ||
      'Anonymous';

    // co2Saved is always stored in kg. Personal rows display as kg; Factory rows
    // display as tonnes (raw / 1000) so the live log reads naturally per useType.
    const shape = (r, source) => {
      const isPersonal = r.useType === 'Personal';
      const raw = Number(r.co2Saved) || 0;
      return {
        id: String(r._id),
        name: pickName(r),
        co2: isPersonal ? raw : raw / 1000,
        unit: isPersonal ? 'kg' : 'tonnes',
        source,
        createdAt: r.createdAt,
      };
    };

    const merged = [
      ...elec.map((r) => shape(r, 'electricity')),
      ...veh.map((r) => shape(r, 'vehicle')),
    ]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);

    res.json(merged);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
