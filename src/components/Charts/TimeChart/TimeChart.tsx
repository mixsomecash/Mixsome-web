import React, { useState, useEffect } from 'react'
import { Button, ErrorMessage, Loader } from 'components'
import LineChart from '../LineChart/LineChart'
import { TimeRecord } from './types'

const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000
const DEFAULT_SELECTED_TIME = '12H'
const timeButtons: TimeButton[] = [
  {
    label: '12H',
    time: DAY_IN_MILLISECONDS / 2,
  },
  {
    label: '7D',
    time: 7 * DAY_IN_MILLISECONDS,
  },
  {
    label: '30D',
    time: 30 * DAY_IN_MILLISECONDS,
  },
  {
    label: '6M',
    time: 6 * 30 * DAY_IN_MILLISECONDS,
  },
]

type TimeButton = {
  label: string
  time: number
}

type Props = {
  getData: (fromTime: number) => Promise<TimeRecord[] | null>
  dataLabel: string
}

const TimeChart = ({ getData, dataLabel }: Props) => {
  const [records, setRecords] = useState<TimeRecord[] | null>(null)
  const [selectedTimeLabel, setSelectedTimeLabel] = useState<string>(DEFAULT_SELECTED_TIME)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      const selectedTimeRange = timeButtons.find(button => button.label === selectedTimeLabel)?.time
      if (!selectedTimeRange) {
        return
      }
      const currentTime = Date.now()
      const data = await getData(currentTime - selectedTimeRange)
      if (data) {
        setRecords(data)
      } else {
        setRecords(null)
      }
      setIsLoading(false)
    })()
  }, [selectedTimeLabel, getData])

  return (
    <div>
      <div className="chart__container my-4">
        {records && !isLoading && (
          <LineChart
            labels={records.map(record => record.date)}
            data={records.map(record => record.value)}
            dataLabel={dataLabel}
          />
        )}
        {isLoading && (
          <div className="text-center">
            <Loader />
          </div>
        )}
        {!isLoading && !records && (
          <ErrorMessage message="An error occurred while getting chart data" />
        )}
      </div>
      <div className="text-center mb-2">
        {timeButtons.map(timeButton => (
          <Button
            onClick={() => setSelectedTimeLabel(timeButton.label)}
            text={timeButton.label}
            invert={timeButton.label !== selectedTimeLabel}
            key={timeButton.label}
          />
        ))}
      </div>
    </div>
  )
}

export default TimeChart
