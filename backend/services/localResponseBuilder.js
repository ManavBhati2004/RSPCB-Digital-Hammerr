import knowledgeBase from './localKnowledgeBase.js';
import {
  calculateTwoWheelerEmission,
  calculateFourWheelerPetrolEmission,
  calculateFourWheelerDieselEmission,
  calculateCycleOrElectricEmission,
  calculateElectricityCarbonSaved
} from '../utils/carbonFormulaUtils.js';

const DEFAULT_SUGGESTIONS = [
  'How is petrol emission calculated?',
  'What is carbon footprint?',
  'How can I reduce my carbon footprint?',
  'What does the dashboard show?'
];

// Intents that map 1:1 to a knowledge-base entry.
const KB_INTENT_MAP = {
  dashboard_explanation: 'dashboard_explanation',
  leaderboard_explanation: 'leaderboard_explanation',
  certificate_explanation: 'certificate_explanation',
  submission_flow: 'submission_flow',
  factory_vs_personal: 'factory_vs_personal',
  upload_help: 'upload_help',
  consumption_meaning: 'consumption_meaning',
  accuracy_question: 'accuracy_question',
  about_website: 'about_website',
  website_guide: 'website_guide',
  privacy_explanation: 'privacy_explanation',
  carbon_reduction_tips: 'carbon_reduction_tips',
  fuel_saving_tips: 'fuel_saving_tips',
  electricity_saving_tips: 'electricity_saving_tips',
  carbon_footprint_definition: 'carbon_footprint_definition',
  climate_change_basics: 'climate_change_basics',
  renewable_energy: 'renewable_energy',
  solar_power: 'solar_power',
  electric_vehicle: 'electric_vehicle',
  public_transport: 'public_transport',
  air_quality: 'air_quality',
  tree_plantation: 'tree_plantation',
  water_conservation: 'water_conservation',
  waste_management: 'waste_management',
  carpooling_benefits: 'carpooling_benefits',
  petrol_vs_diesel: 'petrol_vs_diesel',
  bike_vs_car: 'bike_vs_car',
  rajasthan_specific: 'rajasthan_specific',
  government_schemes: 'government_schemes',
  general_environment_awareness: 'general_environment_awareness'
};

function fuelReply({ distanceKm, vehicleLabel, result }) {
  const article = /^[aeiou]/i.test(vehicleLabel) ? 'an' : 'a';
  return `${distanceKm} km on ${article} ${vehicleLabel} = **${result.toFixed(2)} kg CO₂**`;
}

function buildFuelCalculation(parsed, _language) {
  const { distanceKm, vehicleType, fuelType } = parsed;

  if (distanceKm == null || vehicleType == null) return null;

  if (vehicleType === 'Cycle' || fuelType === 'Electric') {
    const result = calculateCycleOrElectricEmission(distanceKm);
    const label = vehicleType === 'Cycle' ? 'cycle' : 'electric vehicle';
    return fuelReply({ distanceKm, vehicleLabel: label, result });
  }

  if (vehicleType === '4 Wheeler' && fuelType == null) return null;

  if (vehicleType === '2 Wheeler') {
    const result = calculateTwoWheelerEmission(distanceKm);
    return fuelReply({ distanceKm, vehicleLabel: '2-wheeler petrol', result });
  }
  if (vehicleType === '4 Wheeler' && fuelType === 'Petrol') {
    const result = calculateFourWheelerPetrolEmission(distanceKm);
    return fuelReply({ distanceKm, vehicleLabel: '4-wheeler petrol', result });
  }
  if (vehicleType === '4 Wheeler' && fuelType === 'Diesel') {
    const result = calculateFourWheelerDieselEmission(distanceKm);
    return fuelReply({ distanceKm, vehicleLabel: '4-wheeler diesel', result });
  }
  return null;
}

function buildElectricityCalculation(parsed, _language) {
  const { consumption, nonConsumption } = parsed;
  if (consumption == null || nonConsumption == null) return null;

  const result = calculateElectricityCarbonSaved(consumption, nonConsumption);
  return `${consumption} units × ${nonConsumption} zero hours = **${result} Tons CO₂ saved**`;
}

// Intents where the user is explicitly asking for a list / steps / tips.
// For these we always include bullets along with the summary.
const ALWAYS_BULLETS_INTENTS = new Set([
  'submission_flow',
  'carbon_reduction_tips',
  'fuel_saving_tips',
  'electricity_saving_tips',
  'dashboard_explanation',
  'leaderboard_explanation',
  'certificate_explanation'
]);

// Phrases that signal the user wants more detail (a list, steps, etc.) even
// for a definitional intent. We only append bullets when one of these shows up.
const DETAIL_REQUEST_RE =
  /\b(list|all|steps?|ways?|tips?|in detail|details|explain more|tell me more|elaborate|points?|features?|points?|how can i|how do i|how to|kaise|examples?)\b/i;

function buildKnowledgeReply(intentKey, language, userMessage) {
  const entry = knowledgeBase[intentKey];
  if (!entry) return null;

  const wantsBullets =
    ALWAYS_BULLETS_INTENTS.has(intentKey) ||
    (userMessage && DETAIL_REQUEST_RE.test(userMessage));

  if (!wantsBullets) return entry.summary;

  const bullets = entry.points.map((p) => `• ${p}`).join('\n');
  return `${entry.summary}\n\n${bullets}`;
}

function followUpsFor(intentKey) {
  return knowledgeBase[intentKey]?.followUps?.slice(0, 4) || DEFAULT_SUGGESTIONS.slice(0, 4);
}

function fuelFormulaExplanation(language) {
  const body =
    '2-wheeler petrol: (km / 35) × 2.31\n' +
    '4-wheeler petrol: (km / 13) × 2.31\n' +
    '4-wheeler diesel: (km / 15) × 2.68';
  if (language !== 'english') {
    return `${body}\n\nResult kg CO₂ me, 2 decimals tak round.`;
  }
  return `${body}\n\nResults are in kg of CO₂, rounded to 2 decimals.`;
}

function electricityFormulaExplanation(language) {
  if (language !== 'english') {
    return 'Carbon saved = consumption × non-consumption × 0.0008541 (result Tons me).\n\nConsumption = mahine ki electricity (units), non-consumption = zero hours (jab load nahi tha).';
  }
  return 'Carbon saved = consumption × non-consumption × 0.0008541 (result in Tons).\n\nConsumption is your monthly electricity in units; non-consumption is the zero hours (when load was off).';
}

function missingFuelDataReply(parsed, language) {
  const hi = language !== 'english';
  if (parsed.distanceKm == null) {
    return hi
      ? 'Distance (km) aur vehicle type batayein. 4-wheeler ke liye petrol/diesel bhi.'
      : 'Tell me the distance in km, vehicle type, and (for 4-wheeler) petrol or diesel.';
  }
  if (parsed.vehicleType == null) {
    return hi ? '2-wheeler ya 4-wheeler?' : '2-wheeler or 4-wheeler?';
  }
  if (parsed.vehicleType === '4 Wheeler' && parsed.fuelType == null) {
    return hi ? 'Petrol ya diesel?' : 'Petrol or diesel?';
  }
  return null;
}

function missingElectricityDataReply(parsed, language) {
  const hi = language !== 'english';
  if (parsed.consumption == null && parsed.nonConsumption == null) {
    return hi
      ? 'Monthly units aur zero hours batayein.'
      : 'Tell me monthly units and zero hours.';
  }
  if (parsed.consumption == null) {
    return hi ? 'Monthly units kitne the?' : 'How many monthly units?';
  }
  return hi ? 'Zero hours kitne lene hain?' : 'How many zero hours?';
}

function shortReply(intent, language) {
  if (intent === 'greeting') {
    if (language === 'hindi' || language === 'hinglish') {
      return 'Namaste! Main Green Mitra hoon. Kya puchna chahenge?';
    }
    return 'Hi! I am Green Mitra. What would you like to know?';
  }
  if (intent === 'thanks') {
    if (language === 'hindi' || language === 'hinglish') {
      return 'Aapka swagat hai!';
    }
    return "You're welcome!";
  }
  if (intent === 'bot_identity') {
    return 'I am **Green Mitra**, the carbon assistant for the Rajasthan State Pollution Control Board Carbon Emission Calculator.';
  }
  return null;
}

export function buildReply({ intent, parsed, language, message }) {
  // 0. Short conversational replies
  const short = shortReply(intent, language);
  if (short) {
    return {
      reply: short,
      suggestedQuestions: [
        'What is carbon footprint?',
        'How is petrol emission calculated?',
        'What does the dashboard show?',
        'How can I reduce my carbon footprint?'
      ]
    };
  }

  // 1. Direct calculations
  if (intent === 'fuel_calculation') {
    const reply = buildFuelCalculation(parsed, language);
    if (reply) return { reply, suggestedQuestions: followUpsFor('fuel_saving_tips') };
    return {
      reply: missingFuelDataReply(parsed, language),
      suggestedQuestions: [
        'How is petrol emission calculated?',
        'How is diesel emission calculated?'
      ]
    };
  }

  if (intent === 'electricity_calculation') {
    const reply = buildElectricityCalculation(parsed, language);
    if (reply) return { reply, suggestedQuestions: followUpsFor('electricity_saving_tips') };
    return {
      reply: missingElectricityDataReply(parsed, language),
      suggestedQuestions: [
        'What does zero hours mean?',
        'How is electricity carbon saved calculated?'
      ]
    };
  }

  // 2. Formula explanations
  if (intent === 'fuel_formula_explanation') {
    return {
      reply: fuelFormulaExplanation(language),
      suggestedQuestions: followUpsFor('fuel_saving_tips')
    };
  }
  if (intent === 'electricity_formula_explanation') {
    return {
      reply: electricityFormulaExplanation(language),
      suggestedQuestions: followUpsFor('electricity_saving_tips')
    };
  }

  // 3. Knowledge-base topics
  const knowledgeKey = KB_INTENT_MAP[intent];
  if (knowledgeKey) {
    return {
      reply: buildKnowledgeReply(knowledgeKey, language, message),
      suggestedQuestions: followUpsFor(knowledgeKey)
    };
  }

  // 4. Unknown but relevant — short orientation, not a feature dump.
  const fallback =
    language === 'english'
      ? `I'm not sure what you mean. Try a specific question like "What is carbon footprint?", "How is petrol emission calculated?", "How do I submit a calculation?", or "Tell me about solar power".`
      : `Mujhe samajh nahi aaya. Try karein: "Carbon footprint kya hai?", "Petrol emission kaise calculate hota hai?", "Calculation kaise submit karein?", ya "Solar power ke baare me batao".`;

  return {
    reply: fallback,
    suggestedQuestions: DEFAULT_SUGGESTIONS
  };
}

export { DEFAULT_SUGGESTIONS };
