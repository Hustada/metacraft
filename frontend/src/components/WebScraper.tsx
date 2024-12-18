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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Heading,
  useColorMode,
  IconButton,
  Flex,
  Code,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Grid,
  SimpleGrid,
} from '@chakra-ui/react'
import { SunIcon, MoonIcon } from '@chakra-ui/icons'
import { AnalysisResponse } from '../types'

const API_URL = 'http://localhost:3000';

const WebScraper = () => {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null)
  const toast = useToast()
  const { colorMode, toggleColorMode } = useColorMode()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    console.log('Submitting URL for analysis:', url);

    try {
      console.log('Making request to backend...');
      const response = await axios.post(`${API_URL}/analyze`, { url })
      console.log('Received response:', response.data);
      
      setAnalysisResult(response.data)
      toast({
        title: 'Analysis Complete',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      console.error('Analysis error:', error);
      const errorMessage = axios.isAxiosError(error) 
        ? error.response?.data?.error || error.message
        : error instanceof Error ? error.message : 'Failed to analyze website';
      
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ label, value }: { label: string; value: string | number }) => (
    <Box p={4} borderWidth="1px" borderRadius="md">
      <Text fontSize="sm" color="gray.500">{label}</Text>
      <Text fontSize="xl" fontWeight="bold">{value}</Text>
    </Box>
  )

  return (
    <Container maxW="container.xl" py={8}>
      <Stack spacing={8}>
        <Flex justifyContent="space-between" alignItems="center">
          <Heading size="lg">MetaCraft Web Analyzer</Heading>
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
          />
        </Flex>

        <Box p={6} borderWidth="1px" borderRadius="lg" bg={colorMode === 'light' ? 'white' : 'gray.700'}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <Box>
                <Text mb={2} fontSize="lg">Website URL</Text>
                <Input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter website URL"
                  size="lg"
                  required
                />
              </Box>
              <Button
                colorScheme="blue"
                type="submit"
                isLoading={loading}
                size="lg"
                width="100%"
              >
                Analyze Website
              </Button>
            </Stack>
          </form>
        </Box>

        {loading && (
          <Box textAlign="center" p={8}>
            <Spinner size="xl" thickness="4px" speed="0.65s" />
            <Text mt={4} fontSize="lg">Analyzing website structure...</Text>
          </Box>
        )}

        {analysisResult && (
          <Tabs variant="enclosed" colorScheme="blue">
            <TabList>
              <Tab>Basic Analysis</Tab>
              <Tab>Components</Tab>
              <Tab>Theme System</Tab>
              <Tab>Implementation</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <Box p={4} borderWidth="1px" borderRadius="lg" bg={colorMode === 'light' ? 'white' : 'gray.700'}>
                  <Stack spacing={4}>
                    <Heading size="md">Site Overview</Heading>
                    <SimpleGrid columns={[1, 2]} spacing={4}>
                      <StatCard label="Title" value={analysisResult.basicAnalysis.title} />
                      <StatCard label="Links" value={analysisResult.basicAnalysis.linkCount} />
                      <StatCard label="Images" value={analysisResult.basicAnalysis.imageCount} />
                      <StatCard label="Headers" value={analysisResult.basicAnalysis.headerCount} />
                      <StatCard label="Paragraphs" value={analysisResult.basicAnalysis.paragraphCount} />
                      <StatCard label="Divs" value={analysisResult.basicAnalysis.divCount} />
                    </SimpleGrid>
                  </Stack>
                </Box>
              </TabPanel>

              <TabPanel>
                <Box p={4} borderWidth="1px" borderRadius="lg" bg={colorMode === 'light' ? 'white' : 'gray.700'}>
                  <Accordion allowMultiple>
                    {analysisResult.aiAnalysis?.components?.map((component, index) => (
                      <AccordionItem key={index}>
                        <AccordionButton>
                          <Box flex="1" textAlign="left">
                            <Text fontWeight="bold">{component?.name || 'Unnamed Component'}</Text>
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel>
                          <Stack spacing={4}>
                            {component?.description && (
                              <Box>
                                <Heading size="sm">Description</Heading>
                                <Text>{component.description}</Text>
                              </Box>
                            )}
                            {component?.code && (
                              <Box>
                                <Heading size="sm">Component Code</Heading>
                                <Code display="block" whiteSpace="pre" p={4} borderRadius="md" overflowX="auto">
                                  {component.code}
                                </Code>
                              </Box>
                            )}
                            {component?.props?.interface && (
                              <Box>
                                <Heading size="sm">Props</Heading>
                                <Code display="block" whiteSpace="pre" p={4} borderRadius="md">
                                  {component.props.interface}
                                </Code>
                              </Box>
                            )}
                            {component?.styling?.customization && (
                              <Box>
                                <Heading size="sm">Styling</Heading>
                                <Text>{component.styling.customization}</Text>
                              </Box>
                            )}
                            {component?.usage && (
                              <Box>
                                <Heading size="sm">Usage</Heading>
                                <Text>{component.usage}</Text>
                              </Box>
                            )}
                          </Stack>
                        </AccordionPanel>
                      </AccordionItem>
                    ))}
                    {(!analysisResult.aiAnalysis?.components || analysisResult.aiAnalysis.components.length === 0) && (
                      <Box p={4} textAlign="center">
                        <Text>No components analysis available</Text>
                      </Box>
                    )}
                  </Accordion>
                </Box>
              </TabPanel>

              <TabPanel>
                <Box p={4} borderWidth="1px" borderRadius="lg" bg={colorMode === 'light' ? 'white' : 'gray.700'}>
                  <Stack spacing={4}>
                    <Box>
                      <Heading size="md">Theme Configuration</Heading>
                      <Code display="block" whiteSpace="pre" p={4} borderRadius="md">
                        {JSON.stringify(analysisResult.aiAnalysis?.themeSystem, null, 2)}
                      </Code>
                    </Box>
                  </Stack>
                </Box>
              </TabPanel>

              <TabPanel>
                <Box p={4} borderWidth="1px" borderRadius="lg" bg={colorMode === 'light' ? 'white' : 'gray.700'}>
                  <Stack spacing={4}>
                    <Box>
                      <Heading size="md">Setup Instructions</Heading>
                      <Text whiteSpace="pre-wrap">{analysisResult.aiAnalysis?.implementation?.setup}</Text>
                    </Box>
                    <Box>
                      <Heading size="md">Required Dependencies</Heading>
                      <Code display="block" whiteSpace="pre" p={4} borderRadius="md">
                        {analysisResult.aiAnalysis?.implementation?.dependencies?.join('\n')}
                      </Code>
                    </Box>
                    <Box>
                      <Heading size="md">Project Structure</Heading>
                      <Text whiteSpace="pre-wrap">{analysisResult.aiAnalysis?.implementation?.structure}</Text>
                    </Box>
                  </Stack>
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        )}
      </Stack>
    </Container>
  )
}

export default WebScraper
