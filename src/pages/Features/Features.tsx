import React, { useEffect, useState, useCallback } from 'react'
import { message } from 'antd'
import { useMoralis } from 'react-moralis'
import { FeatureCard } from './FeatureCard'
import ModalComponent from './submitFeature'

const Features = () => {
  const { Moralis, isInitialized, account } = useMoralis()
  const [filteredFeatures, setFilteredFeatures] = useState<any[]>([])

  async function likeFeature(id) {
    const FeatureObject = await Moralis.Object.extend('Feature')
    const query = new Moralis.Query(FeatureObject)
    query.equalTo('objectId', id)
    const result = await query.find()
    const attributesInfo = result[0].attributes
    let response = { likes: attributesInfo.likes, isLiked: false }
    if (account != null) {
      const supporterArray = attributesInfo.supporters
      if (!supporterArray.includes(account)) {
        result[0].set('likes', attributesInfo.likes + 1)
        result[0].addUnique('supporters', account)
        result[0].save()
        response = { likes: attributesInfo.likes + 1, isLiked: true }
      } else {
        result[0].set('likes', attributesInfo.likes - 1)
        result[0].remove('supporters', account)
        result[0].save()
        response = { likes: attributesInfo.likes - 1, isLiked: false }
      }
    } else {
      message.info('Connect your wallet to like a feature')
    }
    return JSON.stringify(response)
  }

  const getAllFeatures = useCallback(async () => {
    if (!isInitialized) return
    const query = await new Moralis.Query('Feature')
    const features = await query.find()

    const compare = (a, b) => {
      if (a.attributes.supporters.length > b.attributes.supporters.length) {
        return -1
      }
      if (a.attributes.supporters.length < b.attributes.supporters.length) {
        return 1
      }
      return 0
    }
    features.sort(compare)

    const filteredFeatureArray = features.filter(function (item) {
      if (item.attributes.isDisplayed) {
        return true
      }
      return false
    })

    setFilteredFeatures(filteredFeatureArray)
  }, [Moralis, isInitialized])

  useEffect(() => {
    getAllFeatures()
  }, [getAllFeatures])

  return (
    <div className="font-mono text-center">
      <div
        className="submit-window"
        style={{
          width: '455px',
          height: '180px',
          backgroundColor: '#323232',
          position: 'fixed',
        }}
      >
        <div className="p-5 d-none">
          <p
            className="text-left"
            style={{
              color: '#FBFBFB',
              fontFamily: 'DM Sans',
              maxWidth: '246px',
              fontSize: '18px',
              lineHeight: '23px',
            }}
          >
            What new features would you like to see for Mixsome?
          </p>
          <div className="pt-3">
            <ModalComponent></ModalComponent>
          </div>
        </div>
      </div>
      <div id="here">
        <ul>
          {filteredFeatures &&
            filteredFeatures.map(number => (
              <li key={number.id}>
                <FeatureCard
                  parentMethod={() => likeFeature(number.id)}
                  title={number.attributes.title}
                  likes={number.attributes.likes}
                  isLiked={number.attributes.supporters.includes(account)}
                  description={number.attributes.description}
                />
              </li>
            ))}
        </ul>
      </div>
    </div>
  )
}

export default Features
