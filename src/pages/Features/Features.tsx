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
    if (account != null) {
      const supporterArray = result[0].attributes.supporters
      if (!supporterArray.includes(account)) {
        result[0].set('likes', result[0].attributes.likes + 1)
        result[0].addUnique('supporters', account)
        result[0].save()
        response = { likes: result[0].attributes.likes, isLiked: true }
      } else {
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

  const getAllFeatures = async newAdded => {
    if (!isInitialized) return
    const query = await new Moralis.Query('Feature')
    const features = await query.find()

    function compare(a, b) {
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

    const listItems = filteredFeatureArray.map(number => (
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
        {newAdded === undefined ? (
          <></>
        ) : (
          <li>
            <FeatureCard
              parentMethod={() => likeFeature(newAdded.id)}
              title={newAdded.title}
              likes={1}
              isLiked
              description={newAdded.description}
            />
          </li>
        )}
        <li>{listItems}</li>
      </ul>,
      document.getElementById('here'),
    )
  }

  useEffect(() => {
    getAllFeatures(undefined)
  })

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
      <div id="here"></div>
    </div>
  )
}

export default Features
