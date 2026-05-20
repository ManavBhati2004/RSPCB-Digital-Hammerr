const OUT_OF_SCOPE_KEYWORDS = [
  // Entertainment
  'movie', 'film', 'cinema', 'bollywood', 'hollywood', 'netflix', 'song', 'lyrics',
  'singer', 'actor', 'actress', 'celebrity', 'game', 'cricket', 'football', 'ipl',
  // Personal / relationships
  'girlfriend', 'boyfriend', 'dating', 'crush', 'marriage proposal', 'love advice',
  // Politics / religion
  'election', 'political party', 'bjp', 'congress', 'modi', 'rahul gandhi', 'religion',
  // Finance / investment
  'stock', 'crypto', 'bitcoin', 'mutual fund', 'invest in', 'share market',
  // Medical
  'medicine', 'prescription', 'disease', 'symptom', 'doctor advice', 'diagnose',
  // Hacking / adult
  'hack', 'crack', 'exploit', 'porn', 'adult', 'nude'
];

const RELEVANCE_KEYWORDS = [
  'carbon', 'emission', 'co2', 'co₂', 'footprint', 'petrol', 'diesel', 'fuel',
  'vehicle', 'bike', 'scooter', 'car', 'gaadi', 'gadi', 'mileage', 'distance',
  'km', 'kilometer', 'kilometre',
  'electricity', 'unit', 'kwh', 'bijli', 'energy', 'urja', 'light', 'power',
  'consumption', 'non-consumption', 'zero hour',
  'dashboard', 'chart', 'graph', 'report', 'analytics', 'stats', 'submission',
  'leaderboard', 'rank', 'top user', 'top contributor', 'score', 'performance',
  'certificate', 'badge', 'reward', 'achievement',
  'pollution', 'environment', 'paryavaran', 'pradushan',
  'sustainability', 'sustainable', 'eco', 'green', 'tree', 'plantation', 'khejri',
  'reduce', 'save', 'bachat', 'kam', 'tip', 'guide',
  'rajasthan', 'jaipur', 'jodhpur', 'udaipur', 'jaisalmer', 'barmer',
  'rspcb', 'website', 'app', 'calculator', 'factory',
  'privacy', 'anonymous', 'session', 'login',
  'climate', 'global warming', 'greenhouse', 'jalvayu',
  'solar', 'wind', 'renewable', 'biomass', 'pv ', 'photovoltaic',
  'ev', 'electric vehicle', 'electric car', 'electric bike',
  'public transport', 'bus', 'metro', 'train', 'carpool', 'car pool',
  'air quality', 'aqi', 'pm 2.5', 'pm2.5', 'pm10', 'smog',
  'water', 'rainwater', 'drip', 'pani',
  'waste', 'compost', 'recycle', 'plastic',
  'subsidy', 'yojana', 'scheme', 'fame', 'surya ghar',
  'namaste', 'hello', 'hi ', ' hi', 'hey', 'help', 'thanks', 'thank you',
  'green mitra', 'who are you', 'what are you'
];

const REDIRECT_REPLY =
  'I am Green Mitra, a local assistant for carbon emission calculation, electricity saving, fuel usage, dashboard guidance, leaderboard, certificates, and pollution awareness for Rajasthan. Please ask me something related to this website or your carbon footprint.';

export function checkTopic(text) {
  if (!text) return { inScope: true };
  const t = text.toLowerCase();

  const isRelevant = RELEVANCE_KEYWORDS.some((k) => t.includes(k));
  const isBlocked = OUT_OF_SCOPE_KEYWORDS.some((k) => t.includes(k));

  // Greetings ("hi", "hello", "namaste") should always be allowed.
  if (/^\s*(hi|hello|hey|namaste|namaskar|hola)\b/.test(t)) {
    return { inScope: true };
  }

  if (isBlocked && !isRelevant) {
    return { inScope: false, redirect: REDIRECT_REPLY };
  }

  return { inScope: true };
}

export { REDIRECT_REPLY };
