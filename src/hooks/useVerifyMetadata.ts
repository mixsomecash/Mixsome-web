import { useState } from 'react'
import { useIPFS } from './useIPFS'

export const useVerifyMetadata = () => {
  const { resolveLink } = useIPFS()
  const [results, setResults] = useState({})

  function setMetadata(NFTprop, metadata) {
    const NFT = NFTprop
    NFT.metadata = metadata
    if (metadata?.image) NFT.image = resolveLink(metadata.image)
    if (metadata && !results[NFT.token_uri]) setResults({ ...results, [NFT.token_uri]: NFT })
  }

  async function getMetadata(NFT) {
    if (!NFT.token_uri || !NFT.token_uri.includes('://')) {
      console.log('getMetadata() Invalid URI:', { URI: NFT.token_uri, NFT })
      return
    }
    fetch(NFT.token_uri)
      .then(res => res.json())
      .then(metadata => {
        if (!metadata) {
          console.error('useVerifyMetadata.getMetadata() No Metadata found on URI:', {
            URI: NFT.token_uri,
            NFT,
          })
        } else if (metadata?.detail && metadata.detail.includes('Request was throttled')) {
          console.warn(
            `useVerifyMetadata.getMetadata() Bad Result for:${NFT.token_uri}  Will retry later`,
            { results, metadata },
          )
          setTimeout(() => {
            getMetadata(NFT)
          }, 1000)
        } else {
          setMetadata(NFT, metadata)

          console.log(`getMetadata() Late-load for NFT Metadata ${NFT.token_uri}`, { metadata })
        }
      })
      .catch(err => {
        console.error('useVerifyMetadata.getMetadata() Error Caught:', {
          err,
          NFT,
          URI: NFT.token_uri,
        })
      })
  }

  function verifyMetadata(NFT) {
    if (NFT.metadata) return NFT
    getMetadata(NFT)
    return results?.[NFT.token_uri] ? results?.[NFT.token_uri] : NFT
  }

  return { verifyMetadata }
}
