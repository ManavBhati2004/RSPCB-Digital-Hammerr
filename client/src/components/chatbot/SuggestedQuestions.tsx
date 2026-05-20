interface Props {
  questions: string[];
  disabled: boolean;
  onPick: (q: string) => void;
}

const SuggestedQuestions = ({ questions, disabled, onPick }: Props) => {
  if (!questions || questions.length === 0) return null;
  return (
    <div className="chatbot-suggestions" aria-label="Suggested questions">
      {questions.map((q) => (
        <button
          key={q}
          type="button"
          className="chatbot-suggestion-chip"
          onClick={() => onPick(q)}
          disabled={disabled}
        >
          {q}
        </button>
      ))}
    </div>
  );
};

export default SuggestedQuestions;
