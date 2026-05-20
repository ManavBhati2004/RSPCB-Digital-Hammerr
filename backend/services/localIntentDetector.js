// Lightweight keyword + regex intent classifier. Returns the highest-scoring
// intent so the engine can decide whether to calculate, look up knowledge, or
// fall back to a generic response.

const INTENT_KEYWORDS = {
  fuel_calculation: [
    'how much carbon', 'kitna carbon', 'carbon batao', 'emission batao',
    'calculate emission', 'calculate carbon', 'co2', 'co₂',
    'travelled', 'travel', 'gaya', 'gayi', 'chalayi', 'chalaya', 'chala',
    'ride', 'drove', 'driven', 'km bike', 'km car', 'km scooter'
  ],
  electricity_calculation: [
    'electricity carbon', 'bijli carbon', 'unit carbon', 'kwh saved',
    'carbon saved', 'electricity saving', 'electricity save', 'urja bachat',
    'zero hour', 'zero hours', 'ghante off', 'non consumption'
  ],
  fuel_formula_explanation: [
    'fuel formula', 'petrol formula', 'diesel formula', 'how is petrol',
    'how is diesel', 'how is fuel', 'how calculate fuel', 'kaise calculate',
    'mileage formula', 'how does fuel calculator work', 'how is emission calculated'
  ],
  electricity_formula_explanation: [
    'electricity formula', 'unit formula', 'kaise calculate electricity',
    'how is electricity', 'how does electricity calculator work',
    'meaning of zero hours', 'zero hours meaning', 'what are zero hours'
  ],
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
  carbon_reduction_tips: [
    'reduce carbon', 'reduce footprint', 'carbon kam', 'footprint kam',
    'how to reduce', 'kaise kam kare', 'carbon footprint kam',
    'lower emission', 'tips to reduce'
  ],
  fuel_saving_tips: [
    'save fuel', 'fuel save', 'fuel bachat', 'petrol bachat', 'diesel bachat',
    'mileage tips', 'fuel saving tip', 'less fuel'
  ],
  electricity_saving_tips: [
    'save electricity', 'electricity save', 'bijli bachat', 'energy save',
    'urja bachat', 'electricity saving tip', 'less electricity', 'reduce power'
  ],
  website_guide: [
    'how to use', 'how do i use', 'website kaise', 'use this website',
    'guide me', 'walkthrough', 'tutorial', 'about this site', 'about this app'
  ],
  privacy_explanation: [
    'privacy', 'anonymous', 'session', 'data store', 'personal data',
    'login required', 'do i need to login', 'safe to use'
  ],
  general_environment_awareness: [
    'pollution', 'pradushan', 'paryavaran', 'environment', 'climate',
    'global warming', 'green house', 'greenhouse', 'tree plantation',
    'rajasthan environment', 'eco friendly'
  ]
};

const INTENT_TO_TOPIC = {
  fuel_calculation: 'fuel',
  fuel_formula_explanation: 'fuel',
  fuel_saving_tips: 'fuel',
  electricity_calculation: 'electricity',
  electricity_formula_explanation: 'electricity',
  electricity_saving_tips: 'electricity',
  dashboard_explanation: 'dashboard',
  leaderboard_explanation: 'leaderboard',
  certificate_explanation: 'certificate',
  carbon_reduction_tips: 'tips',
  website_guide: 'website-guide',
  privacy_explanation: 'privacy',
  general_environment_awareness: 'carbon-awareness',
  unknown_relevant: 'general',
  out_of_scope: 'out-of-scope'
};

export function detectIntent(text, parsed) {
  if (!text) {
    return { intent: 'unknown_relevant', confidence: 0, topic: 'general' };
  }
  const t = text.toLowerCase();

  const scores = {};
  for (const [intent, words] of Object.entries(INTENT_KEYWORDS)) {
    let hits = 0;
    for (const w of words) {
      if (t.includes(w)) hits += 1;
    }
    if (hits > 0) scores[intent] = hits;
  }

  // Boost calculation intents when structured data is already extracted.
  if (parsed?.distanceKm != null || parsed?.vehicleType || parsed?.fuelType) {
    scores.fuel_calculation = (scores.fuel_calculation || 0) + 2;
  }
  if (parsed?.consumption != null || parsed?.nonConsumption != null || parsed?.mentionsElectricity) {
    scores.electricity_calculation = (scores.electricity_calculation || 0) + 2;
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
