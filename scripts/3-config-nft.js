import sdk from './1-initialize-sdk.js'
import { readFileSync } from 'fs'
import DEPLOY from './index.js'

const bundleDrop = sdk.getBundleDropModule(DEPLOY.BUNDLE_DROP_ADDRESS);

(async () => {
  try {
    await bundleDrop.createBatch([
      {
        name: 'The Supreme Taco',
        description: 'This NFT will give you access to TacoDAO!',
        image: readFileSync('public/the-supreme-taco.png')
      }
    ])
    console.log('✅ Successfully created a new NFT in the drop!')
  } catch (error) {
    console.error('failed to create the new NFT', error)
  }
})()
