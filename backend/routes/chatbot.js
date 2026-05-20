import express from 'express';
import ChatMessage from '../models/ChatMessage.js';
import { processMessage } from '../services/localChatEngine.js';

const router = express.Router();

router.post('/message', async (req, res) => {
  try {
    if (String(process.env.CHATBOT_ENABLED).toLowerCase() === 'false') {
      return res.status(503).json({
        success: false,
        reply: 'Chatbot is currently disabled by the site administrator.'
      });
    }

    const { message, sessionId, pageContext } = req.body || {};

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        reply: 'Please type a question about carbon emission, electricity, fuel, dashboard, leaderboard, or certificate.'
      });
    }

    const result = await processMessage({ message, sessionId, pageContext });

    if (String(process.env.CHATBOT_SAVE_LOGS).toLowerCase() !== 'false' && sessionId) {
      // Best-effort log. Never block the response on a Mongo error.
      ChatMessage.create({
        sessionId,
        userMessage: message.slice(0, 800),
        botReply: result.reply,
        topic: result.topic,
        intent: result.intent,
        confidence: result.confidence,
        extractedData: result.extractedData || {},
        pageContext: pageContext || {},
        engine: result.engine,
        isRelevant: result.isRelevant
      }).catch((err) => {
        console.warn('ChatMessage log failed:', err.message);
      });
    }

    return res.json({
      success: result.success,
      reply: result.reply,
      intent: result.intent,
      engine: result.engine,
      suggestedQuestions: result.suggestedQuestions
    });
  } catch (err) {
    console.error('chatbot /message error:', err);
    return res.status(500).json({
      success: false,
      reply: 'Sorry, I am having trouble answering right now. You can still use the calculator, and I can help again in a moment.'
    });
  }
});

export default router;
