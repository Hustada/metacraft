import { Theme } from '@mui/material/styles';

export interface PreviewTheme {
  name: string;
  description: string;
  styles: {
    container: React.CSSProperties;
    component: React.CSSProperties;
  };
  theme: Partial<Theme>;
}

export const previewThemes: PreviewTheme[] = [
  {
    name: 'Modern Light',
    description: 'Clean, minimal design with subtle shadows',
    styles: {
      container: {
        backgroundColor: '#ffffff',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
      component: {
        fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
        color: '#1a1a1a',
      },
    },
    theme: {
      palette: {
        primary: {
          main: '#2563eb',
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
    description: 'Sleek dark theme with high contrast',
    styles: {
      container: {
        backgroundColor: '#1a1a1a',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
      },
      component: {
        fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
        color: '#ffffff',
      },
    },
    theme: {
      palette: {
        mode: 'dark',
        primary: {
          main: '#60a5fa',
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
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
      },
      component: {
        fontFamily: '"Poppins", sans-serif',
        color: '#ffffff',
      },
    },
    theme: {
      palette: {
        primary: {
          main: '#ff6b6b',
        },
        secondary: {
          main: '#4ecdc4',
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
        padding: '2rem',
        border: '1px solid #eaeaea',
        borderRadius: '4px',
      },
      component: {
        fontFamily: '"SF Mono", "Roboto Mono", monospace',
        color: '#333333',
      },
    },
    theme: {
      palette: {
        primary: {
          main: '#000000',
        },
        background: {
          default: '#ffffff',
          paper: '#fafafa',
        },
      },
    },
  },
];
