import React, { useState } from 'react'
import { useMoralis } from 'react-moralis'
// import validate from '../../../utils/Validate'

import { WhalesAlertTitle } from './Title'
import { Address } from './Address'
import { AlertMethod } from './AlertMethod'
import { Error } from './Error'
import { ActionControls } from './ActionControls'

const WhalesAlert: React.FC = () => {
  const { Moralis } = useMoralis()

  const [address, setAddress] = useState<string>('')
  const [alertMethod, setAlertMethod] = useState<string>('telegram')
  const [error, setError] = useState<string>('')

  const submitButtonDisabled = address === ''
  const resetButtonDisabled = address === '' && alertMethod === 'telegram'

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setAddress(event.target.value)
  const handleAlertMethodChange = (value: string) => setAlertMethod(value)

  const submit = async () => {
    const params = {
      address,
      alertMethod,
    }
    const result = await Moralis.Cloud.run('whales_alert', params)
    if (result.error) setError(result.error)
  }

  const reset = () => {
    setAddress('')
    setAlertMethod('telegram')
    setError('')
  }

  return (
    <>
      <WhalesAlertTitle />

      <div className="whales-alert-wrapper">
        <Address address={address} onChange={handleAddressChange} />

        <AlertMethod alertMethod={alertMethod} onChange={handleAlertMethodChange} />

        {error && <Error error={error} />}

        <ActionControls
          submitButtonDisabled={submitButtonDisabled}
          resetButtonDisabled={resetButtonDisabled}
          submit={submit}
          reset={reset}
        />
      </div>
    </>
  )
}

export default WhalesAlert
