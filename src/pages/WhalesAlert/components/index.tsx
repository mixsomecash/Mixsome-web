import React, { useState } from 'react'
import { useMoralis } from 'react-moralis'
// import validate from '../../../utils/Validate'

import { WhalesAlertTitle } from './Title'
import { Address } from './Address'
import { AlertMethod } from './AlertMethod'
import { SyncHistorical } from './SyncHistorical'
import { Error } from './Error'
import { ActionControls } from './ActionControls'

const WhalesAlert: React.FC = () => {
  const { Moralis } = useMoralis()

  const [address, setAddress] = useState<string>('')
  const [alertMethod, setAlertMethod] = useState<string>('telegram')
  const [syncHistorical, setSyncHistorical] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const submitButtonDisabled = address === ''
  const resetButtonDisabled = address === '' && alertMethod === 'telegram' && !syncHistorical

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setAddress(event.target.value)
  const handleAlertMethodChange = (value: string) => setAlertMethod(value)
  const handleSyncHistoricalChange = (value: boolean) => setSyncHistorical(value)

  const submit = async () => {
    const params = {
      address,
      alertMethod,
      syncHistorical,
    }
    const result = await Moralis.Cloud.run('whales_alert', params)
    if (result?.backendError) setError(result.message)
    console.log(result)
  }

  const reset = () => {
    setAddress('')
    setAlertMethod('telegram')
    setSyncHistorical(false)
    setError('')
  }

  return (
    <>
      <WhalesAlertTitle />

      <div className="whales-alert-wrapper">
        <Address address={address} onChange={handleAddressChange} />

        <AlertMethod alertMethod={alertMethod} onChange={handleAlertMethodChange} />

        <SyncHistorical value={syncHistorical} onChange={handleSyncHistoricalChange} />

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
