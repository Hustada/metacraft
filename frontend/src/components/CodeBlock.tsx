import React from 'react';
import { Box } from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  children: React.ReactNode;
  language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ children, language = 'typescript' }) => {
  const code = React.Children.toArray(children)
    .map(child => {
      if (typeof child === 'string') return child;
      if (React.isValidElement(child) && child.type === 'code') {
        return child.props.children;
      }
      return '';
    })
    .join('');

  return (
    <Box sx={{ fontSize: '0.875rem' }}>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          borderRadius: '4px',
          fontSize: 'inherit',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </Box>
  );
};

export default CodeBlock;
