import React, { ReactNode } from 'react'
import ReactModal from 'react-modal'

type Props = {
  show: boolean
  withCloseButton?: boolean
  children: ReactNode
  onClose?: () => void
}

const Modal = ({ show, children, withCloseButton, onClose }: Props) => {
  if (!show) return null

  return (
    <ReactModal
      isOpen={show}
      ariaHideApp={false}
      className="absolute top-1/2 left-1/2 w-full md:w-1/2 xl:w-1/3 transform -translate-x-1/2 -translate-y-1/2 outline-none border"
    >
      <div className="bg-white w-full">
        {withCloseButton && (
          <div className="flex w-full">
            <div className="ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="m-2.5 w-12 h-12 hover:bg-green focus:outline-none flex items-center justify-center"
              >
                <img src="/images/icons/close.svg" className="w-8 h-8" alt="" />
              </button>
            </div>
          </div>
        )}
        <div className="px-10 pb-10">{children}</div>
      </div>
    </ReactModal>
  )
}

export default Modal
