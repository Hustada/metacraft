import React from 'react';
import { 
  Box, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface ExtractedData {
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

interface DataPreviewProps {
  extractedData: ExtractedData | null;
  selectedModel: string;
  onModelChange: (event: any) => void;
}

export const DataPreview: React.FC<DataPreviewProps> = ({ 
  extractedData,
  selectedModel,
  onModelChange
}) => {
  if (!extractedData) {
    return (
      <Box sx={{ p: 2, color: 'text.secondary' }}>
        No data to preview. Please analyze a URL first.
      </Box>
    );
  }

  const renderValue = (value: any): React.ReactNode => {
    if (!value) return 'N/A';
    
    if (Array.isArray(value)) {
      return (
        <Box sx={{ pl: 2 }}>
          {value.map((item, index) => (
            <Box key={index} sx={{ mb: 1 }}>
              {typeof item === 'object' ? renderObject(item) : String(item)}
            </Box>
          ))}
        </Box>
      );
    } else if (typeof value === 'object' && value !== null) {
      return renderObject(value);
    }
    return String(value);
  };

  const renderObject = (obj: Record<string, any> | null): React.ReactNode => {
    if (!obj || typeof obj !== 'object') {
      return 'N/A';
    }

    return (
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table size="small">
          <TableBody>
            {Object.entries(obj).map(([key, value]) => (
              <TableRow key={key}>
                <TableCell 
                  component="th" 
                  scope="row" 
                  sx={{ 
                    fontWeight: 'bold', 
                    width: '30%',
                    textTransform: 'capitalize'
                  }}
                >
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </TableCell>
                <TableCell>{renderValue(value)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const sections = [
    { key: 'titles', label: 'Titles' },
    { key: 'paragraphs', label: 'Paragraphs' },
    { key: 'links', label: 'Links' },
    { key: 'products', label: 'Products' },
    { key: 'metadata', label: 'Metadata' }
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 2 }}>
        <FormControl fullWidth>
          <InputLabel>AI Model</InputLabel>
          <Select
            value={selectedModel}
            label="AI Model"
            onChange={(e) => onModelChange(e.target.value)}
          >
            <MenuItem value="gpt4">GPT-4 Turbo</MenuItem>
            <MenuItem value="claude">Claude 3</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ mt: 2 }}>
        {sections.map(({ key, label }) => {
          const data = extractedData[key as keyof ExtractedData];
          if (!data || (Array.isArray(data) && data.length === 0)) return null;

          return (
            <Accordion key={key} defaultExpanded={key === 'metadata'}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{label}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {renderValue(data)}
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>
    </Box>
  );
};
