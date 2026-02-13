/**
 * OpenAI API service for generating proposal content
 */
import OpenAI from 'openai';
import { buildSystemPrompt, buildUserPrompt } from '../utils/promptBuilder.js';

// Lazy initialization - create client when needed (after dotenv loads)
let openai = null;

/**
 * Gets or creates the OpenAI client instance
 * @returns {OpenAI} OpenAI client instance
 */
function getOpenAIClient() {
  if (!openai) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set in environment variables');
    }
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  return openai;
}

/**
 * Generates a proposal structure from user query using OpenAI
 * @param {string} query - User's project requirements
 * @returns {Promise<Object>} Structured proposal JSON
 * @throws {Error} If OpenAI API call fails or returns invalid data
 */
export async function generateProposal(query) {
  const client = getOpenAIClient();

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: buildSystemPrompt()
        },
        {
          role: 'user',
          content: buildUserPrompt(query)
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7
    });

    const content = response.choices[0].message.content;
    
    if (!content) {
      throw new Error('OpenAI returned empty response');
    }

    // Parse JSON response
    let proposalData;
    try {
      proposalData = JSON.parse(content);
    } catch (parseError) {
      throw new Error(`Failed to parse OpenAI JSON response: ${parseError.message}`);
    }

    return proposalData;
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      throw new Error(`OpenAI API error: ${error.message}`);
    }
    throw error;
  }
}
