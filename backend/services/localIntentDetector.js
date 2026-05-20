// Lightweight keyword + regex intent classifier. Returns the highest-scoring
// intent so the engine can decide whether to calculate, look up knowledge, or
// fall back to a generic response.

// Order matters when keyword scores tie: short conversational intents come
// first, then formula explanations, then calculations, then knowledge topics.
// Calculations win ties only when actual numeric data is present (handled via
// the +3 boost below).
const INTENT_KEYWORDS = {
  // ───────── Short conversational ─────────
  greeting: [
    'hi ', 'hello', 'hey ', 'namaste', 'namaskar', 'good morning',
    'good afternoon', 'good evening', 'hola', 'salaam'
  ],
  thanks: [
    'thank you', 'thanks', 'thank u', 'thx', 'dhanyavad', 'shukriya',
    'thanku', 'thanky'
  ],
  bot_identity: [
    'who are you', 'what are you', 'your name', 'about you', 'green mitra',
    'tum kaun', 'aap kaun', 'kya ho tum', 'kaun ho', 'bot identity'
  ],

  // ───────── Formula explanations ─────────
  fuel_formula_explanation: [
    'fuel formula', 'petrol formula', 'diesel formula', 'how is petrol',
    'how is diesel', 'how is fuel', 'how calculate fuel', 'kaise calculate',
    'mileage formula', 'how does fuel calculator work', 'how is emission calculated',
    'how do you calculate petrol', 'how do you calculate diesel'
  ],
  electricity_formula_explanation: [
    'electricity formula', 'unit formula', 'kaise calculate electricity',
    'how is electricity', 'how does electricity calculator work',
    'meaning of zero hours', 'zero hours meaning', 'what are zero hours',
    'how is electricity carbon', 'electricity carbon saved calculated',
    'how electricity carbon saved'
  ],

  // ───────── Calculations ─────────
  fuel_calculation: [
    'how much carbon', 'kitna carbon', 'carbon batao', 'emission batao',
    'calculate emission', 'calculate carbon', 'co2', 'co₂',
    'travelled', 'travel', 'gaya', 'gayi', 'chalayi', 'chalaya', 'chala',
    'ride', 'drove', 'driven', 'km bike', 'km car', 'km scooter'
  ],
  electricity_calculation: [
    'electricity carbon', 'bijli carbon', 'unit carbon', 'kwh saved',
    'carbon saved', 'zero hour', 'zero hours', 'ghante off', 'non consumption'
  ],

  // ───────── Comparisons ─────────
  petrol_vs_diesel: [
    'petrol vs diesel', 'diesel vs petrol', 'petrol or diesel',
    'diesel or petrol', 'difference between petrol and diesel',
    'which is better petrol', 'which is better diesel',
    'petrol better than diesel', 'diesel better than petrol'
  ],
  bike_vs_car: [
    'bike vs car', 'car vs bike', 'bike or car', '2 wheeler vs 4 wheeler',
    '2-wheeler vs 4-wheeler', 'two wheeler vs four wheeler',
    'bike better than car', 'car better than bike',
    'difference between bike and car'
  ],

  // ───────── Website topics ─────────
  dashboard_explanation: [
    'dashboard', 'chart', 'graph', 'report', 'total emission', 'total submission',
    'average emission', 'analytics', 'stats', 'statistics'
  ],
  leaderboard_explanation: [
    'leaderboard', 'rank', 'ranking', 'top user', 'top performer', 'best performer',
    'score', 'position', 'top contributors'
  ],
  certificate_explanation: [
    'certificate', 'download certificate', 'generate certificate', 'reward',
    'badge', 'achievement', 'pdf certificate'
  ],
  submission_flow: [
    'how to submit', 'how do i submit', 'submit a calculation', 'how to enter',
    'enter my data', 'enter calculation', 'submit data', 'how to use calculator',
    'how to fill', 'kaise submit'
  ],
  factory_vs_personal: [
    'factory vs personal', 'personal vs factory', 'difference between factory and personal',
    'factory use', 'personal use', 'factory or personal', 'individual use',
    'factory owner', 'as a factory', 'household vs factory'
  ],
  upload_help: [
    'upload', 'attach file', 'attach document', 'electricity bill',
    'bill upload', 'document upload', 'file format', 'pdf upload',
    'image upload', 'what files', 'which document'
  ],
  consumption_meaning: [
    'what is consumption', 'meaning of consumption', 'what is non consumption',
    'what is non-consumption', 'what does consumption mean', 'what does zero hours mean',
    'meaning of zero hours', 'consumption ka matlab', 'zero hours ka matlab',
    'non consumption matlab'
  ],
  accuracy_question: [
    'how accurate', 'is this accurate', 'is it accurate', 'how reliable',
    'is this correct', 'are these formulas', 'where does this come from',
    'sahi hai', 'galat hai', 'sahi number'
  ],
  about_website: [
    'about this site', 'about this app', 'about this website',
    'what is rspcb', 'rspcb', 'pollution control board', 'who made this',
    'who built this', 'purpose of this website', 'why this website',
    'what is this website', 'tell me about this'
  ],
  website_guide: [
    'how to use', 'how do i use', 'website kaise', 'use this website',
    'guide me', 'walkthrough', 'tutorial', 'help me navigate'
  ],
  privacy_explanation: [
    'privacy', 'anonymous', 'session', 'data store', 'personal data',
    'login required', 'do i need to login', 'safe to use',
    'data safe', 'my data', 'data shared', 'is my data', 'delete my'
  ],

  // ───────── Tips and reductions ─────────
  carbon_reduction_tips: [
    'reduce carbon', 'reduce my carbon', 'reduce footprint', 'reduce my footprint',
    'carbon kam', 'footprint kam', 'how to reduce', 'how can i reduce',
    'kaise kam kare', 'carbon footprint kam', 'carbon footprint',
    'lower emission', 'lower my emission', 'tips to reduce'
  ],
  fuel_saving_tips: [
    'save fuel', 'fuel save', 'fuel bachat', 'petrol bachat', 'diesel bachat',
    'mileage tips', 'fuel saving tip', 'less fuel', 'better mileage'
  ],
  electricity_saving_tips: [
    'save electricity', 'electricity save', 'bijli bachat', 'energy save',
    'urja bachat', 'electricity saving tip', 'less electricity', 'reduce power',
    'bijli kam'
  ],

  // ───────── Related fields and ideas ─────────
  carbon_footprint_definition: [
    'what is carbon footprint', 'meaning of carbon footprint', 'define carbon footprint',
    'carbon footprint kya', 'what is co2 footprint', 'what is carbon',
    'what is co2', 'what is emission', 'meaning of emission'
  ],
  climate_change_basics: [
    'climate change', 'global warming', 'greenhouse effect', 'green house effect',
    'jalvayu parivartan', 'climate', 'why is earth getting hot',
    'why is it getting hot'
  ],
  renewable_energy: [
    'renewable energy', 'green energy', 'clean energy', 'wind energy',
    'wind power', 'hydro power', 'biomass', 'green power'
  ],
  solar_power: [
    'solar', 'solar power', 'solar panel', 'rooftop solar', 'pv panel',
    'photovoltaic', 'surya ghar', 'solar yojana'
  ],
  electric_vehicle: [
    'electric vehicle', 'electric car', 'electric bike', 'ev ', ' ev',
    'tesla', 'evs', 'electric scooter', 'battery vehicle', 'electric two wheeler',
    'electric four wheeler'
  ],
  public_transport: [
    'public transport', 'bus', 'metro', 'train', 'jaipur metro',
    'shared auto', 'shared transport', 'mass transit'
  ],
  air_quality: [
    'air quality', 'aqi', 'pm 2.5', 'pm2.5', 'pm10', 'pm 10', 'smog',
    'air pollution', 'breathing problem'
  ],
  tree_plantation: [
    'tree plantation', 'plant trees', 'planting tree', 'plant a tree',
    'how tree help', 'tree absorb', 'trees help', 'plantation drive',
    'ped lagana', 'khejri', 'neem tree'
  ],
  water_conservation: [
    'water conservation', 'save water', 'rainwater harvesting', 'pani bachao',
    'water saving', 'drip irrigation'
  ],
  waste_management: [
    'waste', 'garbage', 'compost', 'recycling', 'recycle', 'segregate waste',
    'plastic waste', 'single use plastic', 'kachra'
  ],
  carpooling_benefits: [
    'carpool', 'car pool', 'car-pool', 'sharing ride', 'shared ride',
    'ride sharing', 'pooling'
  ],
  rajasthan_specific: [
    'rajasthan', 'jaipur', 'jodhpur', 'udaipur', 'jaisalmer', 'barmer',
    'thar desert', 'desertification', 'rajasthan heat', 'rajasthan water'
  ],
  government_schemes: [
    'government scheme', 'subsidy', 'sarkari yojana', 'pm surya ghar',
    'fame ii', 'fame 2', 'ev subsidy', 'solar subsidy', 'incentive',
    'rebate'
  ],
  general_environment_awareness: [
    'pollution', 'pradushan', 'paryavaran', 'environment', 'eco friendly',
    'eco-friendly', 'sustainability', 'sustainable'
  ]
};

const INTENT_TO_TOPIC = {
  greeting: 'general',
  thanks: 'general',
  bot_identity: 'general',
  fuel_calculation: 'fuel',
  fuel_formula_explanation: 'fuel',
  fuel_saving_tips: 'fuel',
  electricity_calculation: 'electricity',
  electricity_formula_explanation: 'electricity',
  electricity_saving_tips: 'electricity',
  petrol_vs_diesel: 'fuel',
  bike_vs_car: 'fuel',
  dashboard_explanation: 'dashboard',
  leaderboard_explanation: 'leaderboard',
  certificate_explanation: 'certificate',
  submission_flow: 'website-guide',
  factory_vs_personal: 'website-guide',
  upload_help: 'website-guide',
  consumption_meaning: 'electricity',
  accuracy_question: 'website-guide',
  about_website: 'website-guide',
  carbon_reduction_tips: 'tips',
  website_guide: 'website-guide',
  privacy_explanation: 'privacy',
  carbon_footprint_definition: 'carbon-awareness',
  climate_change_basics: 'carbon-awareness',
  renewable_energy: 'carbon-awareness',
  solar_power: 'carbon-awareness',
  electric_vehicle: 'carbon-awareness',
  public_transport: 'carbon-awareness',
  air_quality: 'carbon-awareness',
  tree_plantation: 'carbon-awareness',
  water_conservation: 'carbon-awareness',
  waste_management: 'carbon-awareness',
  carpooling_benefits: 'carbon-awareness',
  rajasthan_specific: 'carbon-awareness',
  government_schemes: 'carbon-awareness',
  general_environment_awareness: 'carbon-awareness',
  unknown_relevant: 'general',
  out_of_scope: 'out-of-scope'
};

export function detectIntent(text, parsed) {
  if (!text) {
    return { intent: 'unknown_relevant', confidence: 0, topic: 'general' };
  }
  const t = text.toLowerCase();

  // Quick greeting / identity short-circuit: word-boundary aware to avoid
  // false matches like "hi" inside "this" or "history".
  if (/^\s*(hi|hello|hey|namaste|namaskar|hola|salaam|good (morning|afternoon|evening))\b/.test(t)) {
    return { intent: 'greeting', confidence: 0.9, topic: 'general' };
  }

  const scores = {};
  for (const [intent, words] of Object.entries(INTENT_KEYWORDS)) {
    let hits = 0;
    for (const w of words) {
      if (t.includes(w)) hits += 1;
    }
    if (hits > 0) scores[intent] = hits;
  }

  // Boost calculation intents only when we have actual numeric data — not just
  // a topic hint — so "give electricity saving tips" doesn't become a calc ask.
  if (parsed?.distanceKm != null && (parsed?.vehicleType || parsed?.fuelType)) {
    scores.fuel_calculation = (scores.fuel_calculation || 0) + 3;
  }
  if (parsed?.consumption != null || parsed?.nonConsumption != null) {
    scores.electricity_calculation = (scores.electricity_calculation || 0) + 3;
  }

  const entries = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  if (entries.length === 0) {
    return { intent: 'unknown_relevant', confidence: 0.2, topic: 'general' };
  }

  const [topIntent, topScore] = entries[0];
  const total = entries.reduce((sum, [, s]) => sum + s, 0);
  const confidence = Math.min(1, topScore / Math.max(total, 1));

  return {
    intent: topIntent,
    confidence: Number(confidence.toFixed(2)),
    topic: INTENT_TO_TOPIC[topIntent] || 'general'
  };
}

export { INTENT_TO_TOPIC };
