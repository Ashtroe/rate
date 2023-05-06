import '@/styles/globals.css'
import { ChakraProvider, extendTheme, defineStyleConfig } from '@chakra-ui/react'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {

  const Link = defineStyleConfig({
    baseStyle: {
      color: "#FFF"
    }
  })

  const theme = extendTheme({
    components:{
      Link,
      Heading: {
        baseStyle:{
          color:'#FFF',
        }
      }
    }
  })

  
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}
