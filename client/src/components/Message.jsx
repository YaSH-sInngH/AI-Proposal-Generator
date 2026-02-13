function Message({ message }) {
  const isUser = message.role === 'user';
  const isError = message.isError;
  const isSuccess = message.isSuccess;

  return (
    <div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className="w-10 h-10 rounded-lg bg-border-subtle flex items-center justify-center flex-shrink-0">
        <div className="text-sm font-medium text-text-secondary">
          {isUser ? 'You' : 'AI'}
        </div>
      </div>
      <div className={`flex-1 max-w-[calc(100%-56px)] flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`px-4 py-3 rounded-xl text-sm leading-relaxed ${
          isError 
            ? 'bg-red-500/10 border border-red-500/30 text-red-400' 
            : isSuccess 
            ? 'bg-border-subtle border border-border-subtle text-text-primary' 
            : isUser
            ? 'bg-border-subtle border border-border-subtle text-text-primary'
            : 'bg-border-subtle border border-border-subtle text-text-primary'
        }`}>
          {message.content}
        </div>
        {message.timestamp && (
          <div className="text-xs text-text-secondary px-1">
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Message;
