import { Send } from 'lucide-react';
import type { KeyboardEvent } from 'react';

interface Props {
  value: string;
  disabled: boolean;
  onChange: (v: string) => void;
  onSend: () => void;
}

const ChatbotInput = ({ value, disabled, onChange, onSend }: Props) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled) onSend();
    }
  };

  return (
    <div className="chatbot-input">
      <textarea
        className="chatbot-input__field"
        placeholder="Ask about carbon emission..."
        value={value}
        rows={1}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-label="Type your question for Green Mitra"
      />
      <button
        type="button"
        className="chatbot-input__send"
        onClick={onSend}
        disabled={disabled || !value.trim()}
        aria-label="Send message"
      >
        <Send size={18} />
      </button>
    </div>
  );
};

export default ChatbotInput;
