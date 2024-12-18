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

export interface BasicAnalysis {
  title: string;
  linkCount: number;
  imageCount: number;
  headerCount: number;
  paragraphCount: number;
  divCount: number;
}

export interface ComponentProps {
  interface: string;
  description: Record<string, string>;
}

export interface ComponentStyling {
  theme: Record<string, any>;
  customization: string;
}

export interface Component {
  name: string;
  description: string;
  code: string;
  props: ComponentProps;
  styling: ComponentStyling;
  usage: string;
  accessibility: string;
  responsive: string;
}

export interface ThemeSystem {
  colors: Record<string, string>;
  spacing: Record<string, string | number>;
  typography: Record<string, any>;
  breakpoints: Record<string, string>;
}

export interface Implementation {
  setup: string;
  dependencies: string[];
  structure: string;
}

export interface AIAnalysis {
  components: Component[];
  themeSystem: ThemeSystem;
  implementation: Implementation;
}

export interface AnalysisResponse {
  basicAnalysis: BasicAnalysis;
  aiAnalysis: AIAnalysis;
  sampleHtml: string;
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
