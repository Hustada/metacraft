import { Theme, PaletteOptions } from '@mui/material/styles';

export interface PreviewTheme {
  name: string;
  description: string;
  styles: {
    container: Record<string, string>;
    component?: Record<string, string>;
  };
  theme: {
    palette?: PaletteOptions;
  };
}

export const previewThemes: PreviewTheme[] = [
  {
    name: 'Modern Light',
    description: 'Clean and minimal design with emphasis on readability',
    styles: {
      container: {
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        color: '#1a1a1a',
      },
      component: {
        fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
      },
    },
    theme: {
      palette: {
        primary: {
          main: '#2563eb',
          light: '#3b82f6',
          dark: '#1d4ed8',
          contrastText: '#ffffff'
        },
        background: {
          default: '#ffffff',
          paper: '#f8fafc',
        },
      },
    },
  },
  {
    name: 'Dark Mode',
    description: 'Dark theme for reduced eye strain',
    styles: {
      container: {
        backgroundColor: '#1a1a1a',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
        color: '#ffffff',
      },
      component: {
        fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
      },
    },
    theme: {
      palette: {
        mode: 'dark',
        primary: {
          main: '#60a5fa',
          light: '#93c5fd',
          dark: '#3b82f6',
          contrastText: '#000000'
        },
        background: {
          default: '#1a1a1a',
          paper: '#2d2d2d',
        },
      },
    },
  },
  {
    name: 'Colorful',
    description: 'Vibrant and playful design system',
    styles: {
      container: {
        background: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
        color: '#ffffff',
      },
      component: {
        fontFamily: '"Poppins", sans-serif',
      },
    },
    theme: {
      palette: {
        primary: {
          main: '#ff6b6b',
          light: '#ff99cc',
          dark: '#ff3b3f',
          contrastText: '#000000'
        },
        secondary: {
          main: '#4ecdc4',
          light: '#6fffd6',
          dark: '#34a85a',
          contrastText: '#000000'
        },
      },
    },
  },
  {
    name: 'Minimal',
    description: 'Ultra-minimal design with focus on content',
    styles: {
      container: {
        backgroundColor: '#fafafa',
        padding: '24px',
        border: '1px solid #eaeaea',
        borderRadius: '4px',
        color: '#333333',
      },
      component: {
        fontFamily: '"SF Mono", "Roboto Mono", monospace',
      },
    },
    theme: {
      palette: {
        primary: {
          main: '#000000',
          light: '#333333',
          dark: '#000000',
          contrastText: '#ffffff'
        },
        background: {
          default: '#ffffff',
          paper: '#fafafa',
        },
      },
    },
  },
];
