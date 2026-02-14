import { useState, useRef, useEffect } from 'react';

function ChatInput({ onSend, isLoading, hasMessages }) {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input);
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border-subtle bg-bg-dark">
      <div className="max-w-container mx-auto px-6 py-4">
        <div className="max-w-content mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="relative flex items-center gap-3 bg-bg-dark border border-border-subtle rounded-xl px-4 py-3 focus-within:border-border-focus transition-colors">
              <textarea
                ref={textareaRef}
                className="flex-1 bg-transparent border-none outline-none text-text-primary placeholder:text-text-secondary resize-none overflow-hidden text-base leading-relaxed max-h-48"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={hasMessages ? "Continue the conversation..." : "Describe your project requirements..."}
                rows={1}
                disabled={isLoading}
              />
              <button
                type="submit"
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-transparent border border-white text-text-primary hover:bg-border-subtle disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                disabled={!input.trim() || isLoading}
                aria-label="Send message"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-text-secondary border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 2L11 13" />
                    <path d="M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                )}
              </button>
            </div>
            <div className="flex justify-center mt-2">
              <span className="text-xs text-text-secondary">Press Enter to send, Shift+Enter for new line</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChatInput;
