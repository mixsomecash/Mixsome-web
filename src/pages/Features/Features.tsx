import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useMoralis } from 'react-moralis'

console.log('test')

const Features = () => {
  const { Moralis, isInitialized, account, isAuthenticated } = useMoralis()
  const fetchMemberCount = async () => {
    if (!isInitialized) return
    const query = await new Moralis.Query('Feature')
    const features = await query.find()
    console.log(features)
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
    fetchMemberCount()
  })

  return (
    <div className="font-mono text-center">
      <input type="text" id="featureTitle" />
      <input type="text" id="featureDescription" />
      <button type="submit" onClick={addFeature}>
        new Feature
      </button>
    </div>
  )
}

export default Features
