import os
import json
from typing import Dict, Any
from openai import OpenAI
from dotenv import load_dotenv
import logging

logger = logging.getLogger(__name__)

class ContentAnalyzer:
    def __init__(self):
        load_dotenv()
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OpenAI API key not found in environment variables")
        self.client = OpenAI(api_key=api_key)

    def analyze_content(self, content: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze the scraped content and provide insights for recreation
        """
        try:
            # Convert the content dictionary to a formatted string
            content_str = json.dumps(content, indent=2)
            
            prompt = f"""
Analyze this website structure and provide detailed recommendations for recreation.
Focus on layout, styling, and functionality.

Website Content:
{content_str}

Please provide a comprehensive analysis in JSON format with the following structure:
{{
    "layout_analysis": {{
        "structure": "Description of the overall layout structure",
        "components": ["List of main components identified"],
        "grid_system": "Suggested grid system for recreation",
        "responsive_design": "Notes on responsive design approach"
    }},
    "styling_recommendations": {{
        "color_scheme": ["List of primary and secondary colors"],
        "typography": {{
            "fonts": ["Recommended fonts"],
            "sizes": "Sizing hierarchy recommendations"
        }},
        "spacing": "Recommendations for margins and padding",
        "animations": ["List of suggested animations and transitions"]
    }},
    "technical_recommendations": {{
        "framework": "Recommended frontend framework",
        "libraries": ["List of suggested libraries"],
        "performance_optimization": ["List of optimization suggestions"],
        "accessibility": ["List of accessibility considerations"]
    }},
    "recreation_steps": [
        "Ordered list of steps to recreate the website"
    ]
}}
"""

            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert web developer specializing in analyzing and recreating websites. Provide detailed, actionable insights for website recreation."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                response_format={ "type": "json_object" }
            )
            
            analysis = response.choices[0].message.content
            
            # Verify the response is valid JSON
            try:
                analysis_dict = json.loads(analysis)
                return analysis_dict
            except json.JSONDecodeError:
                logger.error("Failed to parse AI response as JSON")
                raise
                
        except Exception as e:
            logger.error(f"Error analyzing content: {str(e)}")
            raise

    def generate_code_snippets(self, analysis: Dict[str, Any]) -> Dict[str, str]:
        """
        Generate code snippets based on the analysis
        """
        try:
            prompt = f"""
Based on this website analysis, generate the core code snippets needed for recreation.
Include HTML structure, CSS styling, and any necessary JavaScript.

Analysis:
{json.dumps(analysis, indent=2)}

Generate code snippets in the following format:
{{
    "html": "Core HTML structure",
    "css": "Main CSS styles",
    "javascript": "Required JavaScript code",
    "dependencies": "List of required dependencies"
}}
"""

            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert web developer. Generate clean, modern, and efficient code snippets for website recreation."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                response_format={ "type": "json_object" }
            )
            
            snippets = response.choices[0].message.content
            
            try:
                snippets_dict = json.loads(snippets)
                return snippets_dict
            except json.JSONDecodeError:
                logger.error("Failed to parse AI response as JSON")
                raise
                
        except Exception as e:
            logger.error(f"Error generating code snippets: {str(e)}")
            raise
