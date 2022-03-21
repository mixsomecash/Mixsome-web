import React, { useEffect, useRef } from 'react'
import { Chart, ChartConfiguration, registerables } from 'chart.js'

type Props = {
  labels: string[]
  data: number[]
  dataLabel: string
}

const LineChart = ({ labels, data, dataLabel }: Props) => {
  const chartRef = useRef<any>()

  useEffect(() => {
    Chart.register(...registerables)

    const chartConfig: ChartConfiguration = {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: dataLabel,
            data,
            fill: true,
            backgroundColor: 'rgba(1, 240, 111, 0.1)',
            borderColor: 'rgb(1, 240, 111)',
            tension: 0.25,
          },
        ],
      },
      options: {
        scales: {
          x: { ticks: { display: false }, grid: { display: false } },
          y: { ticks: { maxTicksLimit: 3 }, grid: { display: false } },
        },
        elements: {
          point: {
            radius: 0,
          },
        },
        interaction: {
          intersect: false,
        },
        plugins: {
          legend: {
            display: false,
          },
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    }

    const chart = new Chart(chartRef.current, chartConfig)

    return () => {
      chart.destroy()
    }
  }, [labels, data, dataLabel])

  return <canvas ref={chartRef}></canvas>
}

export default LineChart
