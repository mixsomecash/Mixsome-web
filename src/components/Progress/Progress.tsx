import React from 'react'

type Props = { completed: number }

const Progress = ({ completed }: Props) => {
  const percents = completed > 100 ? 100 : completed

  return (
    <div className="flex flex-wrap items-center py-5">
      <div className="flex-1 w-full h-2.5 bg-white">
        <div className="bg-green h-2.5" style={{ width: `${percents}%` }}></div>
      </div>
      <div className="opacity-60 pl-3">{percents}%</div>
    </div>
  )
}

export default Progress
