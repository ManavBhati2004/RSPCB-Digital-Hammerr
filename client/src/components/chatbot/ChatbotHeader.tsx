import { Leaf, X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const ChatbotHeader = ({ onClose }: Props) => {
  return (
    <div className="chatbot-header flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="chatbot-header__icon">
          <Leaf size={22} />
        </div>
        <div>
          <div className="chatbot-header__title">Green Mitra</div>
          <div className="chatbot-header__subtitle">Carbon guidance for Rajasthan</div>
        </div>
      </div>
      <button
        type="button"
        className="chatbot-header__close"
        aria-label="Close carbon assistant"
        onClick={onClose}
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default ChatbotHeader;
