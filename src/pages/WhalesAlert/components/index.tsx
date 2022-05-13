import React, { useState } from 'react'
import { useMoralis } from 'react-moralis'
// import validate from '../../../utils/Validate'

import { WhalesAlertTitle } from './Title'
import { Address } from './Address'
import { AlertMethod } from './AlertMethod'
import { PhoneNumber } from './PhoneNumber'
import { Error } from './Error'
import { Result } from './Result'
import { ActionControls } from './ActionControls'

const WhalesAlert: React.FC = () => {
  const { Moralis } = useMoralis()

  const [address, setAddress] = useState<string>('')
  const [alertMethod, setAlertMethod] = useState<string>('telegram')
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [result, setResult] = useState<string>('')

  const submitButtonDisabled = address === '' || phoneNumber === ''
  const resetButtonDisabled = address === '' && alertMethod === 'telegram'

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setAddress(event.target.value)
  const handleAlertMethodChange = (value: string) => setAlertMethod(value)
  const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setPhoneNumber(event.target.value)

  const reset = () => {
    setAddress('')
    setAlertMethod('telegram')
    setPhoneNumber('')
    setError('')
  }

  const submit = async () => {
    if (alertMethod !== 'telegram' || address === '' || phoneNumber === '') return
    const params = {
      address,
      alertMethod,
      phoneNumber,
    }
    const response = await Moralis.Cloud.run('whales_alert', params)
    if (response?.backendError) setError(response.message)
    setResult(response)
    reset()
    console.log(response)
  }

  return (
    <>
      <WhalesAlertTitle />

      <div className="whales-alert-wrapper">
        <Address address={address} onChange={handleAddressChange} />

        <AlertMethod alertMethod={alertMethod} onChange={handleAlertMethodChange} />

        <PhoneNumber phoneNumber={phoneNumber} onChange={handlePhoneNumberChange} />

        {result && <Result result={result} />}

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
