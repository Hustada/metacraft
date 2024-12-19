import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Grid,
  LinearProgress,
  Snackbar,
  IconButton,
  Tooltip,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Chip,
  Stack,
} from '@mui/material';
import { DataPreview } from './preview/DataPreview';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

interface Model {
  id: string;
  name: string;
  provider: string;
  description: string;
  available: boolean;
}

interface ExtractedData {
  summary?: {
    overview?: string;
    topics?: string[];
    audience?: string;
    contentType?: string;
    insights?: string[];
  };
  titles?: Array<{ type: string; text: string }>;
  paragraphs?: string[];
  links?: Array<{ text: string; url: string }>;
  products?: Array<{
    sku?: string;
    title: string;
    price?: number;
    description?: string;
  }>;
  metadata?: {
    title?: string;
    description?: string;
    keywords?: string;
    author?: string;
    publishDate?: string;
    categories?: string[];
  };
}

interface AnalysisResponse {
  success: boolean;
  data?: ExtractedData;
  model?: string;
  error?: string;
}

const LoadingMessages = [
  "Training an army of microscopic web crawlers...",
  "Convincing AI not to become self-aware...",
  "Untangling the world wide web...",
  "Feeding hamsters that power our servers...",
  "Downloading more RAM...",
  "Consulting the digital oracle...",
  "Bribing pixels to arrange themselves properly...",
  "Teaching robots to read faster...",
  "Reticulating splines...",
  "Calculating the meaning of life (again)...",
  "Debugging quantum fluctuations...",
  "Compressing the internet...",
  "Negotiating with stubborn HTML tags...",
  "Summoning the spirit of Tim Berners-Lee...",
  "Politely asking data to organize itself...",
  "Teaching AI to appreciate cat videos...",
  "Counting all the zeros and ones...",
  "Persuading cookies to share their secrets...",
  "Applying machine learning to office coffee maker...",
  "Converting caffeine into code...",
  "Explaining to AI why humans need sleep...",
  "Recruiting more cloud servers from the sky...",
  "Asking ChatGPT to stop writing poetry...",
  "Optimizing blockchain synergy paradigms...",
  "Teaching neural networks interpretive dance...",
  "Downloading the entire internet (2%)...",
  "Arguing with recursive functions...",
  "Waiting for quantum computer to be both ready and not ready...",
  "Translating binary into interpretive dance...",
  "Asking Stack Overflow to be nice...",
  "Convincing bugs they're actually features...",
  "Measuring processor temperature in jalapeños...",
  "Refactoring spaghetti code into linguine code...",
  "Updating update updater...",
  "Dividing by zero (safely)...",
];

export const WebScraper: React.FC = () => {
  const theme = useTheme();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [selectedModel, setSelectedModel] = useState('gpt4');
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

  const handleAnalyze = async () => {
    if (!url || !selectedModel) return;

    try {
      setIsLoading(true);
      setError(null);
      setExtractedData(null);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, modelId: selectedModel }),
      });

      const result: AnalysisResponse = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to analyze URL');
      }

      setExtractedData(result.data || null);
      setSnackbarMessage(`Analysis completed using ${result.model}`);
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze URL');
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
                Web Content Extractor
                <Tooltip title="Enter a URL to analyze its content. We'll extract structured data like titles, paragraphs, links, and more.">
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
                Analyze any webpage and extract structured data using AI
              </Typography>

              {/* Model Selection */}
              <Box sx={{ mt: 3, mb: 4 }}>
                <Stack spacing={2}>
                  <FormControl fullWidth>
                    <InputLabel id="model-select-label">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AutoFixHighIcon sx={{ color: 'primary.main' }} fontSize="small" />
                        Select AI Model
                      </Box>
                    </InputLabel>
                    <Select
                      labelId="model-select-label"
                      value={selectedModel}
                      onChange={handleModelChange}
                      disabled={isLoading}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AutoFixHighIcon fontSize="small" />
                          Select AI Model
                        </Box>
                      }
                    >
                      {Object.entries(models).map(([id, model]) => (
                        <MenuItem 
                          key={id} 
                          value={id}
                          disabled={!model.available}
                          sx={{ 
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            gap: 0.5,
                            py: 1
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                            <Typography variant="body1">
                              {model.name}
                            </Typography>
                            {!model.available && (
                              <Chip 
                                label="Coming Soon" 
                                size="small" 
                                color="warning" 
                                sx={{ ml: 'auto' }}
                              />
                            )}
                          </Box>
                          <Typography 
                            variant="caption" 
                            color="text.secondary"
                          >
                            {model.description}
                          </Typography>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Box sx={{ display: 'flex', gap: 2 }}>
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
              selectedModel={selectedModel}
              onModelChange={handleModelChange}
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
