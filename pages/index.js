/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from 'react'
import Head from 'next/head'
import { Button, Flex, Text, Spinner, useToast, Accordion, AccordionItem, AccordionButton, AccordionIcon, Box, AccordionPanel } from '@chakra-ui/react'
import { useWeb3 } from '@3rdweb/hooks'
import { ThirdwebSDK } from '@3rdweb/sdk'
import Layout from 'components/Layout'
import DEPLOY from 'utils'

const TITLE = 'Taco DAO'

// We instantiate the sdk on Rinkeby.
const sdk = new ThirdwebSDK('rinkeby')

// We can grab a reference to our ERC-1155 contract.
const bundleDropModule = sdk.getBundleDropModule(DEPLOY.BUNDLE_DROP_ADDRESS)

export default function Home () {
  const toast = useToast()
  const [loader] = useState(false)
  // Use the connectWallet hook thirdweb gives us.
  const { connectWallet, address, error, provider } = useWeb3()
  // The signer is required to sign transactions on the blockchain. Without it we can only read data, not write.
  const signer = provider ? provider.getSigner() : undefined
  // isClaiming lets us easily keep a loading state while the NFT is minting.
  const [isClaiming, setIsClaiming] = useState(false)
  // State variable for us to know if user has our NFT.
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false)

  useEffect(async () => {
    // If they don't have an connected wallet, exit!
    if (!address) {
      return
    }

    // Check if the user has the NFT by using bundleDropModule.balanceOf
    // 0 is the id of our NFT
    const balance = await bundleDropModule.balanceOf(address, '0')

    try {
      if (balance) {
        // If balance is greater than 0, they have our NFT!
        if (balance.gt(0)) {
          setHasClaimedNFT(true)
          console.log('🌟 this user has a membership NFT!')
        } else {
          setHasClaimedNFT(false)
          console.log("😭 this user doesn't have a membership NFT.")
        }
      }
    } catch (error) {
      setHasClaimedNFT(false)
      console.error('failed to nft balance', error)
    }
  }, [address])

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

  useEffect(() => {
    console.log('provider', provider)
    // We pass the signer to the sdk, which enables us to interact with our deployed contract!
    signer && sdk.setProviderOrSigner(signer)
  }, [signer])

  const mintNft = async () => {
    setIsClaiming(true)
    console.log('signer', signer)
    try {
      // Call bundleDropModule.claim("0", 1) to mint nft to user's wallet.
      await bundleDropModule.claim('0', 1)
      // Set claim state.
      setHasClaimedNFT(true)
      // Show user their fancy new NFT!
      console.log(`🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address}/0`)
    } catch (error) {
      console.error('failed to claim', error)
    } finally {
      // Stop loading state.
      setIsClaiming(false)
    }
  }

  const renderBody = () => {
    if (!address) {
      return (
        <Flex>
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
        </Flex>
      )
    }

    if (address && !hasClaimedNFT) {
      return (
        <Flex
            p={20}
            align={'center'}
            justify={'center'}
            w={'100%'}
          >
            <Button
              mt={10}
              w={'30%'}
              letterSpacing={1}
              borderRadius={'md'}
              bg={'yellow.600'}
              color={'white'}
              boxShadow={'2xl'}
              _hover={{
                opacity: '.9',
                cursor: 'pointer'
              }}
              disabled={isClaiming}
              onClick={() => mintNft()}
            >
              {isClaiming ? 'Minting...' : 'Mint your nft (FREE)'}
            </Button>
          </Flex>
      )
    }

    if (address && hasClaimedNFT) {
      return (
        <Flex
          p={20}
          direction={'column'}
          align={'center'}
          justify={'center'}
          w={'100%'}
        >
          <Text
            mb={10}
            as={'h1'}
            fontSize={'5xl'}
          >
            🌮DAO Member Page
          </Text>
          <Text
            mb={10}
            as={'p'}
          >
            Congratulations on being a member
          </Text>
        </Flex>
      )
    }
  }

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

        {renderBody()}
      </Flex>
    </Layout>
  )
}
