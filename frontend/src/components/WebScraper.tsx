import React, { useState, useEffect } from 'react';
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
  useTheme,
  Tooltip,
  IconButton,
} from '@mui/material';
import { DataPreview } from './preview/DataPreview';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
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
  summary: {
    overview: string;
    insights: string[];
    topics: string[];
    audience: string;
    contentType: string;
  };
  titles: Array<{
    type: string;
    text: string;
  }>;
  paragraphs: string[];
  links: Array<{
    text: string;
    url: string;
    type: string;
  }>;
  metadata: {
    author?: string;
    publishDate?: string;
    categories?: string[];
    description?: string;
    keywords?: string[];
    url: string;
    analyzedAt: string;
    model: string;
  };
  analysis: Analysis;
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

export const WebScraper: React.FC = () => {
  const theme = useTheme();
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
        {extractedData?.summary && (
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
                        {extractedData.summary.overview}
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
                      {extractedData.summary.insights?.map((insight, index) => (
                        <Typography 
                          key={index} 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'flex-start',
                            gap: 1,
                            mb: 1 
                          }}
                        >
                          <span>•</span>
                          <span>{insight}</span>
                        </Typography>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {extractedData.summary.contentType && (
                      <Chip 
                        label={`Type: ${extractedData.summary.contentType}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ borderWidth: 2 }}
                      />
                    )}
                    {extractedData.summary.audience && (
                      <Chip 
                        label={`Audience: ${extractedData.summary.audience}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ borderWidth: 2 }}
                      />
                    )}
                    {extractedData.summary.topics?.map((topic, index) => (
                      <Chip 
                        key={index}
                        label={topic}
                        size="small"
                        color="default"
                        variant="outlined"
                      />
                    ))}
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
            <DataPreview
              extractedData={extractedData}
            />
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
                {extractedData.metadata.analyzedAt && (
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip 
                      label={`Analyzed: ${new Date(extractedData.metadata.analyzedAt).toLocaleString()}`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                )}
                <Typography variant="h6" gutterBottom>Summary</Typography>
                <Typography variant="body1" sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                  {extractedData.summary.overview}
                </Typography>
                
                <Typography variant="subtitle1" sx={{ mt: 2 }}>Key Insights:</Typography>
                <List sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: { xs: 'center', md: 'flex-start' }
                }}>
                  {extractedData.summary.insights.map((insight, index) => (
                    <ListItem key={index} sx={{ textAlign: { xs: 'center', md: 'left' }, width: '100%' }}>
                      <ListItemIcon sx={{ minWidth: { xs: '40px', md: '56px' } }}>
                        <LightbulbIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={insight} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Paper>

            {/* Analysis Section */}
            <Grid container spacing={2}>
              {/* Language Analysis */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }}>
                  <Typography variant="h6" gutterBottom>Language Analysis</Typography>
                  <Typography>Language: {extractedData.analysis.language.name}</Typography>
                  <Typography>Confidence: {extractedData.analysis.language.confidence}</Typography>
                </Paper>
              </Grid>

              {/* Sentiment Analysis */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }}>
                  <Typography variant="h6" gutterBottom>Sentiment Analysis</Typography>
                  <Typography>Overall: {extractedData.analysis.sentiment.overall}</Typography>
                  <Typography>Score: {extractedData.analysis.sentiment.score}</Typography>
                  <Typography>Tone: {extractedData.analysis.sentiment.analysis.tone}</Typography>
                </Paper>
              </Grid>

              {/* Readability Analysis */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }}>
                  <Typography variant="h6" gutterBottom>Readability Analysis</Typography>
                  <Typography>Grade Level: {extractedData.analysis.readability.gradeLevel}</Typography>
                  <Typography>Score: {extractedData.analysis.readability.score}</Typography>
                  <Typography>Complexity: {extractedData.analysis.readability.analysis.complexity}</Typography>
                </Paper>
              </Grid>

              {/* SEO Analysis */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }}>
                  <Typography variant="h6" gutterBottom>SEO Analysis</Typography>
                  <Typography>Score: {extractedData.analysis.seo.score}</Typography>
                  <Typography variant="subtitle1" sx={{ mt: 1 }}>Recommendations:</Typography>
                  <List dense sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }}>
                    {extractedData.analysis.seo.recommendations.map((rec, index) => (
                      <ListItem key={index} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                        <ListItemIcon sx={{ minWidth: { xs: '40px', md: '56px' } }}>
                          <CheckCircleIcon color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={rec} />
                      </ListItem>
                    ))}
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
                        {extractedData.analysis.keywords.primary.map((keyword, index) => (
                          <ListItem key={index} sx={{ textAlign: { xs: 'center', md: 'left' }, width: '100%' }}>
                            <ListItemText 
                              primary={keyword.keyword}
                              secondary={`Frequency: ${keyword.frequency} | Density: ${keyword.density}`}
                            />
                          </ListItem>
                        ))}
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
                        {extractedData.analysis.keywords.phrases.map((phrase, index) => (
                          <ListItem key={index} sx={{ textAlign: { xs: 'center', md: 'left' }, width: '100%' }}>
                            <ListItemText 
                              primary={phrase.phrase}
                              secondary={`Frequency: ${phrase.frequency}`}
                            />
                          </ListItem>
                        ))}
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
