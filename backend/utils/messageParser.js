// Pulls structured values out of free-text messages so the rule engine can
// compute emissions without paid NLP. Tuned for English / Hindi / Hinglish.

const TWO_WHEELER_WORDS = [
  '2 wheeler', '2-wheeler', '2wheeler', 'two wheeler', 'two-wheeler',
  'bike', 'motorcycle', 'motor cycle', 'scooter', 'scooty', 'activa',
  'bullet', 'pulsar', 'splendor', 'splender', 'gaadi bike',
  'बाइक', 'स्कूटर', 'दुपहिया'
];

const FOUR_WHEELER_WORDS = [
  '4 wheeler', '4-wheeler', '4wheeler', 'four wheeler', 'four-wheeler',
  'car', 'sedan', 'suv', 'hatchback', 'gadi', 'gaadi', 'vehicle',
  'कार', 'गाड़ी', 'चौपहिया'
];

const PETROL_WORDS = ['petrol', 'gasoline', 'पेट्रोल'];
const DIESEL_WORDS = ['diesel', 'डीजल', 'डीज़ल'];

const ELECTRICITY_HINTS = [
  'electricity', 'unit', 'units', 'kwh', 'bijli', 'light', 'energy',
  'urja', 'power', 'बिजली', 'यूनिट'
];

const ZERO_HOURS_HINTS = [
  'zero hour', 'zero hours', 'no electricity', 'off hour', 'off hours',
  'ghante off', 'ghante band', 'cut hour', 'cut hours', 'non consumption',
  'non-consumption', 'nonconsumption', 'shunya ghante'
];

function containsAny(haystack, needles) {
  return needles.some((n) => haystack.includes(n));
}

function extractDistanceKm(text) {
  // Devanagari "किलोमीटर" + Roman "km/kilometre/kilometer"
  const patterns = [
    /(\d+(?:\.\d+)?)\s*(?:km|kms|kilometre|kilometres|kilometer|kilometers|किलोमीटर|किमी)\b/i,
    /(?:km|kilometre|kilometer)\s*[:=]?\s*(\d+(?:\.\d+)?)/i,
    /(\d+(?:\.\d+)?)\s*(?:k\.?m\.?)/i
  ];
  for (const re of patterns) {
    const m = text.match(re);
    if (m) return Number(m[1]);
  }
  return null;
}

function extractVehicleType(text) {
  const t = text.toLowerCase();
  if (containsAny(t, TWO_WHEELER_WORDS)) return '2 Wheeler';
  if (containsAny(t, FOUR_WHEELER_WORDS)) return '4 Wheeler';
  return null;
}

function extractFuelType(text) {
  const t = text.toLowerCase();
  if (containsAny(t, DIESEL_WORDS)) return 'Diesel';
  if (containsAny(t, PETROL_WORDS)) return 'Petrol';
  return null;
}

function extractElectricityValues(text) {
  const t = text.toLowerCase();

  let consumption = null;
  let nonConsumption = null;

  // "600 unit", "600 units", "600 kwh"
  const unitMatch = t.match(/(\d+(?:\.\d+)?)\s*(?:unit|units|kwh|यूनिट)/);
  if (unitMatch) consumption = Number(unitMatch[1]);

  // "10 zero hours", "zero hours 10", "10 ghante off"
  const zeroPatterns = [
    /(\d+(?:\.\d+)?)\s*(?:zero hour|zero hours|off hour|off hours|cut hour|cut hours|ghante off|ghante band|hours? no electricity)/,
    /(?:zero hour|zero hours|off hour|off hours)\s*[:=]?\s*(\d+(?:\.\d+)?)/,
    /(\d+(?:\.\d+)?)\s*(?:hours?|ghante|घंटे)\s+(?:no electricity|off|band|shut|down)/,
    /(?:non[- ]?consumption)\s*[:=]?\s*(\d+(?:\.\d+)?)/
  ];
  for (const re of zeroPatterns) {
    const m = t.match(re);
    if (m) { nonConsumption = Number(m[1]); break; }
  }

  // Fallback: if the user wrote "X and Y" with one electricity hint nearby and
  // we only got consumption, try to grab a second number near a zero-hours hint.
  if (consumption !== null && nonConsumption === null) {
    const numbers = [...t.matchAll(/(\d+(?:\.\d+)?)/g)].map((m) => Number(m[1]));
    const hasZeroHint = containsAny(t, ZERO_HOURS_HINTS);
    if (hasZeroHint && numbers.length >= 2) {
      const second = numbers.find((n) => n !== consumption);
      if (second !== undefined) nonConsumption = second;
    }
  }

  return { consumption, nonConsumption };
}

export function parseMessage(text) {
  if (!text) {
    return {
      distanceKm: null,
      vehicleType: null,
      fuelType: null,
      consumption: null,
      nonConsumption: null,
      mentionsElectricity: false
    };
  }

  const lower = text.toLowerCase();
  const electricityValues = extractElectricityValues(text);

  return {
    distanceKm: extractDistanceKm(text),
    vehicleType: extractVehicleType(text),
    fuelType: extractFuelType(text),
    consumption: electricityValues.consumption,
    nonConsumption: electricityValues.nonConsumption,
    mentionsElectricity:
      containsAny(lower, ELECTRICITY_HINTS) || containsAny(lower, ZERO_HOURS_HINTS)
  };
}
