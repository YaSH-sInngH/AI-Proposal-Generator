# AI Proposal Document Generator

A complete AI-powered Proposal Document Generator system that converts user requirements into professional .docx proposal documents.

## Tech Stack

- Node.js (ES Modules)
- Express.js
- OpenAI API (latest SDK)
- docx (for .docx file generation)
- dotenv

## Project Structure

```
src/
  controllers/
    proposal.controller.js
  services/
    openai.service.js
    docx.service.js
    template.service.js
  routes/
    proposal.routes.js
  utils/
    promptBuilder.js
  app.js
  server.js
```

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env` file:**
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=5000
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

## API Endpoints

### POST `/generate-proposal`

Generates a proposal document from user requirements.

**Request Body:**
```json
{
  "query": "Build a web application with user authentication and payment processing"
}
```

**Response:**
- Returns a `.docx` file download
- Content-Type: `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- Filename: `Project-Proposal.docx`

### GET `/health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "Proposal Generator API is running"
}
```

## Proposal Structure

The generated proposal follows this structure:

- **Project Title**
- **Overview**
- **Phase 1 — Core Development** (X hrs)
  - Task 1
  - Task 2
  - Task 3
- **Phase 2 — Deployment & Infrastructure** (X hrs)
  - Task 1
  - Task 2
- **Phase 3 — Testing & Frontend Integration** (X hrs)
  - Task 1
  - Task 2
- **Overall Total Hours — XX hrs**

## Features

- ✅ Natural, professional writing (no AI mentions)
- ✅ No placeholders or incomplete statements
- ✅ Default 40 hours if duration not specified
- ✅ Structured JSON output from OpenAI
- ✅ Professional .docx formatting
- ✅ Input validation
- ✅ Error handling

## Usage Example

```bash
curl -X POST http://localhost:5000/generate-proposal \
  -H "Content-Type: application/json" \
  -d '{"query": "Build a REST API with Node.js and Express for a task management system"}' \
  --output proposal.docx
```

## License

ISC
