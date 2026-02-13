/**
 * Proposal routes
 */
import express from 'express';
import { generateProposalController } from '../controllers/proposal.controller.js';

const router = express.Router();

// POST /generate-proposal - Generate proposal document
router.post('/generate-proposal', generateProposalController);

export default router;
