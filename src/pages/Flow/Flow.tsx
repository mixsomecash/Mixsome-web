import React from 'react'
import { useParams, Redirect } from 'react-router-dom'

import DefiShark from './DefiShark'
import DefiCrab from './DefiCrab'
import Invest from './Invest'

const Flow = () => {
  const { id } = useParams<{ id: string }>()

  if (id === '1') {
    return <Invest />
  }

  if (id === '2') {
    return <DefiCrab />
  }

  return <Redirect to="/" />
}

export default Flow
