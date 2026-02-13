const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Generates a proposal document from user query
 * @param {string} query - User's project requirements
 * @returns {Promise<Blob>} DOCX file blob
 */
export async function generateProposal(query) {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-proposal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
    }

    // Get the blob from response
    const blob = await response.blob();
    return blob;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Failed to connect to the server. Please make sure the backend is running.');
    }
    throw error;
  }
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
