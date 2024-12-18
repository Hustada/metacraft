import requests
from bs4 import BeautifulSoup
from typing import Dict, Any, List
import html5lib
from urllib.parse import urljoin, urlparse
import logging

logger = logging.getLogger(__name__)

class WebScraper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })

    def scrape(self, url: str) -> Dict[str, Any]:
        """
        Scrape a website and extract its structure and content
        """
        try:
            response = self.session.get(url)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html5lib')
            
            # Extract page structure
            structure = {
                'url': url,
                'title': self._get_title(soup),
                'meta': self._get_meta_tags(soup),
                'layout': self._analyze_layout(soup),
                'styles': self._extract_styles(soup),
                'scripts': self._extract_scripts(soup),
                'images': self._extract_images(soup, url),
                'fonts': self._extract_fonts(soup),
                'colors': self._extract_colors(soup)
            }
            
            return structure
            
        except Exception as e:
            logger.error(f"Error scraping {url}: {str(e)}")
            raise

    def _get_title(self, soup: BeautifulSoup) -> str:
        """Extract page title"""
        title_tag = soup.find('title')
        return title_tag.text if title_tag else ''

    def _get_meta_tags(self, soup: BeautifulSoup) -> Dict[str, str]:
        """Extract meta tags"""
        meta_tags = {}
        for tag in soup.find_all('meta'):
            name = tag.get('name', tag.get('property', ''))
            content = tag.get('content', '')
            if name and content:
                meta_tags[name] = content
        return meta_tags

    def _analyze_layout(self, soup: BeautifulSoup) -> Dict[str, Any]:
        """Analyze page layout structure"""
        layout = {
            'header': self._find_header(soup),
            'navigation': self._find_navigation(soup),
            'main_content': self._find_main_content(soup),
            'sidebar': self._find_sidebar(soup),
            'footer': self._find_footer(soup),
            'sections': self._find_sections(soup)
        }
        return layout

    def _find_header(self, soup: BeautifulSoup) -> Dict[str, Any]:
        """Find and analyze header section"""
        header = soup.find(['header', 'div[role="banner"]', '.header', '#header'])
        if header:
            return {
                'exists': True,
                'content': self._analyze_component(header)
            }
        return {'exists': False}

    def _find_navigation(self, soup: BeautifulSoup) -> Dict[str, Any]:
        """Find and analyze navigation"""
        nav = soup.find(['nav', 'div[role="navigation"]', '.nav', '#nav'])
        if nav:
            return {
                'exists': True,
                'items': [{'text': a.text.strip(), 'href': a.get('href', '')} 
                         for a in nav.find_all('a')]
            }
        return {'exists': False}

    def _find_main_content(self, soup: BeautifulSoup) -> Dict[str, Any]:
        """Find and analyze main content area"""
        main = soup.find(['main', 'div[role="main"]', '#main', '.main'])
        if main:
            return {
                'exists': True,
                'content': self._analyze_component(main)
            }
        return {'exists': False}

    def _analyze_component(self, element) -> Dict[str, Any]:
        """Analyze a component's structure"""
        return {
            'tag': element.name,
            'classes': element.get('class', []),
            'id': element.get('id', ''),
            'text_content': element.text.strip() if element.text else '',
            'children': len(list(element.children))
        }

    def _extract_styles(self, soup: BeautifulSoup) -> List[Dict[str, str]]:
        """Extract CSS styles"""
        styles = []
        for style in soup.find_all('link', rel='stylesheet'):
            href = style.get('href')
            if href:
                styles.append({
                    'type': 'external',
                    'href': href
                })
        for style in soup.find_all('style'):
            styles.append({
                'type': 'internal',
                'content': style.string if style.string else ''
            })
        return styles

    def _extract_scripts(self, soup: BeautifulSoup) -> List[Dict[str, str]]:
        """Extract JavaScript"""
        scripts = []
        for script in soup.find_all('script'):
            src = script.get('src')
            if src:
                scripts.append({
                    'type': 'external',
                    'src': src
                })
            elif script.string:
                scripts.append({
                    'type': 'internal',
                    'content': script.string
                })
        return scripts

    def _extract_images(self, soup: BeautifulSoup, base_url: str) -> List[Dict[str, str]]:
        """Extract images"""
        images = []
        for img in soup.find_all('img'):
            src = img.get('src', '')
            if src:
                full_url = urljoin(base_url, src)
                images.append({
                    'src': full_url,
                    'alt': img.get('alt', ''),
                    'width': img.get('width', ''),
                    'height': img.get('height', '')
                })
        return images

    def _extract_fonts(self, soup: BeautifulSoup) -> List[str]:
        """Extract font families"""
        fonts = set()
        for style in soup.find_all('style'):
            if style.string:
                # Basic font-family extraction - could be enhanced
                for line in style.string.split('\n'):
                    if 'font-family' in line:
                        fonts.add(line.split(':')[1].strip().strip(';'))
        return list(fonts)

    def _extract_colors(self, soup: BeautifulSoup) -> List[str]:
        """Extract colors used in the page"""
        colors = set()
        for style in soup.find_all('style'):
            if style.string:
                # Basic color extraction - could be enhanced
                for line in style.string.split('\n'):
                    if 'color:' in line or 'background-color:' in line:
                        color = line.split(':')[1].strip().strip(';')
                        colors.add(color)
        return list(colors)

    def _find_sidebar(self, soup: BeautifulSoup) -> Dict[str, Any]:
        """Find and analyze sidebar"""
        sidebar = soup.find(['aside', '.sidebar', '#sidebar'])
        if sidebar:
            return {
                'exists': True,
                'content': self._analyze_component(sidebar)
            }
        return {'exists': False}

    def _find_footer(self, soup: BeautifulSoup) -> Dict[str, Any]:
        """Find and analyze footer"""
        footer = soup.find(['footer', 'div[role="contentinfo"]', '.footer', '#footer'])
        if footer:
            return {
                'exists': True,
                'content': self._analyze_component(footer)
            }
        return {'exists': False}

    def _find_sections(self, soup: BeautifulSoup) -> List[Dict[str, Any]]:
        """Find and analyze main content sections"""
        sections = []
        for section in soup.find_all(['section', 'article', 'div[class*="section"]']):
            sections.append(self._analyze_component(section))
        return sections
