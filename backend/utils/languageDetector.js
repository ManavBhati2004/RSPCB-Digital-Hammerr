const HINDI_TOKENS = [
  'hai', 'hain', 'kitna', 'kitni', 'kaise', 'kaisa', 'batao', 'bataye', 'bataiye',
  'kar', 'kare', 'karte', 'karna', 'karenge', 'maine', 'mera', 'meri', 'mere',
  'aap', 'aapka', 'aapki', 'hum', 'hamara', 'mein', 'mai', 'kya', 'kyu', 'kyun',
  'gaya', 'gayi', 'chalayi', 'chalaya', 'chala', 'chali', 'gadi', 'gaadi',
  'bijli', 'urja', 'ghante', 'ghanta', 'maan', 'maana', 'bachat', 'bachao',
  'paryavaran', 'pradushan', 'kam', 'jyada', 'zyada', 'haan', 'nahi', 'nahin',
  'rajasthan', 'namaste'
];

export function detectLanguage(text) {
  if (!text) return 'english';

  // Devanagari Unicode block: ऀ-ॿ
  if (/[ऀ-ॿ]/.test(text)) return 'hindi';

  const lower = text.toLowerCase();
  const words = lower.split(/[^a-z]+/).filter(Boolean);
  const hindiHits = words.filter((w) => HINDI_TOKENS.includes(w)).length;
  if (hindiHits >= 1 && words.length <= 25) return 'hinglish';

  return 'english';
}
