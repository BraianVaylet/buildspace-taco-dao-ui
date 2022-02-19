import sdk from './1-initialize-sdk.js'
import { readFileSync } from 'fs'

const bundleDrop = sdk.getBundleDropModule('0xaaeC024C880504aa099eB286CCfef23ABBaE8a39');

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
