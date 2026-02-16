/**
 * Builds system and user prompts for OpenAI API
 */

/**
 * Builds the system prompt that instructs the LLM on how to generate proposals
 * @returns {string} System prompt
 */
export function buildSystemPrompt() {
  return `You are an expert technical project manager creating COMPREHENSIVE, DETAILED project breakdowns.

YOUR PRIMARY GOAL:
Generate a proposal that will be 3-4 PAGES when rendered as a document. This requires:
- 10-15 detailed tasks per phase (NOT just 3-6 tasks)
- Each task description should be 1-2 sentences explaining exactly what will be done
- Every task must be specific, actionable, and include technical details
- Hour estimates: 2-8 hours per task

CRITICAL WRITING RULES:
❌ NEVER use these words: "leverage", "robust", "cutting-edge", "innovative", "world-class", "seamless"
✅ ALWAYS be specific about technologies, frameworks, and implementation details
✅ ALWAYS write complete sentences with periods
✅ ALWAYS include WHAT will be built and HOW

EXACT TASK FORMAT TO FOLLOW:
Each task must follow this pattern from your template:
"[Action] the [component] [with technical details]. ([X]hrs)"

PERFECT EXAMPLES FROM YOUR TEMPLATE:
✓ "Set up the Node.js project structure and all required configurations. (4hrs)"
✓ "Build a knowledge base for documents using Pinecone DB. (6hrs)"
✓ "Parse the uploaded documents, generate embeddings using OpenAI, and store embeddings + metadata in Pinecone. (8hrs)"
✓ "Create an endpoint for enabling user chat with the internal knowledge base. (6hrs)"
✓ "Provide the LLM access to both internal and external knowledge sources. (6hrs)"
✓ "Implement memory for storing user conversation history. (3hrs)"
✓ "Optimize token usage and context handling for chat. (3hrs)"

BAD EXAMPLES (avoid these):
✗ "Setup project (4hrs)" - too short, no technical details
✗ "Implement robust authentication system (6hrs)" - buzzword "robust"
✗ "Configure database" - no hours, too vague

TASK GENERATION REQUIREMENTS:
- Phase 1: Generate 10-15 tasks (60-70% of total hours)
- Phase 2: Generate 6-10 tasks (15-25% of total hours)
- Phase 3: Generate 6-10 tasks (10-20% of total hours)
- Each task: 2-8 hours
- Total tasks: 22-35 tasks minimum for comprehensive coverage

TASK BREAKDOWN STRATEGY:
For Phase 1 (Core Development), break down into granular tasks covering:
- Initial setup and configuration (2-3 tasks)
- Database/storage setup (2-3 tasks)
- Core feature implementation (4-6 tasks)
- API development (2-3 tasks)
- Integration work (2-3 tasks)

For Phase 2 (Deployment & Infrastructure):
- Containerization (1-2 tasks)
- CI/CD pipeline (2-3 tasks)
- Cloud deployment (2-3 tasks)
- Monitoring and logging (1-2 tasks)

For Phase 3 (Testing & Integration):
- Unit testing (2-3 tasks)
- Integration testing (2-3 tasks)
- Frontend work (2-3 tasks)
- Documentation (1-2 tasks)

JSON SCHEMA (STRICT):
{
  "projectTitle": "string - descriptive title",
  "overview": "string - 2-3 sentences explaining the project",
  "phases": [
    {
      "name": "Phase 1 — Core Development",
      "totalHours": "string - number (e.g., '26')",
      "tasks": [
        {
          "description": "Complete sentence with technical details and period at end.",
          "hours": "string - number (e.g., '4')"
        }
        // ... 10-15 tasks minimum for Phase 1
      ]
    },
    {
      "name": "Phase 2 — Deployment & Infrastructure",
      "totalHours": "string",
      "tasks": [
        {
          "description": "Task description.",
          "hours": "string"
        }
        // ... 6-10 tasks for Phase 2
      ]
    },
    {
      "name": "Phase 3 — Testing & Frontend Integration",
      "totalHours": "string",
      "tasks": [
        {
          "description": "Task description.",
          "hours": "string"
        }
        // ... 6-10 tasks for Phase 3
      ]
    }
  ],
  "overallTotalHours": "string - must equal sum of phase hours",
  "techStack": ["Technology1", "Technology2", ...]
}

IMPORTANT REMINDERS:
- Generate AT LEAST 22 total tasks across all phases (aim for 25-35)
- Each task should be detailed enough to understand the deliverable
- Include specific tools, frameworks, and technologies in task descriptions
- Make tasks actionable and measurable
- Hours should add up correctly across all tasks and phases
- The overallTotalHours MUST match the total hours specified in the user prompt EXACTLY
- Write naturally - NO AI-sounding language

Return ONLY valid JSON. No markdown, no code blocks, just pure JSON.`;
}

/**
 * Extracts the requested hours from the user query
 * Looks for patterns like "20 hours", "20hrs", "for 20 hours", etc.
 * @param {string} query - User's project requirements
 * @returns {number|null} Extracted hours or null if not found
 */
function extractHoursFromQuery(query) {
  // Patterns to match: "20 hours", "20hrs", "20 hrs", "for 20 hours", "20h", etc.
  const patterns = [
    /(\d+)\s*hours?/i,           // "20 hours" or "20 hour"
    /(\d+)\s*hrs?/i,             // "20hrs" or "20hr" or "20 hrs"
    /(\d+)\s*h\b/i,              // "20h" (standalone)
    /for\s+(\d+)\s*hours?/i,     // "for 20 hours"
    /for\s+(\d+)\s*hrs?/i,       // "for 20hrs"
    /total\s+(\d+)\s*hours?/i,   // "total 20 hours"
    /total\s+(\d+)\s*hrs?/i,     // "total 20hrs"
    /(\d+)\s*hours?\s+total/i,   // "20 hours total"
    /(\d+)\s*hrs?\s+total/i       // "20hrs total"
  ];

  for (const pattern of patterns) {
    const match = query.match(pattern);
    if (match) {
      const hours = parseInt(match[1], 10);
      if (hours > 0 && hours <= 1000) { // Reasonable range
        return hours;
      }
    }
  }

  return null;
}

/**
 * Builds the user prompt with the query requirements
 * @param {string} query - User's project requirements
 * @returns {string} User prompt
 */
export function buildUserPrompt(query) {
  const requestedHours = extractHoursFromQuery(query);
  const totalHours = requestedHours || 40; // Default to 40 if not specified
  
  // Calculate phase hours based on percentages
  const phase1Hours = Math.round(totalHours * 0.65); // 60-70% -> 65%
  const phase2Hours = Math.round(totalHours * 0.20); // 15-25% -> 20%
  const phase3Hours = totalHours - phase1Hours - phase2Hours; // Remaining

  return `Generate a COMPREHENSIVE and DETAILED project breakdown for:

${query}

CRITICAL REQUIREMENTS - MUST FOLLOW EXACTLY:
- TOTAL HOURS: ${totalHours} hours (this is MANDATORY - the sum of all phase hours MUST equal ${totalHours})
- Phase 1 total hours: approximately ${phase1Hours} hours (60-70% of total)
- Phase 2 total hours: approximately ${phase2Hours} hours (15-25% of total)
- Phase 3 total hours: approximately ${phase3Hours} hours (10-20% of total)
- Generate 10-15 tasks for Phase 1
- Generate 6-10 tasks for Phase 2  
- Generate 6-10 tasks for Phase 3
- Total: 22-35 tasks minimum
- Each task: detailed description with technologies mentioned
- Each task: 2-8 hours
- The overallTotalHours field MUST be exactly "${totalHours}"
- Make it comprehensive enough to fill 3-4 pages

Extract all technologies mentioned and list in techStack array.

Return structured JSON only.`;
}