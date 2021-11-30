import React, { useEffect, useState, useContext, useMemo, FormEvent } from 'react'
import { useMoralis } from 'react-moralis'
import { useGetPoolData, useGetApprovalStatus, useGetTotalStaked, useGetApproval } from 'hooks'
import { getAccountAddress, getSigner, toEth } from 'clients/ethereum'

import { Button, ErrorMessage, Loader } from 'components'

import { DashboardNetwork } from '../types'

type NFT = {
  contract_type: string
  name: string
  symbol: string
  token_address: string
  amount: number
  token_uri: string
}

type Props = { networkId: DashboardNetwork }

const NFTs = ({ networkId }: Props) => {
  const { user, isAuthenticated, web3, Moralis } = useMoralis()
  const [userAddress, setUserAddress] = useState('0x')
  const [nfts, setNFTs] = useState<Array<NFT>>([])
  const [isLoading, setIsloading] = useState(true)
  const [searchTerm, setSearchTerm] = useState<string>('')

  useEffect(() => {
    // Run! Like go get some data from an API.
    const get = async () => {
      setIsloading(true)
      const connector = await Moralis.Web3.enable()
      setUserAddress('0')
      console.log(await user!.attributes.ethAddress)
      const response = await Moralis.Web3.getNFTs({
        chain: '0x1',
        address: await user!.attributes.ethAddress,
      })
      console.log(response)

      const transaction = await Moralis.Web3API.token.getTokenIdMetadata({
        address: '0x7bd29408f11d2bfc23c34f18275bbf23bb716bc7',
        token_id: '1',
        chain: '0x1',
      })

      // const image = JSON.parse(transaction.metadata).nft.image

      console.log(transaction.metadata) // inside metadata unpack json and get link for image
      //  console.log(image)
      // const options = { address: '0x495f947276749ce646f68ac8c248420045cb7b5e', chain: '0x1' }
      // const metaData = await Moralis.Web3API.token.getNFTMetadata(options as any)

      if (!response) return

      const mergedNFTsData = response.map(nft => {
        // const data = response.filter(
        //   NFTData => NFTData.name.replace(/ .*/, '').toLowerCase() === nft.name.toLowerCase(),
        // )[0]

        // if (!data) return null

        return {
          contract_type: nft.contract_type,
          name: nft.name,
          symbol: nft.symbol,
          token_address: nft.token_address,
          amount: nft.amount,
          token_uri: nft.token_uri,
        }
      })

      // setNFTs(mergedNFTsData)

      setIsloading(false)
    }
    get()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSearchChange = (event: FormEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget

    setSearchTerm(value)
  }

  const renderNFT = (nft: NFT, index: number) => {
    return (
      <tr key={index}>
        <td className="sticky-col">
          <div className="flex items-center text-left">
            <div className="w-2/4 px-3 text-14 xl:text-16">{nft.name}</div>
            <div className="w-1/4 mr-5">
              <span className="opacity-40 text-14 xl:text-16 mx-2">{nft.symbol.toUpperCase()}</span>
            </div>
          </div>
        </td>
        <td>
          <span className="font-mono text-14 xl:text-16">{nft.amount}</span>
        </td>
        <td>
          <span className="font-mono text-14 xl:text-16">{nft.contract_type}</span>
        </td>
        <td>
          <span className="font-mono text-14 xl:text-16">-</span>
        </td>
        <td>
          <span className="font-mono text-14 xl:text-16">-</span>
        </td>
        <td>
          <div className="flex justify-center">
            <Button
              text="Sell"
              invert
              disabled
              onClick={() => {
                return null
              }}
            />
            <div className="ml-2" />
            <Button
              text="Buy"
              disabled
              onClick={() => {
                return null
              }}
            />
          </div>
        </td>
      </tr>
    )
  }

  const renderNoSearchResults = () => {
    return (
      <tr className="w-full text-center">
        <td colSpan={6}>
          {isLoading && <Loader />}
          {!isLoading && (
            <span className="opacity-60">Sorry but tokens by search text not found :(</span>
          )}
        </td>
      </tr>
    )
  }

  const renderNFTs = () => {
    const filteredCoins = nfts.filter(nft => {
      return (
        nft?.name.toLowerCase().includes(searchTerm?.toLowerCase()) ||
        nft?.symbol.toLowerCase().includes(searchTerm?.toLowerCase())
      )
    })

    if (!filteredCoins.length) return renderNoSearchResults()

    return filteredCoins.map(renderNFT)
  }

  if (!isAuthenticated) {
    return <ErrorMessage message="Please connect to your wallet" />
  }

  return (
    <div className="w-full bg-white px-6 py-4 xl:px-12 xl:py-10">
      <div className="pb-10 xl:flex items-center">
        <p className="font-medium text-20 leading-26 my-4 xl:my-0 xl:text-32 xl:leading-42">
          My Balance
        </p>
        <input
          type="text"
          placeholder="Search by token name or symbol"
          className="border ml-auto p-4 w-full xl:w-1/3 lg:w-1/3 border-opacity-20 text-15"
          onChange={handleSearchChange}
        />
      </div>

      <div className="scrollable-table-wrapper">
        <table className="table-auto w-full xl:mt-10">
          <thead className="border-b border-black border-opacity-20 pb-10">
            <tr>
              <td className="sticky-col pr-4">
                <span className="opacity-60 text-14 xl:text-16">NFT</span>
              </td>
              <td className="pr-4">
                <span className="opacity-60 text-14 xl:text-16">Amount</span>
              </td>
              <td className="pr-4">
                <span className="opacity-60 text-14 xl:text-16">Standard</span>
              </td>
              <td className="pr-4">
                <span className="opacity-60 text-14 xl:text-16">Price Floor</span>
              </td>
              <td className="pr-4">
                <span className="opacity-60 text-14 xl:text-16">Etherscan</span>
              </td>
              <td className="text-center">
                <span className="opacity-60 text-14 xl:text-16">Action</span>
              </td>
            </tr>
          </thead>
          <tbody>{renderNFTs()}</tbody>
        </table>
      </div>
    </div>
  )
}

export default NFTs
