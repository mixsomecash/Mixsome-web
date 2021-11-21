import React, { useState } from 'react'
import { useMoralis } from 'react-moralis'
import { networks } from '../services/constants'

// import { Content } from './content'

const Dex = () => {
  const { Moralis } = useMoralis()

  // NOTE: This object is not up to date in current version!!
  console.log(Moralis)

  const [currentNetwork, setCurrentNetwork] = useState(networks[0].path)

  const handleClick = (event, path) => {
    event.preventDefault()
    setCurrentNetwork(path)
  }

  const [modal, setModal] = useState(false)

  const handleModal = value => {
    setModal(value)
  }

  return (
    <article className="bg-white ring-1 rounded mx-auto py-3.5 px-5 lg:w-1/2 md:w-1/3">
      <header className="mb-3">
        <h1 className="text-center">DEX PAGE</h1>
      </header>

      <section className="grid grid-cols-6 gap-3">
        <div className="text-center col-start-1 col-end-4">
          <a
            className={networks[0].path === currentNetwork ? 'underline' : ''}
            href={`${networks[0].path}`}
            onClick={event => handleClick(event, networks[0].path)}
          >
            {networks[0].title}
          </a>
        </div>
        <div className="text-center col-start-4 col-end-7">
          <a
            className={networks[1].path === currentNetwork ? 'underline' : ''}
            href={`${networks[1].path}`}
            onClick={event => handleClick(event, networks[1].path)}
          >
            {networks[1].title}
          </a>
        </div>
        <div className="col-start-1 col-span-6">From</div>
        <div className="col-start-1 col-end-5">
          <input className="border border-1-light rounded w-full p-2" type="text" />
        </div>
        <div className="text-right col-start-5 col-end-7">
          <button
            onClick={() => handleModal(true)}
            className="w-full bg-emerald rounded p-2"
            type="button"
          >
            {`${'ETH'} `}
            <i className="fa fa-chevron-down"></i>
          </button>
        </div>
        <div className="mt-2 col-start-1 col-span-6">To</div>
        <div className="col-start-1 col-end-5">
          <input disabled className="border border-1-light rounded w-full p-2" type="text" />
        </div>
        <div className="text-right col-start-5 col-end-7">
          <button
            onClick={() => handleModal(true)}
            className="w-full bg-emerald rounded p-2"
            type="button"
          >
            {`${'Select a token'} `}
            <i className="fa fa-chevron-down"></i>
          </button>
        </div>
      </section>

      <section
        className={`${
          modal ? 'block' : 'hidden'
        } fixed z-10 left-0 top-0 w-full h-full overflow-auto bg-light bg-opacity-40 text-center`}
      >
        <div className="divide-y divide-light mx-auto w-1/3 bg-white rounded h-1/3 mt-40">
          <div className="grid grid-cols-6 gap-2">
            <div className="font-bold text-left col-start-1 col-end-6 p-2 pl-4">
              <h1>Select a token</h1>
            </div>
            <div className="col-start-6 col-end-7">
              <button
                onClick={() => handleModal(false)}
                className="hover:bg-emerald rounded w-full p-2"
                type="button"
              >
                <i className="fa fa-close"></i>
              </button>
            </div>
          </div>
          <div>
            <h1 className="mt-3">List of tokens</h1>
          </div>
        </div>
      </section>

      <footer className="text-center mt-5">
        <h1>Enter an amount..</h1>
      </footer>
    </article>
  )
}

export default Dex
