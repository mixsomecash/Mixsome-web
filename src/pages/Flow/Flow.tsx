import React from 'react'
import { useParams, Redirect } from 'react-router-dom'

import DefiShark from './DefiShark'
import DefiCrab from './DefiCrab'

const Flow = () => {
  const { id } = useParams<{ id: string }>()

  if (id === '1') {
    return <DefiShark />
  }

  if (id === '2') {
    return <DefiCrab />
  }

  return <Redirect to="/" />
}

export default Flow
