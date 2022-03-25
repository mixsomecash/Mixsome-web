import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { useMoralis } from 'react-moralis'
import { FeatureCard } from './FeatureCard'

const Features = () => {
  const { Moralis, isInitialized, account, isAuthenticated } = useMoralis()

  async function likeFeature(id) {
    /* like a feature */

    const FeatureObject = await Moralis.Object.extend('Feature')
    const query = new Moralis.Query(FeatureObject)
    query.equalTo('objectId', id)
    const result = await query.find()
    let response = { likes: result[0].attributes.likes, isLiked: false }

    if (account !== null) {
      const supporterArray = result[0].attributes.supporters
      if (!supporterArray.includes(account)) {
        console.log(`like`)
        result[0].set('likes', result[0].attributes.likes + 1)
        result[0].addUnique('supporters', account)
        result[0].save()
        response = { likes: result[0].attributes.likes, isLiked: true }
      } else {
        console.log(`dislike`)
        result[0].set('likes', result[0].attributes.likes - 1)
        result[0].remove('supporters', account)
        result[0].save()
        response = { likes: result[0].attributes.likes, isLiked: false }
      }
    }
    return JSON.stringify(response)
  }

  const getAllFeatures = async () => {
    if (!isInitialized) return
    const query = await new Moralis.Query('Feature')
    const features = await query.find()

    features.forEach(x => console.log(x))

    const listItems = features.map(number => (
      <li>
        <FeatureCard
          parentMethod={() => likeFeature(number.id)}
          title={number.attributes.title}
          likes={number.attributes.likes}
          isLiked={number.attributes.supporters.includes(account)}
          description={number.attributes.description}
        />
      </li>
    ))
    ReactDOM.render(
      <ul>
        <li>{listItems}</li>
      </ul>,
      document.getElementById('here'),
    )
  }

  const addFeature = async () => {
    const FeatureObject = await Moralis.Object.extend('Feature')
    const feature = new FeatureObject()
    const featureTitle = (document.getElementById('featureTitle') as HTMLInputElement).value
    const featureDescription = (document.getElementById('featureDescription') as HTMLInputElement)
      .value
    console.log(featureTitle)
    console.log(featureDescription)
    console.log(account)
    feature.set('title', featureTitle)
    feature.set('description', featureDescription)
    feature.set('contributor', account)
    feature.set('likes', 1)
    feature.addUnique('supporters', account)
    feature.save()
  }

  useEffect(() => {
    getAllFeatures()
  })

  return (
    <div className="font-mono text-center">
      <input type="text" id="featureTitle" />
      <input type="text" id="featureDescription" />
      <button type="submit" onClick={addFeature}>
        new Feature
      </button>
      <div id="here"></div>
    </div>
  )
}

export default Features
