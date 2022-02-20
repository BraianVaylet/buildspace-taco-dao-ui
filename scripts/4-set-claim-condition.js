import sdk from './1-initialize-sdk.js'
import DEPLOY from './index.js'

const bundleDrop = sdk.getBundleDropModule(DEPLOY.BUNDLE_DROP_ADDRESS);

(async () => {
  try {
    const claimConditionFactory = bundleDrop.getClaimConditionFactory()
    // Specify conditions.
    claimConditionFactory.newClaimPhase({
      startTime: new Date(), // es el momento en que los usuarios pueden comenzar a acuñar NFT.
      maxQuantity: 100_000, // es el número máximo de NFT de membresía que se pueden acuñar.
      maxQuantityPerTransaction: 1 // especifica cuántos tokens puede reclamar alguien en una sola transacción.
    })

    // Nuestra membresía NFT tiene una tokenIdde 0ya que es el primer token en nuestro contrato ERC-1155.
    // Con ERC-1155 podemos hacer que varias personas acumulen el mismo NFT. En este caso, todos acuñan un NFT con id 0.
    await bundleDrop.setClaimCondition(0, claimConditionFactory)
    console.log('✅ Successfully set claim condition on bundle drop:', bundleDrop.address)
  } catch (error) {
    console.error('Failed to set claim condition', error)
  }
})()
