# Proposal Generator - Frontend

A modern, minimalist chat interface for the AI-powered Proposal Document Generator.

## Features

- 🎨 Dark theme with Electric Cyan accents
- 💬 ChatGPT/DeepSeek-style chat interface
- 📝 Centered input that moves below when chat starts
- 📄 Automatic file download for generated proposals
- ⚡ Smooth animations and transitions
- 📱 Fully responsive design

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure API URL (optional):**
   Create a `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
   If not set, defaults to `http://localhost:5000`

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## Usage

1. Enter your project requirements in the chat input
2. Press Enter or click the send button
3. Wait for the proposal to be generated
4. The `.docx` file will automatically download

## Project Structure

```
src/
  components/
    ChatInput.jsx      # Chat input component
    ChatInput.css      # Input styling
    Message.jsx        # Message display component
    Message.css        # Message styling
  services/
    api.js            # Backend API integration
  App.jsx              # Main application component
  App.css              # App styling
  index.css            # Global styles
  main.jsx             # Entry point
```

## Tech Stack

- React 19
- Vite
- CSS3 (Custom styling)

## API Integration

The frontend communicates with the backend API at `/generate-proposal` endpoint.

Make sure the backend server is running on the configured port (default: 5000).
