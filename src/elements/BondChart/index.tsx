import * as React from 'react'
import Highcharts, { Options } from 'highcharts'
import HighchartsReact, { HighchartsReactRefObject } from 'highcharts-react-official'
import { useAppSelector } from '../../hooks/redux'
import { styleDivFromTheme } from '../../themes'
import './BondChart.css'

const series: Highcharts.SeriesOptionsType[] = [
  {
    name: '',
    type: 'line',
    data: [
      20,
      8,
      -13,
      -20,
      -2,
      45,
      55
    ]
  },
]


const BondChart = () => {
  const highchartRef = React.useRef<HighchartsReactRefObject | null>(null)
  const bondDivRef = React.useRef<HTMLDivElement | null>(null)
  const [bond, setBond] = React.useState<string>('XS1586702679')
  const [seriesOptions, setSeriesOptions] = React.useState<Highcharts.SeriesOptionsType[]>(series)
  const [chartOptions, setBondChartOptions] = React.useState<Options | null>(null)

  const theme = useAppSelector((state) => state.theme.theme)
  const selectedBond = useAppSelector((state) => state.selectedBond)

  React.useEffect(() => {
    setBondChartOptions({
      chart: {
        type: 'line',
        height: bondDivRef.current?.clientHeight,
        width: bondDivRef.current?.clientWidth,
      },
      title: {
        text: ''
      },
      xAxis: {
        type: 'datetime',
        categories: ['5Y', '8Y', '9Y', '10Y', '15Y', '20Y', '25Y'],
      },
      yAxis: {
        enabled: false,
        title: {
          text: 'Z-spread chg'
        }
      },
      plotOptions: {
        series: {
          marker: {
            symbol: 'circle',
            enabled: true,
            radius: 2.5,
            lineWidth: 1
          }
        }
      },
      legend: {
        enabled: false
      },
      series: seriesOptions
    })
  }, [seriesOptions])

  React.useEffect(() => {
    if (selectedBond.bond) {
      setBond(selectedBond.bond.isin)

      const point1 = Math.floor(Math.random() * 20) + 5
      const point2 = Math.floor(Math.random() * point1)
      const point3 = Math.floor(Math.random() * point2) - 10
      const point4 = Math.floor(Math.random() * point3) - 10
      const point5 = Math.floor(Math.random() * point1)
      const point6 = Math.floor(Math.random() * 20) + point1
      const point7 = Math.floor(Math.random() * 20) + point6

      setSeriesOptions([
        {
          name: '',
          type: 'line',
          data: [
            point1,
            point2,
            point3,
            point4,
            point5,
            point6,
            point7
          ]
        },
      ])
    }
  }, [selectedBond.bond])

  React.useEffect(() => {
    if (highchartRef.current?.chart) {
      const point = Math.floor(Math.random() * highchartRef.current.chart.series[0].points.length)
      highchartRef.current.chart.series[0].points.forEach(p => {
        if (p.x === point) {
          p.update({
            color: 'red',
            marker: {
              symbol: 'circle',
              radius: 7,
            },
            label: bond
          });
        } else {
          p.update({
            color: '#2caffe',
            marker: {
            }
          })
        }
      });
    }
  }, [bond])

  return (
    <div
      className='bondChartMain'
      style={styleDivFromTheme(theme)}
    >
      <div
        ref={bondDivRef}
        className='bondChart'
      >
        <HighchartsReact
          ref={highchartRef}
          highcharts={Highcharts}
          options={chartOptions}
        />
      </div>
    </div>
  )
}

export default BondChart