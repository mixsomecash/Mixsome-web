import React, { ChangeEvent, useState } from 'react'
import { useToken } from 'hooks/useToken'
import { Button } from 'components'

const POOL_ADDRESS = '0x75EFCeb7Ba78CF4C795eDa462d111baEBf707faE'

const KnowledgeSharing = () => {
  const [userInput, setUserInput] = useState('')
  const { tokenDetails, approve } = useToken({ address: userInput })

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value)
  }

  const handleButtonClick = () => {
    approve(POOL_ADDRESS, 100)
  }

  return (
    <div>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
        onChange={handleInputChange}
      />
      {tokenDetails && (
        <>
          <div className="my-4">
            {tokenDetails.symbol} | {tokenDetails.name}
          </div>
          <Button text="Approve" onClick={handleButtonClick} />
        </>
      )}
    </div>
  )
}

export default KnowledgeSharing
