import { useMoralis } from 'react-moralis'

export const useSubmitFeature = () => {
  const { Moralis, account } = useMoralis()

  const approve = async (title: string, description: string) => {
    if (account != null) {
      const FeatureObject = await Moralis.Object.extend('Feature')
      const feature = new FeatureObject()
      feature.set('title', title)
      feature.set('description', description)
      feature.set('contributor', account)
      feature.set('likes', 1)
      feature.set('isDisplayed', false)
      feature.addUnique('supporters', account)
      await feature.save()
    }
  }

  return { approve }
}
