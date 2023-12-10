import * as React from 'react'
import Highcharts, { Options } from 'highcharts'
import HighchartsReact, { HighchartsReactRefObject } from 'highcharts-react-official'
import { useAppSelector } from '../../hooks/redux'
import { styleDivFromTheme } from '../../themes'
import './BondChart.css'

const series: Highcharts.SeriesOptionsType[] = [
  {
    name: 'Microsoft',
    type: 'line',
    data: [
      -60,
      -85,
      -92,
      -110,
      -105,
      -74,
      -56,
    ]
  },
  {
    name: 'Google',
    type: 'line',
    data: [
      95,
      80,
      66,
      69,
      84,
      87,
      90
    ]
  },
  {
    name: 'Apple',
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
  {
    name: 'Samsung',
    type: 'line',
    data: [
      60,
      20,
      -2,
      23,
      37,
      75,
      85
    ]
  }
]


const BondChart = () => {
  const highchartRef = React.useRef<HighchartsReactRefObject | null>(null)
  const bondDivRef = React.useRef<HTMLDivElement | null>(null)
  const [bond, setBond] = React.useState<string>('XS1586702679')
  const theme = useAppSelector((state) => state.theme.theme)
  const [checks, setChecks] = React.useState<string[]>(series.map(e => e.name ?? '').filter(a => a !== ''))
  const [seriesOptions, setSeriesOptions] = React.useState<Highcharts.SeriesOptionsType[]>(series)
  const [chartOptions, setBondChartOptions] = React.useState<Options | null>(null)

  const context = useAppSelector((state) => state.context)

  React.useEffect(() => {
    setBondChartOptions({
      chart: {
        type: 'line'
      },
      title: {
        text: 'Relative value of technologies'
      },
      xAxis: {
        type: 'datetime',
        categories: ['5Y', '8Y', '9Y', '10Y', '15Y', '20Y', '25Y'],
        title: {
          text: 'Maturity'
        }
      },
      yAxis: {
        title: {
          text: 'Change of Z-Spread'
        },
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

      series: seriesOptions
    })
  }, [seriesOptions])

  React.useEffect(() => {
    const isin = context.matchers.find(m => m.source === 'ISIN')
    if (isin) {
      setBond(isin.text)
    }
  }, [context.matchers])

  React.useEffect(() => {
    if (highchartRef.current?.chart) {
      highchartRef.current.chart.series[0].points.forEach(p => {
        if (p.x === 3) {
          p.update({
            color: 'red',
            marker: {
              symbol: 'circle',
              radius: 7,
            },
            label: bond
          });
        }
      });
    }
  }, [context.matchers, bond])

  return (
    <div
      className='bondChartMain'
      style={styleDivFromTheme(theme)}
    >
      <div className='bondChartTop' >
        <h2 className='bondChartTitle'>{bond} - 10Y - 2.921%</h2>
        <div className='bondChartIssuers'>
          <div className='bondChartIssuerTitle'>Issuers</div>
          {
            series.map(item => item.name
              ? <div className='bondChartIssuer' key={item.name}>
                <input type='checkbox' checked={checks.includes(item.name)} onChange={e => {
                  if (item.name && item.name !== 'Microsoft') {
                    const newChecks = e.currentTarget.checked
                      ? [...checks, item.name]
                      : checks.filter(c => c !== item.name)
                    setChecks(newChecks)
                    setSeriesOptions([...series.filter(s => s.name && newChecks.includes(s.name))])
                  }
                }} />
                {item.name}
              </div>
              : <></>
            )
          }
        </div>
      </div>
      <div
        ref={bondDivRef}
        className='bondChartBottom'
      >
        <HighchartsReact
          ref={highchartRef}
          highcharts={Highcharts}
          options={chartOptions}
        />
      </div>
      <div className='bondText'>Could be a message to Bloomberg</div>
    </div>
  )
}

export default BondChart