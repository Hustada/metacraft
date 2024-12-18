import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Tabs,
  Tab,
  Alert,
  Snackbar,
  useTheme,
  useMediaQuery,
  styled,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { mockAnalysis } from '../mocks/analysisData';
import ComponentPreview from './preview/ComponentPreview';

// Styled components
const StyledContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(3),
  gap: theme.spacing(3),
  margin: '0 auto',
  maxWidth: '100%',
  overflow: 'hidden',
  '& > *': {
    maxWidth: '100%',
    overflow: 'hidden'
  }
}));

const ContentPaper = styled(Paper)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const CodeBlock = styled('pre')(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  overflow: 'auto',
  margin: 0,
  maxHeight: '500px',
  '& code': {
    fontFamily: 'monospace',
    fontSize: '0.875rem',
    lineHeight: 1.5,
  }
}));

const TreeView = styled(Box)(({ theme }) => ({
  '& .tree-item': {
    marginLeft: theme.spacing(3),
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      left: '-16px',
      top: '50%',
      width: '12px',
      height: '1px',
      backgroundColor: theme.palette.divider,
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      left: '-16px',
      top: '-8px',
      width: '1px',
      height: 'calc(100% + 16px)',
      backgroundColor: theme.palette.divider,
    },
    '&:last-child::after': {
      height: '50%',
    }
  }
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const StructureNode = ({ node, depth = 0 }: { node: any; depth?: number }) => {
  const theme = useTheme();
  const bgColor = depth % 2 === 0 ? 'background.default' : 'background.paper';

  return (
    <Box sx={{ pl: 2 }}>
      <Paper 
        sx={{ 
          p: 1, 
          mb: 1, 
          bgcolor: bgColor,
          border: 1,
          borderColor: 'divider'
        }}
      >
        <Typography component="div" sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Typography component="span" color="primary.main" fontWeight="bold">
            {node.type}
          </Typography>
          {node.className && (
            <Typography component="span" color="text.secondary">
              class="{node.className}"
            </Typography>
          )}
          {node.text && (
            <Typography component="span" color="success.main">
              "{node.text}"
            </Typography>
          )}
        </Typography>
      </Paper>
      {node.children && (
        <Box className="tree-item">
          {node.children.map((child: any, index: number) => (
            <StructureNode key={index} node={child} depth={depth + 1} />
          ))}
        </Box>
      )}
    </Box>
  );
};

function WebScraper() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [useMockData, setUseMockData] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    
    // Clear error when user starts typing
    if (urlError && newUrl) {
      setUrlError(null);
    }
  };

  const handleAnalyze = async () => {
    // Reset errors
    setError(null);
    setUrlError(null);

    // Validate empty URL
    if (!url.trim()) {
      setUrlError('Please enter a URL');
      return;
    }

    // Validate URL format
    if (!validateUrl(url)) {
      setUrlError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    setLoading(true);

    if (useMockData) {
      setTimeout(() => {
        setAnalysis(mockAnalysis);
        setLoading(false);
      }, 1000);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/analyze', { url });
      if (response.data.success) {
        setAnalysis({
          structure: response.data.structure,
          components: response.data.components,
          html: response.data.html,
          themeSystem: response.data.themeSystem,
          basicAnalysis: response.data.basicAnalysis
        });
      } else {
        throw new Error(response.data.error || 'Failed to analyze URL');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <StyledContainer maxWidth="lg">
      {/* Header */}
      <Typography 
        variant="h4" 
        component="h1" 
        align="center"
        sx={{ 
          width: '100%',
          mb: 2,
          mt: { xs: 2, sm: 4 }
        }}
      >
        Web Scraper & React Component Generator
      </Typography>

      {/* URL Input Section */}
      <Box 
        sx={{ 
          width: '100%',
          maxWidth: 600,
          mx: 'auto'
        }}
      >
        <ContentPaper elevation={2}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={useMockData}
                  onChange={(e) => setUseMockData(e.target.checked)}
                />
              }
              label={
                <Typography variant="body2" color="text.secondary">
                  Use Test Data
                </Typography>
              }
            />
          </Box>
          <TextField
            fullWidth
            label="Enter URL"
            variant="outlined"
            value={url}
            onChange={handleUrlChange}
            disabled={loading}
            error={!!urlError}
            helperText={urlError}
            placeholder="https://example.com"
            InputProps={{
              type: 'url',
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !loading) {
                handleAnalyze();
              }
            }}
          />
          <Button
            fullWidth
            variant="contained"
            onClick={handleAnalyze}
            disabled={loading}
            sx={{ 
              py: 1.5,
              mt: 1
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Analyze URL'}
          </Button>
        </ContentPaper>
      </Box>

      {/* Analysis Results */}
      {analysis && (
        <ContentPaper elevation={2}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons={isMobile ? "auto" : false}
            sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              mb: 2
            }}
          >
            <Tab label="HTML Analysis" />
            <Tab label="React Components" />
            <Tab label="Raw HTML" />
          </Tabs>

          <TabPanel value={currentTab} index={0}>
            <Typography variant="h6" gutterBottom>
              HTML Structure Analysis
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Below is a visual representation of your HTML structure, showing the hierarchy and relationships between elements.
            </Typography>
            <TreeView>
              {analysis?.structure && Object.entries(analysis.structure).map(([key, value]: [string, any]) => (
                <StructureNode key={key} node={{ type: key, ...value }} />
              ))}
            </TreeView>
          </TabPanel>

          <TabPanel value={currentTab} index={1}>
            <Typography variant="h6" gutterBottom>
              Generated React Components
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Here are your React components, automatically generated from the HTML structure. Each component is modular and reusable.
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: 3,
              maxWidth: '100%',
              overflow: 'hidden'
            }}>
              <Box sx={{ 
                flex: '0 0 auto',
                maxWidth: '100%'
              }}>
                <ComponentPreview componentCode={analysis?.components || ''} />
              </Box>
              <Box sx={{ 
                flex: '1 1 auto',
                maxWidth: '100%'
              }}>
                <Typography variant="h6" gutterBottom>
                  Component Code
                </Typography>
                <Box sx={{ 
                  maxHeight: '400px',
                  overflow: 'auto'
                }}>
                  <CodeBlock>
                    <code>{analysis?.components}</code>
                  </CodeBlock>
                </Box>
              </Box>
            </Box>
          </TabPanel>

          <TabPanel value={currentTab} index={2}>
            <Typography variant="h6" gutterBottom>
              Original HTML
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              This is the original HTML code that was analyzed to generate the structure and components.
            </Typography>
            <CodeBlock>
              <code>{analysis?.html}</code>
            </CodeBlock>
          </TabPanel>
        </ContentPaper>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="error"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </StyledContainer>
  );
}

export default WebScraper;
