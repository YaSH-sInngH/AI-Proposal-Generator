import { useState, useRef, useEffect } from 'react';
import ChatInput from './components/ChatInput';
import Message from './components/Message';
import { generateProposal } from './services/api';

function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const hasMessages = messages.length > 0;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (query) => {
    if (!query.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: query,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Generate proposal
      const blob = await generateProposal(query);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Project-Proposal.docx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Add success message
      const successMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Your proposal document has been generated and downloaded successfully!',
        timestamp: new Date(),
        isSuccess: true
      };

      setMessages(prev => [...prev, successMessage]);
    } catch (error) {
      // Add error message
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: error.message || 'Failed to generate proposal. Please try again.',
        timestamp: new Date(),
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border-subtle bg-bg-dark">
        <div className="max-w-container mx-auto px-6">
          <div className="py-3 text-center">
            <h1 className="text-2xl font-bold text-text-primary mb-1">
              Proposal Generator
            </h1>
            <p className="text-sm text-text-secondary">
              AI-powered proposal document generation
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-container mx-auto px-6 pt-24 pb-32">
        {/* Messages Container */}
        <div className="max-w-content mx-auto">
          {!hasMessages && (
            <div className="flex flex-col items-center justify-center text-center py-12">
              <div className="mb-6 text-text-secondary">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6" />
                  <path d="M16 13H8" />
                  <path d="M16 17H8" />
                  <path d="M10 9H8" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-text-primary mb-3">
                Generate Your Proposal
              </h2>
              <p className="text-base text-text-secondary max-w-md">
                Describe your project requirements and I'll create a professional proposal document for you.
              </p>
            </div>
          )}

          {hasMessages && (
            <div className="space-y-6 pb-6">
              {messages.map((message) => (
                <Message key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-border-subtle flex items-center justify-center flex-shrink-0">
                    <div className="text-sm font-medium text-text-secondary">AI</div>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <div className="w-2 h-2 rounded-full bg-text-secondary opacity-60 animate-pulse" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-text-secondary opacity-60 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-text-secondary opacity-60 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Chat Input */}
      <ChatInput 
        onSend={handleSendMessage} 
        isLoading={isLoading}
        hasMessages={hasMessages}
      />
    </div>
  );
}

export default App;
