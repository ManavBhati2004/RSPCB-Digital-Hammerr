// Seeds ~20 leaderboard entries via the live API.
// Run from the backend directory:  node scripts/seed-leaderboard.js
const API = process.env.API_URL || 'http://localhost:5000';

const electricityCO2 = (c1, c2) => c1 * c2 * 0.001134;
const vehicleCO2 = (vType, fuel, dist) => {
  if (vType === '2 Wheeler') return (dist / 35) * 2.31;
  if (vType === '4 Wheeler' && fuel === 'Petrol') return (dist / 13) * 2.31;
  if (vType === '4 Wheeler' && fuel === 'Diesel') return (dist / 15) * 2.31;
  if (vType === 'Cycle' || fuel === 'Electric') return dist * 0.15;
  return 0;
};

const electricityEntries = [
  { useType: 'Factory', factoryName: 'Aravalli Cement Works', c1: 3500, c2: 120 },
  { useType: 'Factory', factoryName: 'Marwar Textiles', c1: 1800, c2: 95 },
  { useType: 'Factory', factoryName: 'Jaipur Auto Parts', c1: 2400, c2: 70 },
  { useType: 'Factory', factoryName: 'Bikaner Sugar Mills', c1: 4200, c2: 150 },
  { useType: 'Factory', factoryName: 'Udaipur Marble Co.', c1: 2800, c2: 110 },
  { useType: 'Personal', factoryName: 'Priya Sharma', c1: 400, c2: 20 },
  { useType: 'Personal', factoryName: 'Rohan Verma', c1: 550, c2: 25 },
  { useType: 'Personal', factoryName: 'Anita Joshi', c1: 320, c2: 18 },
  { useType: 'Personal', factoryName: 'Vikram Singh', c1: 480, c2: 22 },
  { useType: 'Personal', factoryName: 'Meera Kapoor', c1: 600, c2: 30 },
];

const vehicleEntries = [
  { useType: 'Factory', factoryName: 'Kota Logistics Co.', vType: '4 Wheeler', fuel: 'Diesel', dist: 4500 },
  { useType: 'Factory', factoryName: 'Jodhpur Transport', vType: '4 Wheeler', fuel: 'Petrol', dist: 2800 },
  { useType: 'Factory', factoryName: 'Ajmer Cargo Ltd.', vType: '4 Wheeler', fuel: 'Diesel', dist: 5200 },
  { useType: 'Factory', factoryName: 'Pali Freight Movers', vType: '4 Wheeler', fuel: 'Diesel', dist: 3300 },
  { useType: 'Factory', factoryName: 'Alwar Heavy Haul', vType: '4 Wheeler', fuel: 'Petrol', dist: 2100 },
  { useType: 'Personal', factoryName: 'Arjun Mehta', vType: '2 Wheeler', fuel: 'Petrol', dist: 1500 },
  { useType: 'Personal', factoryName: 'Sneha Gupta', vType: 'Cycle', fuel: 'None', dist: 450 },
  { useType: 'Personal', factoryName: 'Karan Malhotra', vType: '4 Wheeler', fuel: 'Electric', dist: 2200 },
  { useType: 'Personal', factoryName: 'Pooja Iyer', vType: '2 Wheeler', fuel: 'Petrol', dist: 980 },
  { useType: 'Personal', factoryName: 'Rahul Khanna', vType: 'Cycle', fuel: 'None', dist: 720 },
];

async function post(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${path} -> ${res.status} ${await res.text()}`);
  return res.json();
}

(async () => {
  let ok = 0, fail = 0;
  for (const e of electricityEntries) {
    const co2Saved = electricityCO2(e.c1, e.c2);
    try {
      await post('/api/data/electricity', {
        consumption: e.c1,
        nonConsumption: e.c2,
        co2Saved,
        factoryName: e.factoryName,
        useType: e.useType,
        docName: 'Seed',
      });
      console.log(`OK  electricity  ${e.useType.padEnd(8)} ${e.factoryName}  CO2=${co2Saved.toFixed(2)} t`);
      ok++;
    } catch (err) {
      console.error(`FAIL electricity ${e.factoryName}: ${err.message}`);
      fail++;
    }
  }
  for (const v of vehicleEntries) {
    const co2Saved = vehicleCO2(v.vType, v.fuel, v.dist);
    try {
      await post('/api/data/vehicle', {
        category: v.vType,
        fuelType: v.fuel,
        distance: v.dist,
        co2Saved,
        factoryName: v.factoryName,
        useType: v.useType,
      });
      console.log(`OK  vehicle      ${v.useType.padEnd(8)} ${v.factoryName}  CO2=${co2Saved.toFixed(2)} kg`);
      ok++;
    } catch (err) {
      console.error(`FAIL vehicle ${v.factoryName}: ${err.message}`);
      fail++;
    }
  }
  console.log(`\nDone. ${ok} succeeded, ${fail} failed.`);
})();
