import { detectLanguage } from '../utils/languageDetector.js';
import { parseMessage } from '../utils/messageParser.js';
import { detectIntent, INTENT_TO_TOPIC } from './localIntentDetector.js';
import { checkTopic, REDIRECT_REPLY } from './topicGuardService.js';
import { buildReply, DEFAULT_SUGGESTIONS } from './localResponseBuilder.js';
import { askLocalOllama } from './ollamaLocalService.js';

const MAX_LEN_DEFAULT = 800;

function normalize(text) {
  return text.replace(/\s+/g, ' ').trim();
}

function isOllamaModeOn() {
  return (
    process.env.CHATBOT_ENGINE === 'ollama' &&
    String(process.env.OLLAMA_ENABLED).toLowerCase() === 'true'
  );
}

export async function processMessage({ message, sessionId, pageContext }) {
  const maxLen = Number(process.env.CHATBOT_MAX_MESSAGE_LENGTH) || MAX_LEN_DEFAULT;

  if (!message || !message.trim()) {
    return {
      success: false,
      reply: 'Please type a question about carbon emission, electricity, fuel, dashboard, leaderboard, or certificate.',
      intent: 'unknown_relevant',
      topic: 'general',
      confidence: 0,
      extractedData: {},
      engine: 'local-rules',
      isRelevant: false,
      suggestedQuestions: DEFAULT_SUGGESTIONS
    };
  }

  if (message.length > maxLen) {
    return {
      success: true,
      reply: 'Please ask a shorter question related to carbon emission, fuel, electricity, dashboard, leaderboard, or certificate.',
      intent: 'unknown_relevant',
      topic: 'general',
      confidence: 0,
      extractedData: {},
      engine: 'local-rules',
      isRelevant: false,
      suggestedQuestions: DEFAULT_SUGGESTIONS
    };
  }

  const normalized = normalize(message);
  const language = detectLanguage(normalized);

  // 1. Topic guard — bail out early on clearly out-of-scope questions.
  const guard = checkTopic(normalized);
  if (!guard.inScope) {
    return {
      success: true,
      reply: guard.redirect || REDIRECT_REPLY,
      intent: 'out_of_scope',
      topic: 'out-of-scope',
      confidence: 1,
      extractedData: {},
      engine: 'local-rules',
      isRelevant: false,
      suggestedQuestions: DEFAULT_SUGGESTIONS
    };
  }

  // 2. Parse structured fields + intent.
  const parsed = parseMessage(normalized);
  const intentInfo = detectIntent(normalized, parsed);

  // 3. Try rule-based reply.
  const ruleResult = buildReply({
    intent: intentInfo.intent,
    parsed,
    language,
    message: normalized
  });

  let reply = ruleResult.reply;
  let engine = 'local-rules';

  // 4. Optionally call local Ollama for low-confidence, relevant, non-calc intents.
  const isCalcIntent =
    intentInfo.intent === 'fuel_calculation' || intentInfo.intent === 'electricity_calculation';
  const shouldTryOllama =
    isOllamaModeOn() &&
    !isCalcIntent &&
    intentInfo.intent === 'unknown_relevant';

  if (shouldTryOllama) {
    try {
      const llmReply = await askLocalOllama({ message: normalized });
      if (llmReply && llmReply.length > 0) {
        reply = llmReply;
        engine = 'ollama';
      }
    } catch (err) {
      // Silent fallback — keep the rule-based reply, mark engine as fallback.
      engine = 'fallback';
    }
  }

  return {
    success: true,
    reply,
    intent: intentInfo.intent,
    topic: INTENT_TO_TOPIC[intentInfo.intent] || 'general',
    confidence: intentInfo.confidence,
    extractedData: {
      distanceKm: parsed.distanceKm ?? undefined,
      vehicleType: parsed.vehicleType ?? undefined,
      fuelType: parsed.fuelType ?? undefined,
      consumption: parsed.consumption ?? undefined,
      nonConsumption: parsed.nonConsumption ?? undefined
    },
    engine,
    isRelevant: intentInfo.intent !== 'out_of_scope',
    suggestedQuestions: ruleResult.suggestedQuestions || DEFAULT_SUGGESTIONS,
    pageContext: pageContext || null,
    sessionId: sessionId || null,
    language
  };
}
