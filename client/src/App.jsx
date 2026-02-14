import { useState, useRef, useEffect } from 'react';
import ChatInput from './components/ChatInput';
import Message from './components/Message';
import { generateProposal } from './services/api';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileWord  } from "@fortawesome/free-solid-svg-icons";

import ProgressIndicator from './components/ProgressIndicator';

function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progressDataMap, setProgressDataMap] = useState({}); // Map of queryId -> progress data
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

    // Create a unique query ID for this request
    const queryId = Date.now();
    
    // Add user message with queryId reference
    const userMessage = {
      id: queryId,
      role: 'user',
      content: query,
      timestamp: new Date(),
      queryId: queryId
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Initialize progress state for this query
    setProgressDataMap(prev => ({
      ...prev,
      [queryId]: {
        currentStage: 'initializing',
        stagesCompleted: []
      }
    }));

    try {
      // Define stage order for tracking
      const stageOrder = ['initializing', 'analyzing', 'generated', 'validating', 'validated', 'creating', 'finalizing', 'complete'];
      
      // Generate proposal with progress callback
      const response = await generateProposal(query, (progressMessage, stage) => {
        console.log('Progress update received:', progressMessage, stage); // Debug log
        
        // Force immediate state update for each progress event
        setProgressDataMap(prev => {
          const queryProgress = prev[queryId] || { currentStage: 'initializing', stagesCompleted: [] };
          
          const stagesCompleted = [...(queryProgress.stagesCompleted || [])];
          const currentStageIndex = stageOrder.indexOf(stage);
          const prevStageIndex = stageOrder.indexOf(queryProgress.currentStage);
          
          // Mark previous stage as completed when moving to next
          if (prevStageIndex >= 0 && prevStageIndex < currentStageIndex) {
            const prevStage = stageOrder[prevStageIndex];
            if (!stagesCompleted.includes(prevStage)) {
              stagesCompleted.push(prevStage);
            }
          }
          
          // Mark all stages before current as completed
          for (let i = 0; i < currentStageIndex; i++) {
            const stageToComplete = stageOrder[i];
            if (!stagesCompleted.includes(stageToComplete)) {
              stagesCompleted.push(stageToComplete);
            }
          }
          
          // Return new object to trigger re-render immediately
          const newState = {
            currentStage: stage,
            stagesCompleted: [...stagesCompleted] // Create new array
          };
          
          console.log('Updating progress state:', newState); // Debug log
          return {
            ...prev,
            [queryId]: newState
          };
        });
      });
      
      // Mark all stages as completed including the final one
      setProgressDataMap(prev => ({
        ...prev,
        [queryId]: {
          currentStage: 'complete',
          stagesCompleted: ['initializing', 'analyzing', 'generated', 'validating', 'validated', 'creating', 'finalizing', 'complete']
        }
      }));
      
      // Add success message with file and queryId reference
      const successMessage = {
        id: queryId + 1,
        role: 'assistant',
        content: response.message || 'Your proposal document has been generated successfully!',
        timestamp: new Date(),
        isSuccess: true,
        file: response.file,
        queryId: queryId // Link to the query
      };
      
      setMessages(prev => [...prev, successMessage]);
    } catch (error) {
      // Clear progress for this query and show error
      setProgressDataMap(prev => {
        const newMap = { ...prev };
        delete newMap[queryId];
        return newMap;
      });
      
      const errorMessage = {
        id: queryId + 1,
        role: 'assistant',
        content: error.message || 'Failed to generate proposal. Please try again.',
        timestamp: new Date(),
        isError: true,
        queryId: queryId // Link to the query
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
                <FontAwesomeIcon icon={faFileWord} className="text-6xl"/>
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
              {/* Group messages by query thread */}
              {(() => {
                // Get all unique query IDs
                const queryIds = [...new Set(messages.map(msg => msg.queryId).filter(Boolean))];
                
                // If no queryIds, render messages in order
                if (queryIds.length === 0) {
                  return messages.map((message) => (
                    <Message key={message.id} message={message} />
                  ));
                }
                
                // Render each query thread: User -> Progress -> Assistant
                return queryIds.map(queryId => {
                  const userMessage = messages.find(msg => msg.role === 'user' && msg.queryId === queryId);
                  const assistantMessage = messages.find(msg => msg.role === 'assistant' && msg.queryId === queryId);
                  const progressData = progressDataMap[queryId];
                  
                  return (
                    <div key={queryId} className="space-y-6">
                      {/* User Query */}
                      {userMessage && (
                        <Message key={userMessage.id} message={userMessage} />
                      )}
                      
                      {/* Progress Indicator - Event stream log for this query */}
                      {progressData && (
                        <div className="w-full px-6 py-6 rounded-xl bg-bg-dark">
                          <ProgressIndicator 
                            currentStage={progressData.currentStage || 'initializing'}
                            stagesCompleted={progressData.stagesCompleted || []}
                          />
                        </div>
                      )}
                      
                      {/* Download/Response message for this query */}
                      {assistantMessage && (
                        <Message key={assistantMessage.id} message={assistantMessage} />
                      )}
                    </div>
                  );
                });
              })()}
              
              {isLoading && Object.keys(progressDataMap).length === 0 && (
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
