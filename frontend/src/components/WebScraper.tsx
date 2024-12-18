import { useState } from 'react';
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
} from '@mui/material';

// Styled components
const StyledContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(3),
  gap: theme.spacing(3),
  margin: '0 auto',
  '& > *': {
    maxWidth: '100%'
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
  '& code': {
    fontFamily: 'monospace',
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

function WebScraper() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleAnalyze = async () => {
    if (!url) {
      setError('Please enter a URL');
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:3000/analyze', { url });
      setAnalysis(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
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
          <TextField
            fullWidth
            label="Enter URL"
            variant="outlined"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
            placeholder="https://example.com"
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
              Structure Analysis
            </Typography>
            <CodeBlock>
              <code>{JSON.stringify(analysis.structure, null, 2)}</code>
            </CodeBlock>
          </TabPanel>

          <TabPanel value={currentTab} index={1}>
            <Typography variant="h6" gutterBottom>
              Generated React Components
            </Typography>
            <CodeBlock>
              <code>{analysis.components}</code>
            </CodeBlock>
          </TabPanel>

          <TabPanel value={currentTab} index={2}>
            <Typography variant="h6" gutterBottom>
              Raw HTML
            </Typography>
            <CodeBlock>
              <code>{analysis.html}</code>
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
