from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import os
from dotenv import load_dotenv
import openai
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, origins=['*'])  # Allow all origins

@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        response.headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        return response

@app.route('/analyze', methods=['POST'])
def analyze_website():
    try:
        data = request.get_json()
        url = data.get('url')
        
        if not url:
            return jsonify({"error": "URL is required"}), 400

        # Make the request to the target website
        response = requests.get(url)
        response.raise_for_status()
        
        # Parse the HTML content
        soup = BeautifulSoup(response.text, 'html5lib')
        
        # Basic analysis results
        analysis_result = {
            "analysis": f"Website analysis for {url}:\n" + 
                       f"Title: {soup.title.string if soup.title else 'No title'}\n" +
                       f"Number of links: {len(soup.find_all('a'))}\n" +
                       f"Number of images: {len(soup.find_all('img'))}\n",
            "structure": f"Page Structure:\n" +
                        f"Headers: {len(soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']))}\n" +
                        f"Paragraphs: {len(soup.find_all('p'))}\n" +
                        f"Divs: {len(soup.find_all('div'))}\n",
            "code_snippets": "Sample HTML structure:\n" + str(soup.prettify()[:500]) + "..."
        }
        
        response = make_response(jsonify(analysis_result))
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
        
    except requests.RequestException as e:
        logger.error(f"Error fetching website: {str(e)}")
        return jsonify({"error": f"Error fetching website: {str(e)}"}), 500
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500

@app.route('/health', methods=['GET'])
def health_check():
    response = make_response(jsonify({"status": "healthy"}))
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

if __name__ == '__main__':
    app.run(debug=True)
