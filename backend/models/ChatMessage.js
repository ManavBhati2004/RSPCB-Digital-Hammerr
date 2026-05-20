import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true },
    userMessage: { type: String, required: true, trim: true, maxlength: 800 },
    botReply: { type: String, required: true, trim: true },
    topic: {
      type: String,
      enum: [
        'fuel',
        'electricity',
        'dashboard',
        'leaderboard',
        'certificate',
        'website-guide',
        'carbon-awareness',
        'tips',
        'privacy',
        'out-of-scope',
        'general'
      ],
      default: 'general'
    },
    intent: { type: String, default: 'unknown_relevant' },
    confidence: { type: Number, default: 0 },
    extractedData: {
      distanceKm: Number,
      vehicleType: String,
      fuelType: String,
      consumption: Number,
      nonConsumption: Number
    },
    pageContext: {
      currentPage: String,
      calculatorType: String
    },
    engine: {
      type: String,
      enum: ['local-rules', 'ollama', 'fallback'],
      default: 'local-rules'
    },
    isRelevant: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);
export default ChatMessage;
