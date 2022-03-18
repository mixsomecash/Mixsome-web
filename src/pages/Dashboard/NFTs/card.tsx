import React, { useState, useEffect } from 'react'
import { Card as AntdCard, Image, Tooltip, Layout } from 'antd'
import axios from 'axios'
import { FileSearchOutlined, SendOutlined, ShoppingCartOutlined } from '@ant-design/icons'

import { getExplorer } from '../../../utils/networks'
import { NftToken, SetVisibility, OpenNotification } from '../../../types/models/nft'

const { Meta } = AntdCard

interface CardProps {
  chainId: string | null
  nft: NftToken
  setVisibility: SetVisibility
  openNotification: OpenNotification
}

export const Card: React.FC<CardProps> = (props: CardProps) => {
  const { chainId, nft, setVisibility, openNotification } = props
  const [average, setAverage] = useState('N/A')
  const [floor, setFloor] = useState('N/A')

  useEffect(() => {
    console.log(`${nft.token_address} : ${nft.token_id}`)
    axios
      .get(`https://api.opensea.io/api/v1/asset/${nft.token_address}/${nft.token_id}/`)
      .then(function (response) {
        axios
          .get(`https://api.opensea.io/api/v1/collection/${response.data.collection.slug}/stats`)
          .then(function (response2) {
            const averagePrice = response2.data.stats.average_price
            setAverage(
              `${
                averagePrice % 1 === 0
                  ? averagePrice.toString()
                  : averagePrice.toString().slice(0, 3)
              } ETH`,
            )
            if (response2.data.stats.floor_price !== null) {
              const floorPrice = response2.data.stats.floor_price
              setFloor(
                `${
                  averagePrice % 1 === 0 ? floorPrice.toString() : floorPrice.toString().slice(0, 3)
                } ETH`,
              )
            }
            console.log(
              `average_price - ${response2.data.stats.average_price} \nfloor_price - ${response2.data.stats.floor_price}`,
            )
          })
          .catch(function (error) {
            // handle error
            console.log(error)
          })
          .then(function () {
            // always executed
          })
      })
      .catch(function (error) {
        // handle error
        console.log(error)
      })
      .then(function () {
        // always executed
      })
  }, [nft])

  const viewOnBlockExplorer = (_chainId, token_address) => {
    if (_chainId) window.open(`${getExplorer(_chainId)}address/${token_address}`, '_blank')
    return undefined
  }

  return (
    <AntdCard
      hoverable
      actions={[
        <Tooltip title="View On Blockexplorer">
          <FileSearchOutlined
            style={{ color: '#61F38E' }}
            onClick={() => viewOnBlockExplorer(chainId, nft.token_address)}
          />
        </Tooltip>,
        <Tooltip title="Transfer NFT">
          <SendOutlined style={{ color: '#61F38E' }} onClick={() => setVisibility(true)} />
        </Tooltip>,
        <Tooltip title="Sell On OpenSea">
          <ShoppingCartOutlined
            style={{ color: '#61F38E' }}
            onClick={() => openNotification('topLeft')}
          />
        </Tooltip>,
      ]}
      style={{ width: 300, border: '2px solid #e7eaf3' }}
      cover={
        <Image
          preview={false}
          src={nft?.image || 'error'}
          fallback="data:image/png;base64,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"
          alt=""
          style={{ height: '300px' }}
        />
      }
      key={nft.token_id}
    >
      <Meta title={nft.name} description={nft.token_address}></Meta>
      <div
        className="pt-5"
        style={{ display: 'inline-flex', width: '100%', justifyContent: 'space-around' }}
      >
        <div className=" text-center">
          <h1 className=" font-bold text-24 xl:text-24 xl:leading-26">{average}</h1>
          <p className="opacity-40">Average Price</p>
        </div>
        <br />

        <div className=" px-1 text-center">
          <h1 className=" font-bold text-24 xl:text-24 xl:leading-26">{floor}</h1>
          <p className="opacity-40">Floor Price</p>
        </div>
      </div>
    </AntdCard>
  )
}
