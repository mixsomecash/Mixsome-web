import React from 'react'
import { Button } from 'antd'

interface Props {
  submitButtonDisabled: boolean
  resetButtonDisabled: boolean
  submit: () => void
  reset: () => void
}

const ActionControls = ({ submitButtonDisabled, resetButtonDisabled, submit, reset }: Props) => (
  <div className="whales-alert-buttons-box">
    <Button disabled={submitButtonDisabled} onClick={submit} type="primary">
      Submit
    </Button>
    <Button disabled={resetButtonDisabled} onClick={reset}>
      Reset
    </Button>
  </div>
)

export { ActionControls }
