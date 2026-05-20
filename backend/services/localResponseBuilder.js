import knowledgeBase from './localKnowledgeBase.js';
import {
  calculateTwoWheelerEmission,
  calculateFourWheelerPetrolEmission,
  calculateFourWheelerDieselEmission,
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

function fuelReply({ language, distanceKm, vehicleType, fuelType, value, formula }) {
  if (language === 'hindi') {
    return `${vehicleType} ke liye fuel ${fuelType} maana gaya hai.\n\nFormula: ${formula}\nCalculation: ${value.calc}\n\nAapka estimated carbon emission **${value.result.toFixed(2)} kg CO₂** hai.`;
  }
  if (language === 'hinglish') {
    return `${vehicleType} ke liye fuel ${fuelType} consider kiya gaya hai.\n\nFormula: ${formula}\nCalculation: ${value.calc}\n\nAapka estimated carbon emission **${value.result.toFixed(2)} kg CO₂** hai.`;
  }
  return `For a ${vehicleType.toLowerCase()}${vehicleType === '4 Wheeler' ? ` ${fuelType.toLowerCase()} vehicle` : ` (fuel: ${fuelType.toLowerCase()})`}:\n\nFormula: ${formula}\nCalculation: ${value.calc}\n\nYour estimated carbon emission is **${value.result.toFixed(2)} kg CO₂**.`;
}

function buildFuelCalculation(parsed, language) {
  const { distanceKm, vehicleType, fuelType } = parsed;

  if (distanceKm == null || vehicleType == null || (vehicleType === '4 Wheeler' && fuelType == null)) {
    return null;
  }

  if (vehicleType === '2 Wheeler') {
    const result = calculateTwoWheelerEmission(distanceKm);
    return fuelReply({
      language,
      distanceKm,
      vehicleType,
      fuelType: 'Petrol',
      formula: '(km / 35) × 2.31',
      value: { result, calc: `(${distanceKm} / 35) × 2.31 = ${result} kg CO₂` }
    });
  }
  if (vehicleType === '4 Wheeler' && fuelType === 'Petrol') {
    const result = calculateFourWheelerPetrolEmission(distanceKm);
    return fuelReply({
      language,
      distanceKm,
      vehicleType,
      fuelType: 'Petrol',
      formula: '(km / 13) × 2.31',
      value: { result, calc: `(${distanceKm} / 13) × 2.31 = ${result} kg CO₂` }
    });
  }
  if (vehicleType === '4 Wheeler' && fuelType === 'Diesel') {
    const result = calculateFourWheelerDieselEmission(distanceKm);
    return fuelReply({
      language,
      distanceKm,
      vehicleType,
      fuelType: 'Diesel',
      formula: '(km / 15) × 2.31',
      value: { result, calc: `(${distanceKm} / 15) × 2.31 = ${result} kg CO₂` }
    });
  }
  return null;
}

function buildElectricityCalculation(parsed, language) {
  const { consumption, nonConsumption } = parsed;
  if (consumption == null || nonConsumption == null) return null;

  const result = calculateElectricityCarbonSaved(consumption, nonConsumption);

  if (language === 'hindi' || language === 'hinglish') {
    return `Electricity carbon saving ke liye:\n\nFormula: consumption × non-consumption × 0.0008541\nCalculation: ${consumption} × ${nonConsumption} × 0.0008541 = ${result} Tons\n\nAapka estimated carbon saved **${result} Tons** hai.`;
  }
  return `For electricity carbon saving:\n\nFormula: consumption × non-consumption × 0.0008541\nCalculation: ${consumption} × ${nonConsumption} × 0.0008541 = ${result} Tons\n\nYour estimated carbon saved is **${result} Tons**.`;
}

function buildKnowledgeReply(intentKey, language) {
  const entry = knowledgeBase[intentKey];
  if (!entry) return null;

  const intro =
    language === 'hindi' || language === 'hinglish'
      ? entry.summary
      : entry.summary;

  const bullets = entry.points.map((p) => `• ${p}`).join('\n');
  return `${intro}\n\n${bullets}`;
}

function followUpsFor(intentKey) {
  return knowledgeBase[intentKey]?.followUps?.slice(0, 4) || DEFAULT_SUGGESTIONS.slice(0, 4);
}

function fuelFormulaExplanation(language) {
  const body = `2-wheeler petrol: (km / 35) × 2.31\n4-wheeler petrol: (km / 13) × 2.31\n4-wheeler diesel: (km / 15) × 2.31\n\nResults are in kg of CO₂, rounded to 2 decimals. These formulas match the Calculator page on this website.`;
  const intro =
    language === 'english'
      ? 'Here are the fuel emission formulas used by this calculator:'
      : 'Yeh hain is calculator ke fuel emission formulas:';
  return `${intro}\n\n${body}`;
}

function electricityFormulaExplanation(language) {
  const body = `Carbon saved = consumption (units) × non-consumption (units) × 0.0008541\n\nThe result is in Tons of CO₂. "Consumption" is the electricity you used in the month and "non-consumption" is the equivalent unmet demand (sometimes called zero hours). This matches the Calculator page on this website.`;
  const intro =
    language === 'english'
      ? 'Here is the electricity carbon-saved formula:'
      : 'Electricity carbon-saved ka formula yeh hai:';
  return `${intro}\n\n${body}`;
}

function missingFuelDataReply(parsed, language) {
  if (parsed.distanceKm == null) {
    return language === 'english'
      ? 'Please tell me the distance travelled in km and vehicle type. If it is a 4-wheeler, also tell me petrol or diesel.'
      : 'Kripya batayein distance kitne km ka tha aur vehicle type kya hai. 4-wheeler hai to petrol ya diesel bhi batayein.';
  }
  if (parsed.vehicleType == null) {
    return language === 'english'
      ? 'Got the distance. Is it a 2-wheeler or a 4-wheeler? (For 4-wheeler also tell me petrol or diesel.)'
      : 'Distance mil gaya. 2-wheeler hai ya 4-wheeler? (4-wheeler ke liye petrol ya diesel bhi batayein.)';
  }
  if (parsed.vehicleType === '4 Wheeler' && parsed.fuelType == null) {
    return language === 'english'
      ? 'Got the distance and 4-wheeler. Is it petrol or diesel?'
      : '4-wheeler ke liye fuel batayein — petrol ya diesel?';
  }
  return null;
}

function missingElectricityDataReply(parsed, language) {
  if (parsed.consumption == null && parsed.nonConsumption == null) {
    return language === 'english'
      ? 'Please tell me monthly electricity units (consumption) and zero hours (non-consumption).'
      : 'Kripya monthly electricity units aur zero hours dono batayein.';
  }
  if (parsed.consumption == null) {
    return language === 'english'
      ? 'Got the zero hours. How many monthly electricity units did you consume?'
      : 'Zero hours mil gaya. Monthly electricity units (consumption) kitne the?';
  }
  return language === 'english'
    ? 'Got the units. How many zero hours (non-consumption) should I use?'
    : 'Units mil gaye. Zero hours (non-consumption) kitne lene hain?';
}

function shortReply(intent, language) {
  if (intent === 'greeting') {
    if (language === 'hindi') {
      return 'Namaste! Main Green Mitra hoon. Aap mujhse carbon emission, electricity saving, fuel emission, dashboard, leaderboard, certificate ya pollution awareness ke baare me kuch bhi puch sakte hain.';
    }
    if (language === 'hinglish') {
      return 'Namaste! Main Green Mitra hoon — aapka local carbon assistant. Aap fuel emission, electricity saving, dashboard, leaderboard, certificate ya carbon reduction tips ke baare me puch sakte hain.';
    }
    return 'Hello! I am Green Mitra, your local carbon assistant for Rajasthan. Ask me anything about fuel emissions, electricity savings, the dashboard, leaderboard, certificates, or how to reduce your carbon footprint.';
  }
  if (intent === 'thanks') {
    if (language === 'hindi' || language === 'hinglish') {
      return 'Aapka swagat hai! Aur kuch puchna ho to bataiye — main yahan hi hoon.';
    }
    return 'You\'re welcome! Ask me anything else about emissions, electricity, dashboard, certificates, or the environment.';
  }
  if (intent === 'bot_identity') {
    return 'I am **Green Mitra** — a local, no-paid-API carbon assistant built for the Rajasthan State Pollution Control Board Carbon Emission Calculator. I run fully on this server and help you understand fuel emissions, electricity savings, the dashboard, leaderboard, certificates, and broader environment topics like climate change, solar power, and EVs.';
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
        'Calculate 100 km bike emission',
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
        'Calculate 600 units and 10 zero hours',
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
      reply: buildKnowledgeReply(knowledgeKey, language),
      suggestedQuestions: followUpsFor(knowledgeKey)
    };
  }

  // 4. Unknown but relevant — give a friendly orientation answer.
  const fallback =
    language === 'english'
      ? `I can help with carbon emission for fuel travel and electricity savings, dashboard / leaderboard / certificate explanations, and broader topics like climate change, solar power, EVs, public transport, tree plantation, and Rajasthan-specific environment.\n\nTry: "100 km bike carbon batao", "What does the dashboard show?", "What is carbon footprint?", or "Tell me about solar power".`
      : `Main aapki madad kar sakta hoon fuel emission, electricity carbon saving, dashboard / leaderboard / certificate ke baare me, aur saath hi climate change, solar power, EV, tree plantation jaisi topics par bhi.\n\nTry karein: "100 km bike carbon batao", "Dashboard kya dikhata hai?", "Carbon footprint kya hai?", ya "Solar power ke baare me batao".`;

  return {
    reply: fallback,
    suggestedQuestions: DEFAULT_SUGGESTIONS
  };
}

export { DEFAULT_SUGGESTIONS };
