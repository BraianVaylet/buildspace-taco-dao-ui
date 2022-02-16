/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from 'react'
import Head from 'next/head'
import { Button, Flex, Text, Spinner, useToast, Accordion, AccordionItem, AccordionButton, AccordionIcon, Box, AccordionPanel } from '@chakra-ui/react'
import Layout from 'components/Layout'

const TITLE = 'Taco DAO'

export default function Home () {
  const toast = useToast()
  const [loader] = useState(false)
  const [currentAccount, setCurrentAccount] = useState('') // Almacenamos la billetera pública de nuestro usuario.
  const [chainIdOk, setChainIdOk] = useState(false)

  const checkNetwork = async () => {
    try {
      if (window.ethereum.networkVersion !== '4') {
        setChainIdOk(false)
        toast({
          title: 'Wrong network.',
          description: 'You are not connected to the Rinkeby testnet!.',
          status: 'error',
          duration: 9000,
          isClosable: true
        })
      } else {
        setChainIdOk(true)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window
      // > Nos aseguramos de tener acceso a window.ethereum
      if (!ethereum) {
        console.log('Make sure you have metamask!')
        toast({
          description: 'Make sure you have metamask!',
          status: 'info',
          duration: 9000,
          isClosable: true
        })
        return
      } else {
        console.log('We have the ethereum object', ethereum)
      }

      // > Comprobamos si estamos autorizados a acceder a la billetera del usuario
      const accounts = await ethereum.request({ method: 'eth_accounts' })

      if (accounts.length !== 0) {
        const account = accounts[0]
        console.log('Found an authorized account:', account)
        setCurrentAccount(account)
        // > Escucho eventos! caso en que un usuario llega a nuestro sitio y YA tenía su billetera conectada + autorizada.
        // setupEventListener()
        // > check de la red
        checkNetwork()
      } else {
        console.log('No authorized account found')
        toast({
          description: 'No authorized account found',
          status: 'error',
          duration: 9000,
          isClosable: true
        })
      }
    } catch (error) {
      console.log(new Error(error))
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window
      if (!ethereum) {
        toast({
          description: 'Get MetaMask!',
          status: 'info',
          duration: 9000,
          isClosable: true
        })
        return
      }
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
      console.log('Connected', accounts[0])
      toast({
        description: 'Connected!',
        status: 'success',
        duration: 2000,
        isClosable: true
      })
      setCurrentAccount(accounts[0])
      checkNetwork()
    } catch (error) {
      console.log(new Error(error))
    }
  }

  useEffect(() => {
    checkNetwork()
    checkIfWalletIsConnected()
  }, [])

  return (
    <Layout
      title={TITLE}
      contract={''}
      chain={chainIdOk}
      address={currentAccount}
      head={
        <Head>
          <title>buildsapce-taco-dao</title>
          <meta name="description" content="buildspace-taco-dao with Next.js" />
          <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico"></link>
        </Head>
      }
    >
      <Flex
        align={'center'}
        justify={'flex-start'}
        direction={'column'}
        w={'100%'}
        py={100}
      >

        <Flex
          align={'center'}
          justify={'center'}
          direction={'column'}
          w={'50%'}
        >
          <Text
            id='top'
            as='h1'
            fontSize={'3xl'}
            fontWeight={900}
            letterSpacing={'1px'}
          >
            {"Hi 👋, I'm Braian and"}
          </Text>
          <Text
            as='h3'
            my={5}
            fontSize={'5xl'}
            fontWeight={600}
            letterSpacing={'.5px'}
          >
            Welcome to {TITLE} 🌮
          </Text>

          <Accordion w={'100%'} allowMultiple>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex='1' textAlign='left'>
                    <Text
                      as={'h2'}
                      fontSize={30}
                      fontWeight={'bold'}>
                        About the project
                    </Text>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>

        </Flex>

        {loader &&
            (
            <Flex
              direction={'column'}
              align={'center'}
              justify={'center'}
              w={'100%'}
              mt={10}
            >
              <Spinner
                thickness='6px'
                speed='0.45s'
                emptyColor='yellow.100'
                color='yellow.500'
                size='xl'
              />
              <Text
                mt={2.5}
              >{'Mining'}</Text>
            </Flex>
            )
        }

        {!currentAccount && (
          <Button
            mt={10}
            w={'30%'}
            letterSpacing={1}
            borderRadius={'md'}
            bg={'gray.600'}
            color={'white'}
            boxShadow={'2xl'}
            _hover={{
              opacity: '.9',
              cursor: 'pointer'
            }}
            onClick={connectWallet}
            disabled={currentAccount}
          >
            {'Connect your Wallet'}
          </Button>
        )}
      </Flex>
    </Layout>
  )
}
