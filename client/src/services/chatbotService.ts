import axios from 'axios';

const API: string =
  (import.meta.env.VITE_API_URL as string | undefined) ||
  `http://${window.location.hostname}:5000`;

export interface PageContext {
  currentPage: string;
  calculatorType?: string | null;
}

export interface ChatbotResponse {
  success: boolean;
  reply: string;
  intent: string;
  engine: 'local-rules' | 'ollama' | 'fallback';
  suggestedQuestions: string[];
}

export interface SendChatArgs {
  message: string;
  sessionId: string;
  pageContext: PageContext;
}

export async function sendChatMessage({
  message,
  sessionId,
  pageContext
}: SendChatArgs): Promise<ChatbotResponse> {
  const res = await axios.post<ChatbotResponse>(
    `${API}/api/chatbot/message`,
    { message, sessionId, pageContext },
    { headers: { 'Content-Type': 'application/json' } }
  );
  return res.data;
}

export function generateSessionId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  // Fallback v4-ish identifier
  return 'gm-' + Math.random().toString(36).slice(2) + '-' + Date.now().toString(36);
}

export const SESSION_KEY = 'carbon_chat_session_id';

export function getOrCreateSessionId(): string {
  try {
    const existing = localStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const fresh = generateSessionId();
    localStorage.setItem(SESSION_KEY, fresh);
    return fresh;
  } catch {
    return generateSessionId();
  }
}
