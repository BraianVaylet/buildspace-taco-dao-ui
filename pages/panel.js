/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import { useWeb3 } from '@3rdweb/hooks'
import { ThirdwebSDK } from '@3rdweb/sdk'
import { UnsupportedChainIdError } from '@web3-react/core'
import { ethers } from 'ethers'
import { Button, Flex, Text, Spinner, useToast, Accordion, AccordionItem, AccordionButton, AccordionIcon, Box, AccordionPanel, Table, Thead, Tr, Th, Tbody, Td, Tfoot, FormControl, FormLabel, RadioGroup, Radio } from '@chakra-ui/react'
import Layout from 'components/Layout'
import DEPLOY from 'utils'

const TITLE = 'Taco DAO'

// We instantiate the sdk on Rinkeby.
const sdk = new ThirdwebSDK('rinkeby')

// We can grab a reference to our ERC-1155 contract.
const bundleDropModule = sdk.getBundleDropModule(DEPLOY.BUNDLE_DROP_ADDRESS)
const tokenModule = sdk.getTokenModule(DEPLOY.TOKEN_MODULE_ADDRESS)
const voteModule = sdk.getVoteModule(DEPLOY.VOTING_MODULE_ADDRESS)

export default function Panel () {
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
  // Holds the amount of token each member has in state.
  const [memberTokenAmounts, setMemberTokenAmounts] = useState({})
  // The array holding all of our members addresses.
  const [memberAddresses, setMemberAddresses] = useState([])

  const [proposals, setProposals] = useState([])
  const [isVoting, setIsVoting] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)

  // A fancy function to shorten someones wallet address, no need to show the whole thing.
  const shortenAddress = (str) => {
    return str.substring(0, 6) + '...' + str.substring(str.length - 4)
  }

  // Now, we combine the memberAddresses and memberTokenAmounts into a single array
  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      return {
        address,
        tokenAmount: ethers.utils.formatUnits(
          // If the address isn't in memberTokenAmounts, it means they don't
          // hold any of our token.
          memberTokenAmounts[address] || 0,
          18
        )
      }
    })
  }, [memberAddresses, memberTokenAmounts])

  // Mint the NFT
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

  // This useEffect grabs all the addresses of our members holding our NFT.
  useEffect(async () => {
    if (!hasClaimedNFT) return
    // Just like we did in the 7-airdrop-token.js file! Grab the users who hold our NFT
    // with tokenId 0.
    try {
      const memberAddresses = await bundleDropModule.getAllClaimerAddresses('0')
      setMemberAddresses(memberAddresses)
      console.log('🚀 Members addresses', memberAddresses)
    } catch (error) {
      console.error('failed to get member list', error)
    }
  }, [hasClaimedNFT])

  // This useEffect grabs the # of token each member holds.
  useEffect(async () => {
    if (!hasClaimedNFT) {
      return
    }

    // Grab all the balances.
    try {
      const amounts = await tokenModule.getAllHolderBalances()
      setMemberTokenAmounts(amounts)
      console.log('👜 Amounts', amounts)
    } catch (error) {
      console.error('failed to get token amounts', error)
    }
  }, [hasClaimedNFT])

  // Retrieve all our existing proposals from the contract.
  useEffect(async () => {
    if (!hasClaimedNFT) {
      return
    }
    // A simple call to voteModule.getAll() to grab the proposals.
    try {
      const proposals = await voteModule.getAll()
      setProposals(proposals)
      console.log('🌈 Proposals:', proposals)
    } catch (error) {
      console.log('failed to get proposals', error)
    }
  }, [hasClaimedNFT])

  // We also need to check if the user already voted.
  useEffect(async () => {
    if (!hasClaimedNFT) {
      return
    }

    // If we haven't finished retrieving the proposals from the useEffect above
    // then we can't check if the user voted yet!
    if (!proposals.length) {
      return
    }

    // Check if the user has already voted on the first proposal.
    try {
      const hasVoted = await voteModule.hasVoted(proposals[0].proposalId, address)
      setHasVoted(hasVoted)
      if (hasVoted) {
        console.log('🥵 User has already voted')
      } else {
        console.log('🙂 User has not voted yet')
      }
    } catch (error) {
      console.error('Failed to check if wallet has voted', error)
    }
  }, [hasClaimedNFT, proposals, address])

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

    if (error instanceof UnsupportedChainIdError) {
      return (
        <Flex
          direction={'column'}
          align={'center'}
          justify={'center'}
          p={2}
          w={'100%'}
        >
          <Text
            letterSpacing={1}
            fontWeight={'bold'}
            fontSize={'3xl'}
            as={'h2'}
            p={5}
          >
            Please connect to Rinkeby
          </Text>
          <Text>
            This dapp only works on the Rinkeby network, please switch networks
            in your connected wallet.
          </Text>
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

    // If the user has already claimed their NFT we want to display the interal DAO page to them
    // only DAO members will see this. Render all the members + token amounts.
    if (address && hasClaimedNFT) {
      return (
        <Flex
          direction={'column'}
          align={'center'}
          justify={'center'}
          w={'100%'}
        >
          {/* title */}
          <Flex
            p={20}
            direction={'column'}
            align={'center'}
            justify={'center'}
            w={'100%'}
          >
            <Text
              as={'h1'}
              fontSize={'5xl'}
            >
              🌮DAO Member Page
            </Text>
            <Text as={'p'}>
              Congratulations on being a member
            </Text>
          </Flex>

          <Flex
            align={'flex-start'}
            justify={'space-between'}
            w={'100%'}
            p={10}
          >
            {/* members */}
            <Flex
              direction={'column'}
              align={'center'}
              justify={'center'}
              w={'100%'}
              p={10}
            >
              <Text
                letterSpacing={1}
                fontWeight={'bold'}
                fontSize={'3xl'}
                as={'h2'}
                p={5}
              >
                👥 Member List
              </Text>
              <Flex
                border={'1px solid'}
                borderRadius={10}
                p={2}
              >
                <Table size='md'>
                  <Thead>
                    <Tr>
                      <Th>Address</Th>
                      <Th>Token Amount</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {memberList.map((member) => {
                      return (
                        <Tr key={member.address}>
                          <Td>{shortenAddress(member.address)}</Td>
                          <Td>{member.tokenAmount}</Td>
                        </Tr>
                      )
                    })}
                  </Tbody>
                  <Tfoot>
                    <Tr>
                      <Th>Address</Th>
                      <Th>Token Amount</Th>
                    </Tr>
                  </Tfoot>
                </Table>
              </Flex>
            </Flex>

            {/* votes */}
            <Flex
              direction={'column'}
              align={'center'}
              justify={'center'}
              w={'100%'}
              p={10}
            >
              <Text
                letterSpacing={1}
                fontWeight={'bold'}
                fontSize={'3xl'}
                as={'h2'}
                p={5}
              >
                🚀 Active Proposals
              </Text>
              <FormControl
                onSubmit={async (e) => {
                  e.preventDefault()
                  e.stopPropagation()

                  // before we do async things, we want to disable the button to prevent double clicks
                  setIsVoting(true)

                  // lets get the votes from the form for the values
                  const votes = proposals.map((proposal) => {
                    const voteResult = {
                      proposalId: proposal.proposalId,
                      // abstain by default
                      vote: 2
                    }
                    proposal.votes.forEach((vote) => {
                      const elem = document.getElementById(
                        proposal.proposalId + '-' + vote.type
                      )

                      if (elem.checked) {
                        voteResult.vote = vote.type
                      }
                    })
                    return voteResult
                  })

                  // first we need to make sure the user delegates their token to vote
                  try {
                    // we'll check if the wallet still needs to delegate their tokens before they can vote
                    const delegation = await tokenModule.getDelegationOf(address)
                    // if the delegation is the 0x0 address that means they have not delegated their governance tokens yet
                    if (delegation === ethers.constants.AddressZero) {
                      // if they haven't delegated their tokens yet, we'll have them delegate them before voting
                      await tokenModule.delegateTo(address)
                    }
                    // then we need to vote on the proposals
                    try {
                      await Promise.all(
                        votes.map(async (vote) => {
                          // before voting we first need to check whether the proposal is open for voting
                          // we first need to get the latest state of the proposal
                          const proposal = await voteModule.get(vote.proposalId)
                          // then we check if the proposal is open for voting (state === 1 means it is open)
                          if (proposal.state === 1) {
                            // if it is open for voting, we'll vote on it
                            return voteModule.vote(vote.proposalId, vote.vote)
                          }
                          // if the proposal is not open for voting we just return nothing, letting us continue
                        })
                      )
                      try {
                        // if any of the propsals are ready to be executed we'll need to execute them
                        // a proposal is ready to be executed if it is in state 4
                        await Promise.all(
                          votes.map(async (vote) => {
                            // we'll first get the latest state of the proposal again, since we may have just voted before
                            const proposal = await voteModule.get(
                              vote.proposalId
                            )

                            // if the state is in state 4 (meaning that it is ready to be executed), we'll execute the proposal
                            if (proposal.state === 4) {
                              return voteModule.execute(vote.proposalId)
                            }
                          })
                        )
                        // if we get here that means we successfully voted, so let's set the "hasVoted" state to true
                        setHasVoted(true)
                        // and log out a success message
                        console.log('successfully voted')
                      } catch (err) {
                        console.error('failed to execute votes', err)
                      }
                    } catch (err) {
                      console.error('failed to vote', err)
                    }
                  } catch (err) {
                    console.error('failed to delegate tokens')
                  } finally {
                    // in *either* case we need to set the isVoting state to false to enable the button again
                    setIsVoting(false)
                  }
                }}
              >
                {proposals.map((proposal, index) => (
                  <Flex
                    key={proposal.proposalId}
                    border={'1px solid'}
                    borderRadius={10}
                    direction={'column'}
                    p={2}
                    mb={2}
                  >
                    <FormLabel>{proposal.description}</FormLabel>
                    <RadioGroup>
                      {proposal.votes.map((vote) => (
                        <Box key={vote.type}>
                          <Radio
                            defaultChecked={vote.type === 2}
                            value={vote.type}
                            name={proposal.proposalId}
                          >
                            {vote.label}
                          </Radio>
                        </Box>
                      ))}
                    </RadioGroup>
                  </Flex>
                ))}
                <Flex
                  direction={'column'}
                  align={'center'}
                  justify={'center'}
                  w={'100%'}
                >
                  <Button disabled={isVoting || hasVoted} type="submit">
                    {isVoting
                      ? 'Voting...'
                      : hasVoted
                        ? 'You Already Voted'
                        : 'Submit Votes'}
                  </Button>
                  <Text fontSize='xs' mt={2}>
                    This will trigger multiple transactions that you will need to
                    sign.
                  </Text>
                </Flex>
              </FormControl>
            </Flex>
          </Flex>
        </Flex>
      )
    }
  }

  return (
    <Layout
      title={TITLE}
      contract={[
        {
          contract: DEPLOY.BUNDLE_DROP_ADDRESS,
          title: 'Bundle contract'
        },
        {
          contract: DEPLOY.TOKEN_MODULE_ADDRESS,
          title: 'Token contract'
        },
        {
          contract: DEPLOY.VOTING_MODULE_ADDRESS,
          title: 'Voting contract'
        }
      ]}
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
      >

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
