/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import { ChakraProvider, ColorModeScript, CSSReset } from '@chakra-ui/react'
import customTheme from 'styles/theme'
import 'animate.css'
import { ThirdwebWeb3Provider } from '@3rdweb/hooks'

// Include what chains you wanna support.
// 4 = Rinkeby.
const supportedChainIds = [4]

// Include what type of wallet you want to support.
// In this case, we support Metamask which is an "injected wallet".
const connectors = {
  injected: {}
}

function MyApp ({ Component }) {
  return (
    <ChakraProvider theme={customTheme}>
      <CSSReset />
      <ColorModeScript initialColorMode={customTheme.initialColorMode} />
      <ThirdwebWeb3Provider
        connectors={connectors}
        supportedChainIds={supportedChainIds}
      >
        <Component />
      </ThirdwebWeb3Provider>
    </ChakraProvider>
  )
}

export default MyApp
