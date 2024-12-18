export interface ScrapedContent {
  url: string;
  title: string;
  meta: Record<string, string>;
  layout: {
    header: ContentComponent;
    navigation: NavigationComponent;
    main_content: ContentComponent;
    sidebar: ContentComponent;
    footer: ContentComponent;
    sections: ContentComponent[];
  };
  styles: StyleInfo[];
  scripts: ScriptInfo[];
  images: ImageInfo[];
  fonts: string[];
  colors: string[];
}

interface ContentComponent {
  exists: boolean;
  content?: {
    tag: string;
    classes: string[];
    id: string;
    text_content: string;
    children: number;
  };
}

interface NavigationComponent {
  exists: boolean;
  items?: Array<{
    text: string;
    href: string;
  }>;
}

interface StyleInfo {
  type: 'external' | 'internal';
  href?: string;
  content?: string;
}

interface ScriptInfo {
  type: 'external' | 'internal';
  src?: string;
  content?: string;
}

interface ImageInfo {
  src: string;
  alt: string;
  width: string;
  height: string;
}

export interface AnalysisResponse {
  analysis: string;
  structure: string;
  code_snippets: string;
}

export interface CodeSnippets {
  html: string;
  css: string;
  javascript: string;
  dependencies: string;
}

export interface ApiResponse {
  scraped_content: ScrapedContent;
  analysis: AnalysisResponse;
  code_snippets: CodeSnippets;
}
