import { ChakraProvider } from '@chakra-ui/react'
import WebScraper from './components/WebScraper'

function App() {
  return (
    <ChakraProvider>
      <WebScraper />
    </ChakraProvider>
  )
}

export default App
