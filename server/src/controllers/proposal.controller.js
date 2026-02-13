/**
 * Proposal controller - handles HTTP requests for proposal generation
 */
import { generateProposal } from '../services/openai.service.js';
import { generateProposalDoc } from '../services/docx.service.js';
import { validateProposalStructure } from '../services/template.service.js';

/**
 * Generates a proposal document from user query
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function generateProposalController(req, res) {
  try {
    // Validate input
    const { query } = req.body;

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({
        error: 'Missing or invalid query field. Please provide a query string with project requirements.'
      });
    }

    // Generate proposal using OpenAI
    let proposalData;
    try {
      proposalData = await generateProposal(query.trim());
    } catch (error) {
      console.error('OpenAI service error:', error);
      return res.status(500).json({
        error: 'Failed to generate proposal',
        details: error.message
      });
    }

    // Validate proposal structure
    const validation = validateProposalStructure(proposalData);
    if (!validation.isValid) {
      console.error('Proposal validation errors:', validation.errors);
      return res.status(500).json({
        error: 'Generated proposal does not match required structure',
        details: validation.errors
      });
    }

    // Generate DOCX document
    let docBuffer;
    try {
      docBuffer = await generateProposalDoc(proposalData);
    } catch (error) {
      console.error('DOCX generation error:', error);
      return res.status(500).json({
        error: 'Failed to generate document',
        details: error.message
      });
    }

    // Set response headers for file download
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="Project-Proposal.docx"'
    );

    // Send document buffer
    return res.send(docBuffer);
  } catch (error) {
    console.error('Unexpected error in proposal controller:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
}
