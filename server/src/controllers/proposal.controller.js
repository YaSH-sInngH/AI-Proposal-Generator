/**
 * Proposal controller - handles HTTP requests for proposal generation
 */
import { generateProposal } from '../services/openai.service.js';
import { generateProposalDoc } from '../services/docx.service.js';
import { validateProposalStructure } from '../services/template.service.js';

/**
 * Helper function to send SSE message
 * @param {Object} res - Express response object
 * @param {string} type - Event type
 * @param {Object} data - Data to send
 */
function sendSSE(res, type, data) {
  const message = `event: ${type}\ndata: ${JSON.stringify(data)}\n\n`;
  res.write(message);
  // Force flush to ensure message is sent immediately
  // Note: res.flush() may not be available in all Express setups
  if (typeof res.flush === 'function') {
    res.flush();
  } else if (res.socket && res.socket.write) {
    // Alternative: flush the underlying socket
    res.socket.write('');
  }
}

/**
 * Generates a proposal document from user query with Server-Sent Events
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function generateProposalController(req, res) {
  // Set headers for SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering

  try {
    // Validate input
    const { query } = req.body;

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      sendSSE(res, 'error', {
        error: 'Missing or invalid query field. Please provide a query string with project requirements.'
      });
      res.end();
      return;
    }

    // Send initial progress update
    sendSSE(res, 'progress', {
      message: 'Starting proposal generation...',
      stage: 'initializing'
    });

    // Generate proposal using OpenAI
    let proposalData;
    try {
      sendSSE(res, 'progress', {
        message: 'Analyzing requirements with AI...',
        stage: 'analyzing'
      });

      // Start the OpenAI call
      const proposalPromise = generateProposal(query.trim());
      
      // Send periodic updates during AI processing (every 3 seconds)
      // This keeps the UI active during the long OpenAI wait
      const progressInterval = setInterval(() => {
        sendSSE(res, 'progress', {
          message: 'AI is processing your requirements...',
          stage: 'analyzing'
        });
      }, 3000);

      proposalData = await proposalPromise;
      
      // Clear the interval once we get the response
      clearInterval(progressInterval);
      
      // Log for debugging
      console.log('Generated proposal structure:');
      console.log('Phase 1 tasks:', proposalData.phases[0]?.tasks?.length);
      console.log('Phase 2 tasks:', proposalData.phases[1]?.tasks?.length);
      console.log('Phase 3 tasks:', proposalData.phases[2]?.tasks?.length);
      console.log('Total hours:', proposalData.overallTotalHours);
      
      sendSSE(res, 'progress', {
        message: 'Proposal structure generated successfully!',
        stage: 'generated'
      });
    } catch (error) {
      console.error('OpenAI service error:', error);
      sendSSE(res, 'error', {
        error: 'Failed to generate proposal',
        details: error.message
      });
      res.end();
      return;
    }
    
    // Validate proposal structure
    sendSSE(res, 'progress', {
      message: 'Validating proposal structure...',
      stage: 'validating'
    });

    const validation = validateProposalStructure(proposalData);
    if (!validation.isValid) {
      console.error('Proposal validation errors:', validation.errors);
      sendSSE(res, 'error', {
        error: 'Generated proposal does not match required structure',
        details: validation.errors
      });
      res.end();
      return;
    }
    
    sendSSE(res, 'progress', {
      message: 'Proposal validated successfully!',
      stage: 'validated'
    });
    
    // Generate DOCX document
    let docBuffer;
    try {
      sendSSE(res, 'progress', {
        message: 'Creating document...',
        stage: 'creating'
      });

      docBuffer = await generateProposalDoc(proposalData);
      
      sendSSE(res, 'progress', {
        message: 'Finalizing document...',
        stage: 'finalizing'
      });
    } catch (error) {
      console.error('DOCX generation error:', error);
      sendSSE(res, 'error', {
        error: 'Failed to generate document',
        details: error.message
      });
      res.end();
      return;
    }

    // Convert buffer to base64 for JSON response
    const base64File = docBuffer.toString('base64');
    const fileName = 'Project-Proposal.docx';

    // Send final success message with file data
    sendSSE(res, 'complete', {
      success: true,
      message: 'Proposal document generated successfully!',
      file: {
        name: fileName,
        data: base64File,
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      }
    });

    res.end();
  } catch (error) {
    console.error('Unexpected error in proposal controller:', error);
    sendSSE(res, 'error', {
      error: 'Internal server error',
      details: error.message
    });
    res.end();
  }
}