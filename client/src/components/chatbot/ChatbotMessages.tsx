import { useEffect, useRef } from 'react';

export interface ChatMessage {
  id: string;
  role: 'bot' | 'user';
  text: string;
}

interface Props {
  messages: ChatMessage[];
  isLoading: boolean;
}

function renderText(text: string) {
  // Convert simple **bold** markers to <strong> while keeping newlines.
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i} style={{ whiteSpace: 'pre-wrap' }}>{part}</span>;
  });
}

const ChatbotMessages = ({ messages, isLoading }: Props) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isLoading]);

  return (
    <div className="chatbot-messages" role="log" aria-live="polite">
      {messages.map((m) => (
        <div
          key={m.id}
          className={`chatbot-message-row ${m.role === 'user' ? 'is-user' : 'is-bot'}`}
        >
          <div className={m.role === 'user' ? 'user-bubble' : 'bot-bubble'}>
            {renderText(m.text)}
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="chatbot-message-row is-bot">
          <div className="bot-bubble chatbot-typing" aria-label="Green Mitra is typing">
            <span className="chatbot-typing__dot" />
            <span className="chatbot-typing__dot" />
            <span className="chatbot-typing__dot" />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};

export default ChatbotMessages;
