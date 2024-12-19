import { Theme } from '@mui/material/styles';

// Base styles that apply to all previews
export const baseStyles = (theme: Theme) => ({
  root: {
    width: '100%',
    height: '100%',
    overflow: 'auto',
  },
  typography: {
    '& h1': {
      fontSize: '2rem',
      fontWeight: 600,
      marginBottom: theme.spacing(2),
    },
    '& h2': {
      fontSize: '1.75rem',
      fontWeight: 500,
      marginBottom: theme.spacing(2),
    },
    '& h3': {
      fontSize: '1.5rem',
      fontWeight: 500,
      marginBottom: theme.spacing(1.5),
    },
    '& p': {
      marginBottom: theme.spacing(2),
      lineHeight: 1.6,
    },
  },
  media: {
    '& img': {
      maxWidth: '100%',
      height: 'auto',
      display: 'block',
      margin: `${theme.spacing(2)} 0`,
    },
    '& video': {
      maxWidth: '100%',
      height: 'auto',
    },
  },
  links: {
    '& a': {
      color: theme.palette.primary.main,
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  },
});

// E-commerce specific styles
export const ecommerceStyles = (theme: Theme) => ({
  ...baseStyles(theme),
  products: {
    '& .product-grid': {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: theme.spacing(3),
    },
    '& .product-card': {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      '& img': {
        aspectRatio: '1',
        objectFit: 'cover',
      },
    },
    '& .price': {
      color: theme.palette.success.main,
      fontWeight: 600,
    },
  },
});

// Blog/Article specific styles
export const blogStyles = (theme: Theme) => ({
  ...baseStyles(theme),
  article: {
    maxWidth: '800px',
    margin: '0 auto',
    '& img': {
      borderRadius: theme.shape.borderRadius,
    },
    '& blockquote': {
      borderLeft: `4px solid ${theme.palette.primary.main}`,
      margin: theme.spacing(2, 0),
      padding: theme.spacing(1, 2),
      backgroundColor: theme.palette.background.paper,
    },
  },
});

// Dashboard/Admin specific styles
export const dashboardStyles = (theme: Theme) => ({
  ...baseStyles(theme),
  dashboard: {
    '& .widget': {
      padding: theme.spacing(2),
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[1],
    },
    '& .stats': {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: theme.spacing(2),
    },
  },
});

// Social media specific styles
export const socialStyles = (theme: Theme) => ({
  ...baseStyles(theme),
  social: {
    '& .post': {
      marginBottom: theme.spacing(3),
      padding: theme.spacing(2),
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[1],
    },
    '& .user-avatar': {
      width: 40,
      height: 40,
      borderRadius: '50%',
    },
    '& .engagement': {
      display: 'flex',
      gap: theme.spacing(2),
      marginTop: theme.spacing(1),
      color: theme.palette.text.secondary,
    },
  },
});

// Documentation/Wiki specific styles
export const documentationStyles = (theme: Theme) => ({
  ...baseStyles(theme),
  docs: {
    '& .sidebar': {
      width: 240,
      flexShrink: 0,
      borderRight: `1px solid ${theme.palette.divider}`,
    },
    '& .content': {
      flex: 1,
      padding: theme.spacing(3),
    },
    '& code': {
      backgroundColor: theme.palette.grey[100],
      padding: theme.spacing(0.5, 1),
      borderRadius: theme.shape.borderRadius,
      fontFamily: 'monospace',
    },
  },
});
