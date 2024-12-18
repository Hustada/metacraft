import { useState } from 'react'
import axios from 'axios'
import {
  Box,
  Button,
  Container,
  Input,
  Stack,
  Text,
  useToast,
  Spinner,
} from '@chakra-ui/react'

import { AnalysisResponse } from '../types'

const API_URL = 'http://localhost:3000';

const WebScraper = () => {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null)
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axios.post(`${API_URL}/analyze`, { url })
      setAnalysisResult(response.data)
      toast({
        title: 'Analysis Complete',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to analyze website',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Stack spacing={8}>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Box>
            <Text mb={2}>Website URL</Text>
            <Input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter website URL"
              required
            />
          </Box>
          <Button
            mt={4}
            colorScheme="blue"
            type="submit"
            isLoading={loading}
            width="100%"
          >
            Analyze Website
          </Button>
        </form>

        {loading && (
          <Box textAlign="center">
            <Spinner size="xl" />
            <Text mt={4}>Analyzing website...</Text>
          </Box>
        )}

        {analysisResult && (
          <Stack spacing={4}>
            <Box p={4} borderWidth="1px" borderRadius="lg">
              <Text fontWeight="bold" mb={2}>Analysis</Text>
              <Text whiteSpace="pre-wrap">{analysisResult.analysis}</Text>
            </Box>
            
            <Box p={4} borderWidth="1px" borderRadius="lg">
              <Text fontWeight="bold" mb={2}>Structure</Text>
              <Text whiteSpace="pre-wrap">{analysisResult.structure}</Text>
            </Box>
            
            <Box p={4} borderWidth="1px" borderRadius="lg">
              <Text fontWeight="bold" mb={2}>Code Snippets</Text>
              <Text whiteSpace="pre-wrap">{analysisResult.code_snippets}</Text>
            </Box>
          </Stack>
        )}
      </Stack>
    </Container>
  )
}

export default WebScraper
