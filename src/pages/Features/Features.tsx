import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ReactDOM from 'react-dom'
import { useMoralis } from 'react-moralis'

console.log('test')

const Features = () => {
  const { Moralis, isInitialized, account, isAuthenticated } = useMoralis()
  const getAllFeatures = async () => {
    if (!isInitialized) return
    const query = await new Moralis.Query('Feature')
    const features = await query.find()

    features.forEach(x => console.log(x.attributes))

    const listItems = features.map(number => <li>{number.attributes.contributor}</li>)
    ReactDOM.render(<ul>{listItems}</ul>, document.getElementById('here'))

    /* const existingFeatures = features.map(((item) => (
      <div key={item.attributes.contributor} className="post">
        <h3>{item.attributes.contributor} - {item.attributes.contributor}</h3>
        <p>{item.attributes.contributor}</p>
      </div>
    )))} */
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
    feature.addUnique('supporter', account)
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
