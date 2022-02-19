/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import { Button, Flex, Text, Spinner, useToast, Accordion, AccordionItem, AccordionButton, AccordionIcon, Box, AccordionPanel } from '@chakra-ui/react'
import { useWeb3 } from '@3rdweb/hooks'
import Layout from 'components/Layout'

const TITLE = 'Taco DAO'

export default function Home () {
  const toast = useToast()
  const [loader] = useState(false)

  // Use the connectWallet hook thirdweb gives us.
  const { connectWallet, address, error, provider } = useWeb3()
  console.log('👋 Address:', address)
  console.log('error', error)
  console.log('provider', provider)

  useEffect(() => {
    if (error) {
      toast({
        title: 'Wrong network.',
        description: 'You are not connected to the Rinkeby testnet!.',
        status: 'error',
        duration: 9000,
        isClosable: true
      })
    }
  }, [error])

  return (
    <Layout
      title={TITLE}
      contract={''}
      chain={address && provider && !error}
      address={address}
      head={
        <Head>
          <title>buildspace-taco-dao</title>
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

        {!address
          ? (
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
            onClick={() => connectWallet('injected')}
            disabled={address}
          >
            {'Connect your Wallet'}
          </Button>
            )
          : (
          <Flex
            p={20}
            align={'center'}
            justify={'center'}
            w={'100%'}
          >
            <Text as={'h1'} fontSize='6xl' >Welcome</Text>
          </Flex>
            )}
      </Flex>
    </Layout>
  )
}
