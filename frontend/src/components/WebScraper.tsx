import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Snackbar,
  Alert,
  CircularProgress,
  LinearProgress,
  Tooltip,
  IconButton,
  Switch,
  FormControl,
  FormControlLabel,
  Stack,
  Select,
  MenuItem,
  InputLabel,
  Card,
  CardContent,
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LinkIcon from '@mui/icons-material/Link';
import LaunchIcon from '@mui/icons-material/Launch';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import ClearIcon from '@mui/icons-material/Clear';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';

interface ExtractedData {
  metadata: {
    title?: string;
    description?: string;
    keywords?: string;
    author?: string;
    publishDate?: string;
    categories?: string[];
  };
  content: {
    summary: string;
    paragraphs: string[];
  };
  links: {
    internal: { text: string; url: string }[];
    external: { text: string; url: string }[];
  };
  images: {
    type: string;
    text: string;
  }[];
  products?: {
    sku?: string;
    title: string;
    price?: number;
    description?: string;
  }[];
}

const LoadingMessages = [
  "Analyzing webpage content...",
  "Extracting key information...",
  "Processing metadata...",
  "Identifying main topics...",
  "Evaluating content structure...",
  "Analyzing semantic relationships...",
  "Generating insights...",
  "Finalizing analysis..."
];

export const WebScraper = () => {
  const [url, setUrl] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt4');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [loadingMessage, setLoadingMessage] = useState(LoadingMessages[0]);
  const [isTestMode, setIsTestMode] = useState(true);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingMessage(LoadingMessages[Math.floor(Math.random() * LoadingMessages.length)]);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const mockResponse = {
    content: {
      summary: "This is a test page for web scraping analysis.",
      paragraphs: [
        "This is a test page designed to help verify web scraping functionality. It contains various elements that a typical webpage might have, including text content, links, and structured data.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
      ]
    },
    metadata: {
      title: "Test Page for Web Scraping",
      description: "Test page for web scraping analysis",
      keywords: "test, web scraping, analysis",
      author: "Test Author"
    },
    links: {
      internal: [
        { text: "About", url: "/about" },
        { text: "Products", url: "/products" },
        { text: "Contact", url: "/contact" }
      ],
      external: [
        { text: "External Resource 1", url: "https://example.com/resource1" },
        { text: "External Resource 2", url: "https://example.com/resource2" },
        { text: "External Resource 3", url: "https://example.com/resource3" }
      ]
    },
    images: [
      { type: "image", text: "Test Image 1" },
      { type: "image", text: "Test Image 2" }
    ],
    products: [
      {
        title: "Product 1",
        price: 99.99,
        sku: "TEST001",
        description: "This is a test product with various features and specifications."
      },
      {
        title: "Product 2",
        price: 149.99,
        sku: "TEST002",
        description: "Another test product with different specifications and features."
      }
    ]
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
        setSnackbarMessage('URL pasted from clipboard');
        setSnackbarOpen(true);
      }
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  const handleClear = () => {
    setUrl('');
    setError(null);
    setExtractedData(null);
    setSnackbarMessage('Page cleared');
    setSnackbarOpen(true);
  };

  const handleAnalyze = async () => {
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    setIsLoading(true);
    setError(null);
    console.log('Sending request with:', { url, modelId: selectedModel });

    try {
      if (isTestMode) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        setExtractedData(mockResponse);
      } else {
        const response = await fetch('http://localhost:3001/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url, modelId: selectedModel }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setExtractedData({
          ...data,
          images: data.images || [], // Ensure images property exists
        });
      }
    } catch (err) {
      console.log('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isTestMode}
                      onChange={(e) => setIsTestMode(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Test Mode"
                />
              </Box>
              <Box sx={{ mb: 3 }}>
                <Typography 
                  variant="h4" 
                  gutterBottom 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    color: 'primary.main',
                    fontWeight: 600,
                    letterSpacing: '-0.5px'
                  }}
                >
                  Content & Sentiment Analyzer
                  <Tooltip title="Enter a URL to analyze its content, sentiment, readability, and more using advanced AI models.">
                    <IconButton size="small">
                      <HelpOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Typography>
                <Typography 
                  color="text.secondary" 
                  variant="subtitle1" 
                  gutterBottom
                  sx={{ 
                    letterSpacing: '0.1px',
                    fontWeight: 400
                  }}
                >
                  Deep analysis of web content using AI - extract data, understand sentiment, and assess readability
                </Typography>

                {/* Model Selection */}
                <Box sx={{ mt: 3, mb: 4 }}>
                  <Stack spacing={2}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel id="model-select-label">AI Model</InputLabel>
                      <Select
                        labelId="model-select-label"
                        id="model-select"
                        value={selectedModel || ''}
                        label="AI Model"
                        onChange={(e) => setSelectedModel(e.target.value)}
                      >
                        <MenuItem value="gpt4">GPT-4 Turbo</MenuItem>
                        <MenuItem value="gpt3">GPT-3.5 Turbo</MenuItem>
                      </Select>
                    </FormControl>

                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: { xs: 'column', sm: 'row' },
                      gap: 2
                    }}>
                      <TextField
                        fullWidth
                        label="Enter URL"
                        variant="outlined"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        disabled={isLoading}
                        placeholder="https://example.com"
                        type="url"
                        InputProps={{
                          endAdornment: (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Tooltip title="Clear page">
                                <IconButton
                                  onClick={handleClear}
                                  disabled={isLoading}
                                  size="small"
                                  sx={{ 
                                    opacity: (!url && !extractedData) ? 0.3 : 1,
                                    transition: 'opacity 0.2s'
                                  }}
                                >
                                  <ClearIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Paste URL from clipboard">
                                <IconButton 
                                  onClick={handlePaste}
                                  disabled={isLoading}
                                  size="small"
                                  sx={{ mr: 1 }}
                                >
                                  <ContentPasteIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          ),
                        }}
                        sx={{
                          '& .MuiInputLabel-root': {
                            transform: 'translate(14px, 12px) scale(1)'
                          },
                          '& .MuiInputLabel-shrink': {
                            transform: 'translate(14px, -9px) scale(0.75)'
                          },
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: 'rgba(0, 0, 0, 0.23)',
                            },
                            '&:hover fieldset': {
                              borderColor: 'rgba(0, 0, 0, 0.23)',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: 'primary.main',
                            },
                          },
                        }}
                      />
                      <Button
                        variant="contained"
                        onClick={handleAnalyze}
                        disabled={!url || isLoading || !selectedModel}
                        sx={{ 
                          minWidth: 120,
                          width: { xs: '100%', sm: 'auto' },
                          height: 56,
                          position: 'relative',
                          bgcolor: 'primary.main',
                          fontWeight: 500,
                          letterSpacing: '0.5px',
                          '&:hover': {
                            bgcolor: 'primary.dark',
                          }
                        }}
                      >
                        {isLoading ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          'Extract Data'
                        )}
                      </Button>
                    </Box>
                  </Stack>
                </Box>
              </Box>

              {isLoading && (
                <LinearProgress 
                  sx={{ 
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0
                  }}
                />
              )}

              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 2,
                    '& .MuiAlert-message': {
                      width: '100%'
                    }
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Error analyzing URL
                  </Typography>
                  <Typography variant="body2" color="error">
                    {error}
                  </Typography>
                </Alert>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Page Summary */}
        {extractedData?.metadata && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography 
                variant="h5" 
                gutterBottom
                sx={{ 
                  color: 'primary.main',
                  fontWeight: 600,
                  letterSpacing: '-0.5px',
                  mb: 3
                }}
              >
                Page Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography 
                        variant="h6" 
                        gutterBottom 
                        sx={{ 
                          color: 'primary.main',
                          fontWeight: 600,
                          letterSpacing: '-0.5px'
                        }}
                      >
                        Overview
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {extractedData.metadata.title}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography 
                        variant="h6" 
                        gutterBottom 
                        sx={{ 
                          color: 'primary.main',
                          fontWeight: 600,
                          letterSpacing: '-0.5px'
                        }}
                      >
                        Key Insights
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {extractedData.metadata.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {extractedData.metadata.keywords && (
                      <Chip 
                        label={`Keywords: ${extractedData.metadata.keywords}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ borderWidth: 2 }}
                      />
                    )}
                    {extractedData.metadata.author && (
                      <Chip 
                        label={`Author: ${extractedData.metadata.author}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ borderWidth: 2 }}
                      />
                    )}
                    {extractedData.metadata.publishDate && (
                      <Chip 
                        label={`Published: ${new Date(extractedData.metadata.publishDate).toLocaleString()}`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        )}

        {/* Extracted Data */}
        <Grid item xs={12}>
          <Paper 
            sx={{ 
              p: 3,
              minHeight: 400,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {extractedData && (
              <Box sx={{ p: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Typography variant="h5" gutterBottom>
                          Content Summary
                        </Typography>
                        <Typography variant="body1">
                          {extractedData.content.summary}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Typography variant="h5" gutterBottom>
                          Detailed Content
                        </Typography>
                        {extractedData.content.paragraphs?.map((paragraph, index) => (
                          <Typography key={index} variant="body1">
                            {paragraph}
                          </Typography>
                        ))}
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}
            {isLoading && (
              <Box 
                sx={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                  bgcolor: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(4px)',
                  zIndex: 1
                }}
              >
                <CircularProgress size={40} />
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.primary',
                    fontWeight: 500,
                    textAlign: 'center',
                    maxWidth: '80%',
                    animation: 'fadeInOut 2s infinite',
                    '@keyframes fadeInOut': {
                      '0%': { opacity: 0.5 },
                      '50%': { opacity: 1 },
                      '100%': { opacity: 0.5 },
                    },
                  }}
                >
                  {loadingMessage}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {extractedData && !isLoading && (
          <Grid item xs={12}>
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" gutterBottom>Analysis Results</Typography>
              
              {/* Metadata Section */}
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Paper elevation={3} sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {/* Metadata Chips */}
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {extractedData.metadata.keywords && (
                          <Chip 
                            label={`Keywords: ${extractedData.metadata.keywords}`}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ borderWidth: 2 }}
                          />
                        )}
                        {extractedData.metadata.author && (
                          <Chip 
                            label={`Author: ${extractedData.metadata.author}`}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ borderWidth: 2 }}
                          />
                        )}
                        {extractedData.metadata.publishDate && (
                          <Chip 
                            label={`Published: ${new Date(extractedData.metadata.publishDate).toLocaleString()}`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                      
                      {/* Links Section */}
                      <Box>
                        <Typography variant="subtitle1" gutterBottom>Links Found:</Typography>
                        <Grid container spacing={2}>
                          {/* Internal Links */}
                          {extractedData.links.internal.length > 0 && (
                            <Grid item xs={12} md={6}>
                              <List dense>
                                <ListItem>
                                  <ListItemIcon>
                                    <LinkIcon color="primary" />
                                  </ListItemIcon>
                                  <ListItemText 
                                    primary="Internal Links"
                                    secondary={`${extractedData.links.internal.length} found`}
                                  />
                                </ListItem>
                              </List>
                            </Grid>
                          )}
                          
                          {/* External Links */}
                          {extractedData.links.external.length > 0 && (
                            <Grid item xs={12} md={6}>
                              <List dense>
                                <ListItem>
                                  <ListItemIcon>
                                    <LaunchIcon color="primary" />
                                  </ListItemIcon>
                                  <ListItemText 
                                    primary="External Links"
                                    secondary={`${extractedData.links.external.length} found`}
                                  />
                                </ListItem>
                              </List>
                            </Grid>
                          )}
                        </Grid>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>

              {/* Analysis Cards Section */}
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {/* Language Analysis */}
                <Grid item xs={12} md={6}>
                  <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Typography variant="h6" gutterBottom>Language Analysis</Typography>
                      <Typography>Language: English</Typography>
                      <Typography>Confidence: High</Typography>
                    </Box>
                  </Paper>
                </Grid>

                {/* Sentiment Analysis */}
                <Grid item xs={12} md={6}>
                  <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Typography variant="h6" gutterBottom>Sentiment Analysis</Typography>
                      <Typography>Overall: Positive</Typography>
                      <Typography>Score: 80</Typography>
                      <Typography>Tone: Informative</Typography>
                    </Box>
                  </Paper>
                </Grid>

                {/* Readability Analysis */}
                <Grid item xs={12} md={6}>
                  <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Typography variant="h6" gutterBottom>Readability Analysis</Typography>
                      
                      <Tooltip title="The approximate U.S. grade level required to understand this text">
                        <Typography>
                          Grade Level: <strong>9</strong>
                        </Typography>
                      </Tooltip>
                      
                      <Typography variant="caption" color="text.secondary">
                        Grade levels: 1-6 (Elementary), 7-9 (Middle School), 10-12 (High School), 13+ (College)
                      </Typography>

                      <Box sx={{ mt: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Detailed Metrics:
                        </Typography>
                        <List dense>
                          <ListItem>
                            <ListItemIcon>
                              <FiberManualRecordIcon sx={{ fontSize: 8 }} />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Avg. Sentence Length"
                              secondary="15 words"
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <FiberManualRecordIcon sx={{ fontSize: 8 }} />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Complex Words"
                              secondary="20%"
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <FiberManualRecordIcon sx={{ fontSize: 8 }} />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Reading Ease Score"
                              secondary="60/100"
                            />
                          </ListItem>
                        </List>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>

                {/* SEO Analysis */}
                <Grid item xs={12} md={6}>
                  <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Typography variant="h6" gutterBottom>SEO Analysis</Typography>
                      <Typography>Score: 80/100</Typography>
                      
                      <Typography variant="subtitle1" sx={{ mt: 1 }}>Recommendations:</Typography>
                      <List dense>
                        <ListItem>
                          <ListItemIcon>
                            <CheckCircleIcon color="success" />
                          </ListItemIcon>
                          <ListItemText primary="Meta title and description are well-optimized" />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <CheckCircleIcon color="success" />
                          </ListItemIcon>
                          <ListItemText primary="Good keyword density" />
                        </ListItem>
                      </List>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        )}
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};
