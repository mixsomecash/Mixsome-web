import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { message } from 'antd'
import { useMoralis } from 'react-moralis'
import { FeatureCard } from './FeatureCard'
import ModalComponent from './submitFeature'

const Features = () => {
  const { Moralis, isInitialized, account, isAuthenticated } = useMoralis()

  async function likeFeature(id) {
    /* like a feature */

    const FeatureObject = await Moralis.Object.extend('Feature')
    const query = new Moralis.Query(FeatureObject)
    query.equalTo('objectId', id)
    const result = await query.find()
    let response = { likes: result[0].attributes.likes, isLiked: false }
    console.log(account)

    if (account != null) {
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
    } else {
      message.info('Connect your wallet to like a feature')
    }
    return JSON.stringify(response)
  }

  const getAllFeatures = async () => {
    if (!isInitialized) return
    const query = await new Moralis.Query('Feature')
    const features = await query.find()

    features.forEach(x => console.log(x.attributes.supporters.includes(account)))

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

  useEffect(() => {
    getAllFeatures()
  })

  return (
    <div className="font-mono text-center">
      <div
        style={{
          width: '455px',
          height: '180px',
          backgroundColor: '#323232',
          position: 'fixed',
          right: '0px',
        }}
      >
        <div className="p-5">
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

      <div id="here"></div>
    </div>
  )
}

export default Features
