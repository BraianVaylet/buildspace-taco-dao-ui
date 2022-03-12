import React from 'react'
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Flex, Icon, IconButton, Image, Link, Text, Tooltip } from '@chakra-ui/react'
import logo from 'public/taco.png'
import { FaEthereum, FaGithub, FaLinkedin } from 'react-icons/fa'
import DEPLOY from 'utils'

const Home = () => {
  return (
    <Flex
      w={'100vw'}
      h={'100vh'}
      direction={'column'}
      align={'center'}
      justify={'center'}
      bgGradient='linear(to-l, yellow.400, yellow.700)'
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
            {"Hi 👋, I'm Braian"}
          </Text>
          <Image src={logo.src} alt={'taco logo'} w={200} />
          <Text
            as='h3'
            my={5}
            fontSize={'5xl'}
            fontWeight={600}
            letterSpacing={'.5px'}
          >
            Welcome to TACO DAO
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
      <Button
        mt={5}
        py={4}
        px={20}
        fontSize={'3xl'}
        fontStyle={'none'}
        as={Link}
        href='/panel'
      >
        Enter
      </Button>

      <Flex
        mt={100}
      >

        {[
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
        ].map((ctr) => (
          <Tooltip
            key={ctr.title}
            hasArrow
            label={ctr.title}
            bg={'gray.900'}
            color={'white'}>
            <IconButton
              mx={2}
              _hover={{
                cursor: 'pointer',
                color: 'yellow.100'
              }}
              as={Link}
              href={`https://rinkeby.etherscan.io/address/${ctr.contract}`}
              isExternal
              icon={<Icon as={FaEthereum} w={7} h={7} />}
            />
          </Tooltip>
        ))}
        <Tooltip hasArrow label={'linkedin'} bg={'gray.900'} color={'white'}>
          <IconButton
            mx={2}
            _hover={{
              cursor: 'pointer',
              color: 'yellow.100'
            }}
            as={Link}
            href={'https://www.linkedin.com/in/braianvaylet/'}
            isExternal
            icon={<Icon as={FaLinkedin} w={7} h={7} />}
          />
        </Tooltip>
        <Tooltip hasArrow label={'github'} bg={'gray.900'} color={'white'}>
          <IconButton
            mx={2}
            _hover={{
              cursor: 'pointer',
              color: 'yellow.100'
            }}
            as={Link}
            href={'https://github.com/BraianVaylet/buildspace-taco-dao-ui'}
            isExternal
            icon={<Icon as={FaGithub} w={7} h={7} />}
          />
        </Tooltip>
      </Flex>
    </Flex>
  )
}

export default Home
