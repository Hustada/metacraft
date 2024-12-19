# AI-Powered Web Content Analyzer

A modern web application that extracts and analyzes content from any webpage using advanced AI models. Built with React, Node.js, and multiple AI providers including OpenAI and Anthropic.

![Web Content Analyzer Screenshot](screenshot.png)

## Features

- **Multi-Model Analysis**: Choose between different AI models:
  - GPT-4 Turbo
  - GPT-3.5 Turbo
  - Claude 3 Sonnet

- **Content Extraction**:
  - Page summaries and key insights
  - Main topics and target audience
  - Content structure (headings, paragraphs)
  - Important links and metadata
  - Product information (if available)

- **Modern UI/UX**:
  - Clean, minimalist design with burnt orange accents
  - Dark/Light mode support
  - Real-time loading feedback with humorous messages
  - Responsive layout for all devices

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- API keys for:
  - OpenAI
  - Anthropic

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd webscraper
```

2. Install dependencies for both frontend and backend:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:

Create `.env` files in both the backend and root directories:

Backend `.env`:
```env
PORT=3000
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
```

4. Start the development servers:

In the backend directory:
```bash
npm start
```

In the frontend directory:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
webscraper/
├── backend/
│   ├── server.js           # Express server setup
│   ├── services/
│   │   └── aiAnalyzer.js   # AI integration logic
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.tsx        # Main app component
│   │   └── main.tsx       # Entry point
│   └── package.json
└── README.md
```

## Usage

1. Start both the backend and frontend servers
2. Enter a URL in the input field
3. Select your preferred AI model
4. Click "Extract Data" to analyze the webpage
5. View the structured results including:
   - Page summary and key insights
   - Content analysis
   - Metadata and structure

## API Endpoints

- `POST /api/analyze`
  - Analyzes a webpage using the selected AI model
  - Body: `{ url: string, modelId: string }`
  - Returns structured content analysis

- `GET /api/models`
  - Returns available AI models and their status

## Environment Variables

Backend:
- `PORT`: Server port (default: 3000)
- `OPENAI_API_KEY`: OpenAI API key
- `ANTHROPIC_API_KEY`: Anthropic API key

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenAI for GPT models
- Anthropic for Claude models
- Material-UI for the component library
