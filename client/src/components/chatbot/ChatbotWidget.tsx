import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle, Leaf } from 'lucide-react';
import ChatbotHeader from './ChatbotHeader';
import ChatbotMessages from './ChatbotMessages';
import type { ChatMessage } from './ChatbotMessages';
import ChatbotInput from './ChatbotInput';
import SuggestedQuestions from './SuggestedQuestions';
import {
  sendChatMessage,
  getOrCreateSessionId,
  generateSessionId
} from '../../services/chatbotService';
import type { PageContext } from '../../services/chatbotService';

const WELCOME_MESSAGE =
  'Namaste! I am Green Mitra, your local carbon assistant. I can help you understand fuel emissions, electricity carbon savings, dashboard results, leaderboard ranking, certificates, and simple ways to reduce your carbon footprint in Rajasthan. What would you like to know?';

const INITIAL_SUGGESTIONS = [
  'How is petrol emission calculated?',
  'Calculate 100 km bike emission',
  'What does the dashboard show?',
  'How can I reduce my carbon footprint?'
];

function pathToPageContext(pathname: string): PageContext {
  if (pathname.startsWith('/calculator')) {
    return { currentPage: 'calculator', calculatorType: 'fuel' };
  }
  if (pathname.startsWith('/dashboard')) return { currentPage: 'dashboard' };
  if (pathname.startsWith('/leaderboard')) return { currentPage: 'leaderboard' };
  if (pathname.startsWith('/top-contributors')) return { currentPage: 'top-contributors' };
  if (pathname === '/' || pathname === '') return { currentPage: 'home' };
  return { currentPage: pathname.replace(/^\//, '') || 'home' };
}

const ChatbotWidget = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>(INITIAL_SUGGESTIONS);
  const [sessionId, setSessionId] = useState<string>('');
  const launcherRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setSessionId(getOrCreateSessionId());
  }, []);

  // Seed welcome message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        { id: generateSessionId(), role: 'bot', text: WELCOME_MESSAGE }
      ]);
    }
  }, [isOpen, messages.length]);

  // Esc to close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        launcherRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen]);

  const pageContext = useMemo(
    () => pathToPageContext(location.pathname),
    [location.pathname]
  );

  const handleSend = useCallback(
    async (overrideText?: string) => {
      const text = (overrideText ?? input).trim();
      if (!text || isLoading) return;

      const userMsg: ChatMessage = {
        id: generateSessionId(),
        role: 'user',
        text
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setIsLoading(true);

      try {
        const res = await sendChatMessage({
          message: text,
          sessionId,
          pageContext
        });
        setMessages((prev) => [
          ...prev,
          { id: generateSessionId(), role: 'bot', text: res.reply }
        ]);
        if (Array.isArray(res.suggestedQuestions) && res.suggestedQuestions.length > 0) {
          setSuggestions(res.suggestedQuestions);
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: generateSessionId(),
            role: 'bot',
            text:
              'Sorry, I am having trouble answering right now. You can still use the calculator, and I can help again in a moment.'
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, sessionId, pageContext]
  );

  return (
    <>
      {!isOpen && (
        <button
          ref={launcherRef}
          type="button"
          className="chatbot-launcher"
          aria-label="Open carbon assistant"
          onClick={() => setIsOpen(true)}
        >
          <Leaf size={26} />
        </button>
      )}

      {isOpen && (
        <div
          className="chatbot-panel"
          role="dialog"
          aria-modal="false"
          aria-label="Green Mitra carbon assistant"
        >
          <ChatbotHeader onClose={() => setIsOpen(false)} />

          <ChatbotMessages messages={messages} isLoading={isLoading} />

          <div className="chatbot-suggestions-wrap">
            <SuggestedQuestions
              questions={suggestions}
              disabled={isLoading}
              onPick={(q) => handleSend(q)}
            />
          </div>

          <ChatbotInput
            value={input}
            disabled={isLoading}
            onChange={setInput}
            onSend={() => handleSend()}
          />

          <div className="chatbot-footer">
            <MessageCircle size={12} aria-hidden />
            <span>
              This local assistant stores anonymous chat data only to improve guidance. Do not share personal details.
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
