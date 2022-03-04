import sdk from './1-initialize-sdk.js'
import DEPLOY from './index.js'

// In order to deploy the new contract we need our old friend the app module again.
const app = sdk.getAppModule(DEPLOY.APP_ADDRESS);

(async () => {
  try {
    // Deploy a standard ERC-20, which is the standard that all massive coins on Ethereum adopt.
    // ThirdWeb Contract: https://github.com/thirdweb-dev/contracts/blob/v1/contracts/Coin.sol
    const tokenModule = await app.deployTokenModule({
      // What's your token's name? Ex. "Ethereum"
      name: 'TacoDAO Governance Token',
      // What's your token's symbol? Ex. "ETH"
      symbol: 'TACO'
    })
    console.log(
      '✅ Successfully deployed token module, address:',
      tokenModule.address
    )
  } catch (error) {
    console.error('failed to deploy token module', error)
  }
})()
