import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
  LinearProgress,
  Card,
  CardContent,
  Chip,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  IconButton,
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import ClearIcon from '@mui/icons-material/Clear';

interface Model {
  id: string;
  name: string;
  provider: string;
  description: string;
  available: boolean;
}

interface Analysis {
  language: {
    code: string;
    name: string;
    confidence: string;
  };
  sentiment: {
    overall: string;
    score: number;
    analysis: {
      tone: string;
      emotionalTriggers: string[];
      highlights: {
        positive: string[];
        negative: string[];
      };
    };
  };
  readability: {
    score: number;
    gradeLevel: string;
    metrics: {
      averageSentenceLength: number;
      complexWordPercentage: number;
      readingEase: number;
      totalWords: number;
      totalSentences: number;
    };
    analysis: {
      complexity: string;
      sentenceStructure: string;
      wordChoice: string;
      suggestions: string[];
    };
  };
  seo: {
    score: number;
    analysis: {
      titleTag: string;
      metaDescription: string;
      headingStructure: string;
      keywordUsage: string;
    };
    recommendations: string[];
  };
  keywords: {
    primary: Array<{
      keyword: string;
      frequency: number;
      density: string;
      importance: string;
    }>;
    secondary: Array<{
      keyword: string;
      frequency: number;
      density: string;
    }>;
    phrases: Array<{
      phrase: string;
      frequency: number;
    }>;
  };
}

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
    mainContent: string;
    sections: {
      heading?: string;
      content: string;
    }[];
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

interface AnalysisResponse {
  success: boolean;
  data?: ExtractedData;
  model?: string;
  error?: string;
}

const LoadingMessages = [
  "Initializing quantum neural pathways...",
  "Recalibrating hyperspace DOM traversal matrices...",
  "Engaging multi-threaded semantic analysis protocols...",
  "Optimizing non-linear content extraction algorithms...",
  "Synthesizing advanced heuristic parsing modules...",
  "Deploying recursive metacontent interpretation subroutines...",
  "Accelerating parallel sentiment quantification processes...",
  "Harmonizing cross-dimensional data extraction vectors...",
  "Bootstrapping advanced linguistic correlation engines...",
  "Activating neural-symbolic reasoning frameworks...",
  "Implementing quantum-entangled content analysis...",
  "Synchronizing temporal parsing manifolds...",
  "Calibrating semantic resonance frequencies...",
  "Engaging hyperdimensional context mapping...",
  "Initializing recursive metaphor detection arrays...",
  "Deploying advanced irony quantification matrices...",
  "Optimizing rhetorical pattern recognition algorithms...",
  "Synthesizing cross-cultural linguistic tensors...",
  "Reconfiguring semantic field harmonics...",
  "Activating quantum sentiment superposition states..."
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
  const [models, setModels] = useState<Record<string, Model>>({
    'gpt4': {
      id: 'gpt4',
      name: 'GPT-4 Turbo',
      provider: 'openai',
      description: 'Latest GPT-4 model with improved analysis capabilities',
      available: true
    },
    'gpt35': {
      id: 'gpt35',
      name: 'GPT-3.5 Turbo',
      provider: 'openai',
      description: 'Fast and efficient for basic content analysis',
      available: true
    },
    'claude': {
      id: 'claude',
      name: 'Claude 3 Opus',
      provider: 'anthropic',
      description: 'Advanced model with strong analytical capabilities',
      available: true
    }
  });

  useEffect(() => {
    // Fetch available models from the backend
    fetch('/api/models')
      .then(res => res.json())
      .then(data => setModels(data))
      .catch(err => console.error('Failed to fetch models:', err));
  }, []);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingMessage(LoadingMessages[Math.floor(Math.random() * LoadingMessages.length)]);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

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
    if (!url || !selectedModel) {
      setError('Please enter a URL and select a model');
      return;
    }

    setIsLoading(true);
    setError(null);
    setExtractedData(null);

    console.log('Sending request with:', { url, modelId: selectedModel });

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          modelId: selectedModel,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server response:', errorData);
        throw new Error(errorData.error || 'Failed to analyze URL');
      }

      const result = await response.json();
      console.log('Received result:', result);
      setExtractedData(result);
      setSnackbarMessage(`Analysis completed using ${result.metadata.model}`);
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Analysis error:', error);
      setError(error instanceof Error ? error.message : 'Failed to analyze URL');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModelChange = (event: any) => {
    setSelectedModel(event.target.value);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper 
            sx={{ 
              p: 3,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
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
                      <MenuItem value="gpt35">GPT-3.5 Turbo</MenuItem>
                      <MenuItem value="claude">Claude 3</MenuItem>
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
                        label={`Published: ${extractedData.metadata.publishDate}`}
                        size="small"
                        color="default"
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
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h5" gutterBottom sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                  Extracted Data
                </Typography>
                <Typography variant="body1" sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                  {extractedData.content.mainContent}
                </Typography>
                {extractedData.content.sections.map((section, index) => (
                  <Box key={index} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="h6" gutterBottom sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                      {section.heading}
                    </Typography>
                    <Typography variant="body1" sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                      {section.content}
                    </Typography>
                  </Box>
                ))}
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

        {extractedData && (
          <Box sx={{ mt: 4, textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="h5" gutterBottom>Analysis Results</Typography>
            
            {/* Summary Section */}
            <Paper sx={{ p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {extractedData.metadata.publishDate && (
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip 
                      label={`Published: ${new Date(extractedData.metadata.publishDate).toLocaleString()}`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                )}
                <Typography variant="h6" gutterBottom>Summary</Typography>
                <Typography variant="body1" sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                  {extractedData.metadata.description}
                </Typography>
                
                <Typography variant="subtitle1" sx={{ mt: 2 }}>Key Insights:</Typography>
                <List sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: { xs: 'center', md: 'flex-start' }
                }}>
                  {extractedData.metadata.keywords && (
                    <ListItem sx={{ textAlign: { xs: 'center', md: 'left' }, width: '100%' }}>
                      <ListItemIcon sx={{ minWidth: { xs: '40px', md: '56px' } }}>
                        <LightbulbIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={extractedData.metadata.keywords} />
                    </ListItem>
                  )}
                </List>
              </Box>
            </Paper>

            {/* Analysis Section */}
            <Grid container spacing={2}>
              {/* Language Analysis */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }}>
                  <Typography variant="h6" gutterBottom>Language Analysis</Typography>
                  <Typography>Language: English</Typography>
                  <Typography>Confidence: High</Typography>
                </Paper>
              </Grid>

              {/* Sentiment Analysis */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }}>
                  <Typography variant="h6" gutterBottom>Sentiment Analysis</Typography>
                  <Typography>Overall: Positive</Typography>
                  <Typography>Score: 80</Typography>
                  <Typography>Tone: Informative</Typography>
                </Paper>
              </Grid>

              {/* Readability Analysis */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' }, gap: 1 }}>
                  <Typography variant="h6" gutterBottom>Readability Analysis</Typography>
                  
                  <Tooltip title="The approximate U.S. grade level required to understand this text. Lower grades indicate more accessible content.">
                    <Typography>
                      Grade Level: <strong>9</strong>
                    </Typography>
                  </Tooltip>
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 1, mb: 1 }}>
                    Grade levels: 1-6 (Elementary), 7-9 (Middle School), 10-12 (High School), 13+ (College)
                  </Typography>

                  <Tooltip title="Overall readability score (0-100). Higher scores indicate easier readability. Based on factors like sentence length and word complexity.">
                    <Typography>
                      Score: <strong>70</strong>
                    </Typography>
                  </Tooltip>

                  <Tooltip title="Assessment of text complexity based on vocabulary, sentence structure, and overall readability metrics.">
                    <Typography>
                      Complexity: <strong>Medium</strong>
                    </Typography>
                  </Tooltip>

                  <Box sx={{ mt: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>Detailed Metrics:</Typography>
                    <Tooltip title="Average number of words per sentence. Shorter sentences are typically easier to read.">
                      <Typography variant="body2">
                        • Avg. Sentence Length: <strong>15</strong> words
                      </Typography>
                    </Tooltip>
                    <Tooltip title="Percentage of words that are considered complex (3+ syllables). Lower percentages indicate simpler vocabulary.">
                      <Typography variant="body2">
                        • Complex Words: <strong>20%</strong>
                      </Typography>
                    </Tooltip>
                    <Tooltip title="Flesch Reading Ease score (0-100). Higher scores mean the text is easier to read.">
                      <Typography variant="body2">
                        • Reading Ease: <strong>60</strong>
                      </Typography>
                    </Tooltip>
                  </Box>
                </Paper>
              </Grid>

              {/* SEO Analysis */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }}>
                  <Typography variant="h6" gutterBottom>SEO Analysis</Typography>
                  <Typography>Score: 80</Typography>
                  <Typography variant="subtitle1" sx={{ mt: 1 }}>Recommendations:</Typography>
                  <List dense sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }}>
                    <ListItem sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                      <ListItemIcon sx={{ minWidth: { xs: '40px', md: '56px' } }}>
                        <CheckCircleIcon color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Optimize meta title and description" />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>

              {/* Keywords Analysis */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                    Keywords Analysis
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                        Primary Keywords:
                      </Typography>
                      <List dense sx={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: { xs: 'center', md: 'flex-start' }
                      }}>
                        <ListItem sx={{ textAlign: { xs: 'center', md: 'left' }, width: '100%' }}>
                          <ListItemText 
                            primary="Keyword 1"
                            secondary={`Frequency: 10 | Density: 0.5`}
                          />
                        </ListItem>
                      </List>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                        Key Phrases:
                      </Typography>
                      <List dense sx={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: { xs: 'center', md: 'flex-start' }
                      }}>
                        <ListItem sx={{ textAlign: { xs: 'center', md: 'left' }, width: '100%' }}>
                          <ListItemText 
                            primary="Key Phrase 1"
                            secondary={`Frequency: 5`}
                          />
                        </ListItem>
                      </List>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Box>
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
