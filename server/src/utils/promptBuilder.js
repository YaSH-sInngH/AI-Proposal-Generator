/**
 * Builds system and user prompts for OpenAI API
 */

/**
 * Builds the system prompt that instructs the LLM on how to generate proposals
 * @returns {string} System prompt
 */
export function buildSystemPrompt() {
  return `You are a professional technical proposal writer.
Generate a complete, structured, polished proposal document.
Follow the provided JSON schema strictly.
Do not add extra fields.
Do not mention AI.
Avoid generic filler phrases.
Use clear and professional consulting language.

IMPORTANT RULES:
- Write naturally and professionally
- Never mention AI, artificial intelligence, or machine learning
- Never use placeholders like [PLACEHOLDER] or TODO
- Always write complete, polished statements
- If no duration is specified by the user, default to 40 hours total
- Distribute hours across the three phases logically
- Make tasks specific and actionable
- Use professional consulting language

JSON SCHEMA (you must follow this exactly):
{
  "projectTitle": "string - The project title",
  "overview": "string - A comprehensive overview paragraph",
  "phases": [
    {
      "name": "Phase 1 — Core Development",
      "totalHours": "string - number as string (e.g., '15')",
      "tasks": ["string", "string", ...]
    },
    {
      "name": "Phase 2 — Deployment & Infrastructure",
      "totalHours": "string - number as string (e.g., '12')",
      "tasks": ["string", "string", ...]
    },
    {
      "name": "Phase 3 — Testing & Frontend Integration",
      "totalHours": "string - number as string (e.g., '13')",
      "tasks": ["string", "string", ...]
    }
  ],
  "overallTotalHours": "string - sum of all phase hours as string"
}

Return ONLY valid JSON. No markdown, no explanations, just the JSON object.`;
}

/**
 * Builds the user prompt with the query requirements
 * @param {string} query - User's project requirements
 * @returns {string} User prompt
 */
export function buildUserPrompt(query) {
  return `User Requirements:
${query}

If no duration is specified, default to 40 hours total.

Return structured JSON only following the exact schema provided.`;
}
