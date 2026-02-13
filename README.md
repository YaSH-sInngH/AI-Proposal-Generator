# Proposal Generator

AI-powered proposal document generator that creates professional DOCX proposals from natural language descriptions. Features a clean, minimal SaaS-style interface built with React and Tailwind CSS.

## Overview

This application allows users to describe their project requirements in plain English, and the AI generates a comprehensive, well-structured proposal document that can be downloaded as a Microsoft Word (.docx) file. The system uses OpenAI's API to understand project requirements and create professional proposals with proper formatting and structure.

## Features

- 🤖 **AI-Powered Generation**: Uses OpenAI to understand project requirements and generate comprehensive proposals
- 📄 **Professional Documents**: Creates properly formatted DOCX files ready for use
- 🎨 **Modern UI**: Clean, minimal interface inspired by Linear, Notion, and Vercel
- 💬 **Chat Interface**: Interactive conversation-style input for describing projects
- ⚡ **Fast & Responsive**: Built with Vite for lightning-fast development and builds
- 🎯 **Focused Design**: Minimal, enterprise-ready aesthetic with monochrome color palette

## Architecture

The project is split into two main parts:

- **Client** (`/client`): React frontend with Tailwind CSS for styling
- **Server** (`/server`): Express.js backend that handles AI processing and document generation

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd doc-proposal-generator
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../client
npm install
```

## Configuration

### Backend Environment Variables

Create a `.env` file in the `server` directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=5000
FRONTEND_URL=http://localhost:5173
```

**Required:**
- `OPENAI_API_KEY`: Your OpenAI API key (required for AI generation)

**Optional:**
- `PORT`: Server port (defaults to 5000)
- `FRONTEND_URL`: Frontend URL for CORS (defaults to localhost:5173)

### Frontend Configuration

The frontend automatically connects to `http://localhost:5000` by default. To change this, create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5000
```

## Running the Application

### Development Mode

**Terminal 1 - Start Backend:**
```bash
cd server
npm start
# or for auto-reload:
npm run dev
```

**Terminal 2 - Start Frontend:**
```bash
cd client
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend API at `http://localhost:5000`.

### Production Build

**Build Frontend:**
```bash
cd client
npm run build
```

The production build will be in the `client/dist` directory.

## Usage

1. **Start both servers** (backend and frontend)
2. **Open the application** in your browser at `http://localhost:5173`
3. **Describe your project** in the chat input field:
   - Example: "I need a proposal for a web development project to build an e-commerce platform with payment integration"
4. **Submit** by pressing Enter or clicking the send button
5. **Wait for generation** - The AI will process your request
6. **Download** - The proposal document will automatically download as a `.docx` file

## How It Works

1. **User Input**: User describes project requirements in the chat interface
2. **API Request**: Frontend sends the description to the backend API
3. **AI Processing**: Backend uses OpenAI to generate a structured proposal
4. **Document Creation**: The proposal is formatted into a DOCX document using the `docx` library
5. **File Delivery**: The document is sent back to the frontend and automatically downloaded

## Project Structure

```
doc-proposal-generator/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API integration
│   │   └── App.jsx         # Main app component
│   └── package.json
├── server/                 # Backend Express application
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic (OpenAI, DOCX)
│   │   ├── routes/         # API routes
│   │   └── server.js       # Server entry point
│   └── package.json
└── README.md
```

## Tech Stack

### Frontend
- **React 19**: Modern React with latest features
- **Vite**: Fast build tool and dev server
- **Tailwind CSS 3**: Utility-first CSS framework
- **PostCSS**: CSS processing with autoprefixer

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **OpenAI API**: AI text generation
- **docx**: DOCX document creation library
- **CORS**: Cross-origin resource sharing

## API Endpoints

- `POST /generate-proposal`: Generate a proposal document
  - Body: `{ "query": "project description" }`
  - Returns: DOCX file blob

- `GET /health`: Health check endpoint
  - Returns: `{ "status": "ok" }`

## Development

### Code Style

- ESLint is configured for both frontend and backend
- Follow React best practices and hooks rules
- Use Tailwind utility classes for styling

### Troubleshooting

**Tailwind CSS not loading:**
- Ensure PostCSS config is correct
- Restart the dev server
- Clear browser cache

**API connection errors:**
- Verify backend is running on port 5000
- Check CORS configuration
- Ensure `VITE_API_URL` matches backend URL

**OpenAI API errors:**
- Verify your API key is correct
- Check your OpenAI account has credits
- Review API rate limits

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
