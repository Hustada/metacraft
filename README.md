# Website Analyzer and Recreation Tool

This tool analyzes websites and helps recreate them by providing detailed insights about their structure, styling, and functionality.

## Features

- Web scraping with comprehensive structure analysis
- AI-powered content analysis using OpenAI's GPT-4
- Code snippet generation for website recreation
- Detailed recommendations for layout, styling, and technical implementation

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the root directory and add your OpenAI API key:
```
OPENAI_API_KEY=your_api_key_here
```

## Running the Application

1. Start the backend server:
```bash
uvicorn backend.main:app --reload
```

2. The API will be available at `http://localhost:8000`

## API Endpoints

- `POST /analyze`: Analyze a website by providing its URL
- `GET /health`: Health check endpoint

## Example Usage

```bash
curl -X POST "http://localhost:8000/analyze" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://example.com"}'
```

## Project Structure

```
webscraper/
├── backend/
│   ├── __init__.py
│   ├── main.py           # FastAPI application
│   ├── scraper.py        # Web scraping logic
│   └── analyzer.py       # AI analysis and code generation
├── requirements.txt
└── README.md
```

## Contributing

1. Fork the repository
2. Create a new branch for your feature
3. Submit a pull request

## License

MIT License
