from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from bs4 import BeautifulSoup
import requests
from openai import OpenAI
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)
load_dotenv()

client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

@app.route('/api/analyze', methods=['POST'])
def analyze():
    try:
        data = request.get_json()
        url = data.get('url')
        model_id = data.get('modelId')

        if not url:
            return jsonify({'error': 'URL is required'}), 400
        if not model_id:
            return jsonify({'error': 'Model ID is required'}), 400

        # Fetch webpage content
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html5lib')

        # Extract content
        titles = [{'type': tag.name, 'text': tag.get_text().strip()} 
                 for tag in soup.find_all(['h1', 'h2', 'h3']) if tag.get_text().strip()]
        
        paragraphs = [p.get_text().strip() 
                     for p in soup.find_all('p') if p.get_text().strip()]
        
        links = [{'text': a.get_text().strip(), 'url': a.get('href')} 
                for a in soup.find_all('a', href=True) 
                if a.get_text().strip() and a.get('href').startswith(('http', 'https'))]

        # Prepare content for analysis
        content_for_analysis = ' '.join(
            [t['text'] for t in titles] + 
            paragraphs[:3]  # Limit to first 3 paragraphs for analysis
        )

        # AI analysis prompt
        analysis_prompt = f"""Analyze this web content and provide a structured analysis:
Content: {content_for_analysis[:1500]}...

Provide analysis in this JSON structure:
{{
    "summary": {{
        "overview": "Brief overview of the content",
        "insights": ["Key insight 1", "Key insight 2", "Key insight 3"],
        "topics": ["Topic 1", "Topic 2"],
        "audience": "Target audience description",
        "contentType": "Article/Blog/News/etc"
    }},
    "analysis": {{
        "language": {{
            "code": "en",
            "name": "English",
            "confidence": "high/medium/low"
        }},
        "sentiment": {{
            "overall": "positive/negative/neutral",
            "score": 0.0,
            "analysis": {{
                "tone": "Professional/Casual/Technical/etc",
                "emotionalTriggers": ["trigger1", "trigger2"],
                "highlights": {{
                    "positive": ["positive point 1", "positive point 2"],
                    "negative": ["negative point 1", "negative point 2"]
                }}
            }}
        }},
        "readability": {{
            "score": 0,
            "gradeLevel": "College/High School/etc",
            "metrics": {{
                "averageSentenceLength": 0,
                "complexWordPercentage": 0,
                "readingEase": 0,
                "totalWords": 0,
                "totalSentences": 0
            }},
            "analysis": {{
                "complexity": "Simple/Moderate/Complex",
                "sentenceStructure": "Analysis of sentence structure",
                "wordChoice": "Analysis of word choices",
                "suggestions": ["suggestion1", "suggestion2"]
            }}
        }},
        "seo": {{
            "score": 0,
            "analysis": {{
                "titleTag": "Analysis of title tag",
                "metaDescription": "Analysis of meta description",
                "headingStructure": "Analysis of heading structure",
                "keywordUsage": "Analysis of keyword usage"
            }},
            "recommendations": ["recommendation1", "recommendation2"]
        }},
        "keywords": {{
            "primary": [
                {{"keyword": "word1", "frequency": 0, "density": "0%", "importance": "high/medium/low"}}
            ],
            "secondary": [
                {{"keyword": "word2", "frequency": 0, "density": "0%"}}
            ],
            "phrases": [
                {{"phrase": "common phrase", "frequency": 0}}
            ]
        }}
    }}
}}"""

        # Get AI response
        model = "gpt-4-1106-preview" if model_id == "gpt4" else "gpt-3.5-turbo-1106" if model_id == "gpt35" else "gpt-4-1106-preview"
        
        completion = client.chat.completions.create(
            model=model,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": "You are a web content analyzer. Analyze the content and provide structured insights."},
                {"role": "user", "content": analysis_prompt}
            ]
        )

        # Parse AI response
        ai_analysis = completion.choices[0].message.content

        # Combine all data
        result = {
            "titles": titles,
            "paragraphs": paragraphs,
            "links": links,
            **eval(ai_analysis),  # Convert string to dict
            "metadata": {
                "url": url,
                "analyzedAt": datetime.datetime.now().isoformat(),
                "model": model_id
            }
        }

        return jsonify(result)

    except requests.RequestException as e:
        return jsonify({'error': f'Failed to fetch URL: {str(e)}'}), 400
    except Exception as e:
        return jsonify({'error': f'Analysis failed: {str(e)}'}), 500

@app.route('/api/models', methods=['GET'])
def get_models():
    models = [
        {
            "id": "gpt4",
            "name": "GPT-4 Turbo",
            "provider": "OpenAI",
            "description": "Most capable model, best for complex analysis",
            "available": True
        },
        {
            "id": "gpt35",
            "name": "GPT-3.5 Turbo",
            "provider": "OpenAI",
            "description": "Fast and efficient for basic analysis",
            "available": True
        },
        {
            "id": "claude",
            "name": "Claude 3",
            "provider": "Anthropic",
            "description": "Advanced analysis with unique insights",
            "available": True
        }
    ]
    return jsonify(models)

if __name__ == '__main__':
    app.run(debug=True)
