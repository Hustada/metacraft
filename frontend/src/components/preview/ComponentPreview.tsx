import React, { useState } from 'react';
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
} from '@mui/material';
import { PreviewTheme, previewThemes } from './previewThemes';

interface ComponentPreviewProps {
  componentCode: string;
}

const ComponentPreview: React.FC<ComponentPreviewProps> = ({ componentCode }) => {
  const [selectedTheme, setSelectedTheme] = useState<PreviewTheme>(previewThemes[0]);
  const baseTheme = useTheme();

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

  // Create a static preview of the component structure
  const renderPreview = () => {
    return (
      <Box sx={selectedTheme.styles.container}>
        <Box sx={{ ...selectedTheme.styles.component, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Header Component
          </Typography>
          <Paper elevation={1} sx={{ p: 2 }}>
            <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 'bold' }}>Example Site</div>
              <ul style={{ display: 'flex', gap: '1rem', listStyle: 'none', margin: 0, padding: 0 }}>
                <li>Home</li>
                <li>About</li>
                <li>Contact</li>
              </ul>
            </nav>
          </Paper>
        </Box>
        
        <Box sx={selectedTheme.styles.component}>
          <Typography variant="h6" gutterBottom>
            Main Component
          </Typography>
          <Paper elevation={1} sx={{ p: 2 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h4" gutterBottom>
                Welcome to our site
              </Typography>
              <Typography>
                This is a beautiful hero section with engaging content.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Paper elevation={2} sx={{ p: 2, maxWidth: 300 }}>
                <Typography variant="h6" gutterBottom>
                  Feature 1
                </Typography>
                <Typography>
                  Amazing feature description
                </Typography>
              </Paper>
            </Box>
          </Paper>
        </Box>
      </Box>
    );
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

      <Box sx={{ 
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        overflow: 'hidden',
        minHeight: '200px'
      }}>
        <ThemeProvider theme={previewTheme}>
          {renderPreview()}
        </ThemeProvider>
      </Box>
    </Paper>
  );
};

export default ComponentPreview;
