const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Generates a proposal document from user query using Server-Sent Events
 * @param {string} query - User's project requirements
 * @param {Function} onProgress - Callback function for progress updates (message, stage)
 * @returns {Promise<Object>} Response object with file data
 */
export async function generateProposal(query, onProgress) {
  return new Promise((resolve, reject) => {
    try {
      // Create a readable stream from the fetch response
      fetch(`${API_BASE_URL}/generate-proposal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      })
        .then(response => {
          if (!response.ok) {
            // Try to get error message from response
            response.text().then(text => {
              try {
                const errorData = JSON.parse(text);
                reject(new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`));
              } catch {
                reject(new Error(`HTTP error! status: ${response.status}`));
              }
            }).catch(() => {
              reject(new Error(`HTTP error! status: ${response.status}`));
            });
            return;
          }

          if (!response.body) {
            reject(new Error('Response body is null'));
            return;
          }

          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = '';
          let currentEvent = null;

          function processSSEMessage(eventType, data) {
            try {
              const parsedData = JSON.parse(data);
              
              if (eventType === 'progress' && onProgress) {
                onProgress(parsedData.message, parsedData.stage);
              } else if (eventType === 'complete') {
                resolve(parsedData);
                return true; // Signal to stop reading
              } else if (eventType === 'error') {
                reject(new Error(parsedData.error || parsedData.message || 'Unknown error'));
                return true; // Signal to stop reading
              }
            } catch (parseError) {
              console.error('Failed to parse SSE data:', parseError);
            }
            return false;
          }

          function readStream() {
            reader.read().then(({ done, value }) => {
              if (done) {
                // Stream ended - check if we have any pending data
                if (buffer.trim()) {
                  // Try to process remaining buffer
                  const lines = buffer.split('\n').filter(line => line.trim());
                  for (const line of lines) {
                    if (line.startsWith('data: ')) {
                      const dataStr = line.substring(6).trim();
                      if (processSSEMessage(currentEvent || 'message', dataStr)) {
                        return;
                      }
                    }
                  }
                }
                // If we reach here and stream ended without completion, it's an error
                reject(new Error('Stream ended without completion'));
                return;
              }

              // Decode the chunk
              buffer += decoder.decode(value, { stream: true });
              
              // Process complete SSE messages (messages end with double newline)
              while (buffer.includes('\n\n')) {
                const messageEnd = buffer.indexOf('\n\n');
                const message = buffer.substring(0, messageEnd);
                buffer = buffer.substring(messageEnd + 2);
                
                let eventType = 'message';
                let data = '';
                
                const lines = message.split('\n');
                for (const line of lines) {
                  if (line.startsWith('event: ')) {
                    eventType = line.substring(7).trim();
                    currentEvent = eventType;
                  } else if (line.startsWith('data: ')) {
                    data = line.substring(6).trim();
                  }
                }
                
                if (data) {
                  console.log('SSE Event received:', eventType, data); // Debug log
                  const shouldStop = processSSEMessage(eventType, data);
                  if (shouldStop) {
                    return; // Stream completed or error occurred
                  }
                  // Continue reading immediately to process next event
                }
              }

              // Continue reading
              readStream();
            }).catch(error => {
              console.error('SSE read error:', error);
              reject(error);
            });
          }

          readStream();
        })
        .catch(error => {
          if (error instanceof TypeError) {
            reject(new Error('Failed to connect to the server. Please make sure the backend is running.'));
          } else {
            reject(error);
          }
        });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Health check endpoint
 * @returns {Promise<Object>} Health status
 */
export async function checkHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new Error('Health check failed');
    }
    return await response.json();
  } catch (error) {
    throw new Error('Server is not responding');
  }
}
