import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faFileWord } from "@fortawesome/free-solid-svg-icons";

function Message({ message }) {
  const isUser = message.role === 'user';
  const isError = message.isError;
  const isSuccess = message.isSuccess;
  const hasFile = message.file && message.file.data;

  const handleDownload = () => {
    if (!hasFile) return;

    try {
      // Convert base64 to blob
      const byteCharacters = atob(message.file.data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: message.file.mimeType });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = message.file.name || 'Project-Proposal.docx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file. Please try again.');
    }
  };

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
          <div className="flex items-center gap-2">
            <span>{message.content}</span>
          </div>
        </div>
        {hasFile && (
          <div className="mt-2 w-[1/2] bg-border-subtle border border-border-subtle rounded-xl p-4 flex items-center gap-4">
            {/* File Icon */}
            <div className="flex-shrink-0 w-12 h-12 bg-text-primary/10 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faFileWord} className="text-2xl text-text-primary" />
            </div>
            
            {/* File Info */}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-text-primary truncate">
                {message.file.name || 'Project-Proposal.docx'}
              </div>
              <div className="text-xs text-text-secondary mt-1">
                DOCX Document
              </div>
            </div>
            
            {/* Download Button */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* <button
                onClick={handleDownload}
                className="px-4 py-2 bg-border-subtle border border-border-subtle text-text-primary hover:bg-border-focus rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faDownload} />
                Download
              </button> */}
              <button
                onClick={handleDownload}
                className="w-10 h-10 rounded-full bg-border-subtle border border-border-subtle text-text-primary hover:bg-border-focus flex items-center justify-center transition-colors"
                aria-label="Download file"
              >
                <FontAwesomeIcon icon={faDownload} />
              </button>
            </div>
          </div>
        )}
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
