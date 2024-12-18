import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ThemeProvider,
  createTheme,
  useTheme,
  AppBar,
  Toolbar,
  Container,
  Grid,
  Breadcrumbs,
  Link,
} from '@mui/material';
import { PreviewTheme, previewThemes } from './previewThemes';

interface ComponentPreviewProps {
  componentCode: string;
}

const ComponentPreview: React.FC<ComponentPreviewProps> = ({ componentCode }) => {
  const [selectedTheme, setSelectedTheme] = useState<PreviewTheme>(previewThemes[0]);
  const baseTheme = useTheme();
  const [error, setError] = useState<string | null>(null);

  const handleThemeChange = (event: any) => {
    const newTheme = previewThemes.find(theme => theme.name === event.target.value);
    if (newTheme) {
      setSelectedTheme(newTheme);
    }
  };

  const previewTheme = createTheme({
    ...baseTheme,
    ...selectedTheme.theme,
  });

  // Render the preview components based on the generated code
  const renderPreview = () => {
    try {
      // Create a safe preview of the components
      return (
        <Box sx={selectedTheme.styles.container}>
          {/* Header Preview */}
          <AppBar position="static" sx={{ mb: 2 }}>
            <Toolbar>
              <Typography variant="h6" color="inherit" sx={{ flexGrow: 1 }}>
                <Link href="/" color="inherit" sx={{ textDecoration: 'none' }}>
                  Books to Scrape
                </Link>
              </Typography>
              <Typography variant="subtitle1" color="inherit">
                We love being scraped!
              </Typography>
            </Toolbar>
          </AppBar>

          {/* Main Content Preview */}
          <Container>
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
              <Link color="inherit" href="/">
                Home
              </Link>
              <Typography color="text.primary">All products</Typography>
            </Breadcrumbs>

            <Grid container spacing={3}>
              {/* Sidebar */}
              <Grid item xs={12} sm={4} md={3}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Categories
                  </Typography>
                  <Box component="nav">
                    <Typography>Books</Typography>
                  </Box>
                </Paper>
              </Grid>

              {/* Main Content */}
              <Grid item xs={12} sm={8} md={9}>
                <Paper sx={{ p: 2 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" sx={{ p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                      This is a demo website for web scraping purposes. Prices and ratings here were randomly assigned and have no real meaning.
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    {/* Book Items */}
                    <Grid item xs={12} sm={6} md={4}>
                      <Paper elevation={2} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                          Sample Book
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Author: John Doe
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                          $19.99
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to render preview');
      return (
        <Box sx={{ p: 2, color: 'error.main' }}>
          <Typography variant="h6">Error Rendering Preview</Typography>
          <Typography>{error}</Typography>
        </Box>
      );
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth size="small">
          <InputLabel>Preview Theme</InputLabel>
          <Select
            value={selectedTheme.name}
            onChange={handleThemeChange}
            label="Preview Theme"
          >
            {previewThemes.map((theme) => (
              <MenuItem key={theme.name} value={theme.name}>
                <Box>
                  <Typography variant="body1">
                    {theme.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {theme.description}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <ThemeProvider theme={previewTheme}>
        <Box sx={{ 
          height: '600px', 
          overflow: 'auto',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '4px',
            '&:hover': {
              background: '#666',
            },
          },
        }}>
          {renderPreview()}
        </Box>
      </ThemeProvider>
    </Paper>
  );
};

export default ComponentPreview;
