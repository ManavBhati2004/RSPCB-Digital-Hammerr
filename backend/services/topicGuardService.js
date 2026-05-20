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
  'carbon', 'emission', 'co2', 'co₂', 'petrol', 'diesel', 'fuel', 'vehicle', 'bike',
  'scooter', 'car', 'gaadi', 'gadi', 'mileage', 'distance', 'km', 'kilometer',
  'electricity', 'unit', 'kwh', 'bijli', 'energy', 'urja', 'light',
  'dashboard', 'chart', 'graph', 'report', 'analytics',
  'leaderboard', 'rank', 'top user', 'score', 'performance',
  'certificate', 'badge', 'reward', 'achievement',
  'pollution', 'environment', 'paryavaran', 'pradushan',
  'sustainability', 'sustainable', 'eco', 'green', 'tree', 'plantation',
  'reduce', 'save', 'bachat', 'kam', 'tip', 'guide',
  'rajasthan', 'rspcb', 'website', 'app', 'calculator', 'submission',
  'privacy', 'anonymous', 'session', 'login',
  'namaste', 'hello', 'hi', 'hey', 'help', 'thanks', 'thank you'
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
