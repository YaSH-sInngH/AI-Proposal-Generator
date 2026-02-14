/**
 * Builds system and user prompts for OpenAI API
 */

/**
 * Extracts hours from user query using regex patterns
 * @param {string} query - User's project requirements
 * @returns {number|null} Extracted hours or null if not found
 */
export function extractHoursFromQuery(query) {
  if (!query || typeof query !== 'string') {
    return null;
  }

  // Patterns to match hours: "50 hours", "50hrs", "50 hrs", "50h", "50 h", "fifty hours", etc.
  const patterns = [
    /(\d+)\s*(?:hours?|hrs?|h)\b/i,  // Matches: "50 hours", "50hrs", "50 hrs", "50h", "50 h"
    /\b(\d+)\s*(?:hour|hours)\b/i,   // More specific: "50 hour" or "50 hours"
  ];

  for (const pattern of patterns) {
    const match = query.match(pattern);
    if (match && match[1]) {
      const hours = parseInt(match[1], 10);
      if (hours > 0 && hours <= 1000) { // Reasonable range check
        return hours;
      }
    }
  }

  return null;
}

/**
 * Builds the system prompt that instructs the LLM on how to generate proposals
 * @returns {string} System prompt
 */
export function buildSystemPrompt() {
  return `You are an expert technical project manager creating COMPREHENSIVE, DETAILED project proposals.

YOUR PRIMARY GOAL:
Generate a proposal that will be 4-5 PAGES when rendered. This requires:
- 10-12 detailed tasks per phase
- Each task has TWO parts:
  1. A brief task title (one sentence)
  2. A detailed explanation paragraph (3-5 sentences) explaining what will be done, how, and why

CRITICAL STRUCTURE:
Each task must have:
{
  "title": "Brief task description without hours",
  "explanation": "Detailed 3-5 sentence paragraph explaining the implementation approach, technologies used, what will be built, and expected outcomes. This should be comprehensive and technical."
}

EXAMPLE TASK STRUCTURE:
{
  "title": "Set up the Node.js project structure and all required configurations.",
  "explanation": "This involves initializing a new Node.js project with npm, setting up the folder structure following MVC architecture principles, and configuring essential files like package.json, .env for environment variables, and .gitignore. We will install core dependencies including Express.js for the web framework, dotenv for configuration management, and nodemon for development. The project will be structured with separate directories for routes, controllers, models, middleware, and utilities to ensure clean code organization and maintainability. TypeScript configuration will also be added if needed for type safety."
}

{
  "title": "Initialize Pinecone DB for storing and retrieving document embeddings.",
  "explanation": "Pinecone will be configured as the vector database to store high-dimensional embeddings generated from documents. This includes creating a Pinecone account, setting up an index with appropriate dimensions matching the embedding model, and configuring the connection in the application using API keys. We will establish the data schema for metadata storage alongside vectors, implement connection pooling for efficient database access, and set up error handling for database operations. The configuration will support similarity search queries and will be optimized for fast retrieval of relevant documents."
}

WRITING RULES:
❌ NEVER use: "robust", "cutting-edge", "innovative", "world-class", "seamless", "leverage"
✅ ALWAYS be specific about technologies and implementation details
✅ ALWAYS explain the "what", "how", and "why"
✅ ALWAYS write in complete sentences with proper grammar
✅ ALWAYS include 3-5 sentences per explanation

TASK GENERATION REQUIREMENTS:
- Phase 1: 10-12 tasks with explanations (60-70% of hours)
- Phase 2: 6-8 tasks with explanations (15-25% of hours)
- Phase 3: 6-8 tasks with explanations (10-20% of hours)
- Each explanation: 3-5 sentences, 50-100 words
- Total: 22-28 tasks minimum

JSON SCHEMA (STRICT):
{
  "phases": [
    {
      "name": "Phase 1 — Core Development",
      "totalHours": "40",
      "tasks": [
        {
          "title": "Task description without hours.",
          "explanation": "Detailed 3-5 sentence paragraph explaining what will be done, which technologies will be used, the implementation approach, and the expected deliverables. Include technical specifics about frameworks, libraries, configurations, and architectural decisions. Explain both the how and the why of the implementation."
        }
      ]
    },
    {
      "name": "Phase 2 — Deployment & Infrastructure",
      "totalHours": "10",
      "tasks": [
        {
          "title": "Task description.",
          "explanation": "Detailed explanation paragraph."
        }
      ]
    },
    {
      "name": "Phase 3 — Testing & Frontend Integration",
      "totalHours": "10",
      "tasks": [
        {
          "title": "Task description.",
          "explanation": "Detailed explanation paragraph."
        }
      ]
    }
  ],
  "overallTotalHours": "60",
  "techStack": ["Node.js", "Express", "Pinecone", ...]
}

CRITICAL HOURS REQUIREMENT:
- The overallTotalHours MUST match the EXACT value specified in the user prompt
- The sum of all phase.totalHours values MUST equal overallTotalHours exactly
- If user specifies "50 hours", overallTotalHours must be "50" and phase totals must sum to 50
- If user specifies "20 hours", overallTotalHours must be "20" and phase totals must sum to 20
- NEVER round up or change the specified hours - use them exactly as provided

EXPLANATION WRITING GUIDELINES:
- Start by explaining what the task involves
- Mention specific technologies, frameworks, and tools
- Explain the implementation approach
- Include configuration details when relevant
- Mention expected outcomes or deliverables
- Keep it technical but readable
- 3-5 sentences minimum per explanation

Return ONLY valid JSON. No markdown blocks, just pure JSON.`;
}

/**
 * Builds the user prompt with the query requirements
 * @param {string} query - User's project requirements
 * @returns {string} User prompt
 */
export function buildUserPrompt(query) {
  // Extract hours from query
  const extractedHours = extractHoursFromQuery(query);
  const totalHours = extractedHours || 40; // Default to 40 if not found

  // Build hours instruction - emphasize exact hours if specified
  let hoursInstruction = '';
  if (extractedHours) {
    hoursInstruction = `\n⚠️ CRITICAL: The user has specified EXACTLY ${extractedHours} hours. You MUST use ${extractedHours} hours as the overallTotalHours. Do NOT use any other value. The sum of all phase totalHours must equal ${extractedHours} hours exactly.`;
  } else {
    hoursInstruction = `\n- Total hours not specified in query, defaulting to 40 hours total`;
  }

  return `Generate a COMPREHENSIVE project breakdown with detailed explanations for:

${query}
${hoursInstruction}

REQUIREMENTS:
- Total project hours: ${totalHours} hours (MUST be exact - sum of all phases must equal ${totalHours})
- Phase 1: 10-12 tasks with explanations (60-70% of ${totalHours} hours = ${Math.round(totalHours * 0.65)} hours)
- Phase 2: 6-8 tasks with explanations (15-25% of ${totalHours} hours = ${Math.round(totalHours * 0.20)} hours)
- Phase 3: 6-8 tasks with explanations (10-20% of ${totalHours} hours = ${Math.round(totalHours * 0.15)} hours)
- Each explanation must be 3-5 sentences (50-100 words)
- Make explanations technical and detailed
- Extract all technologies and list in techStack
- The overallTotalHours field MUST be "${totalHours}" (as a string)

IMPORTANT: Ensure the sum of phase.totalHours equals ${totalHours} hours exactly.

This should produce a 4-5 page document when rendered.

Return JSON only.`;
}