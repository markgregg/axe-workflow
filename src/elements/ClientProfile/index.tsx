import * as React from 'react'
import { useAppSelector } from '../../hooks/redux'
import { styleDivFromTheme } from '../../themes'
import './ClientProfile.css'
import Highcharts, { Options } from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import ToggleButton from '../ToggleButton'

type ChartType = 'BuySell' | 'Volume' | 'HitRatio'

const ClientProfile = () => {
  const volumeDivRef = React.useRef<HTMLDivElement | null>(null)
  const buysellDivRef = React.useRef<HTMLDivElement | null>(null)
  const hitRatioDivRef = React.useRef<HTMLDivElement | null>(null)
  const theme = useAppSelector((state) => state.theme.theme)
  const client = useAppSelector((state) => state.selectedClient)
  const [volumeOptions, setVolumeOptions] = React.useState<Options | null>(null)
  const [hitRatioOptions, setHitRatioOptions] = React.useState<Options | null>(null)
  const [buySellOptions, setBuySellOptions] = React.useState<Options | null>(null)
  const [breakdown, setBreakdown] = React.useState<'Date' | 'Sector' | 'Rating' | 'Maturity'>('Date')

  const comparisonBarChart = (xAxis: string[], title: string, series1: string, series2: string, series1Data: number[], series2Data: number[], s1Color: string, s2Color: string): Options => {

    return {
      chart: {
        type: 'column',
        height: buysellDivRef.current?.clientHeight,
        width: buysellDivRef.current?.clientWidth,
      },
      // Custom option for templates
      title: {
        text: '',
      },
      legend: {
        enabled: false
      },
      xAxis: {
        categories: xAxis,
      },
      yAxis: [{
        title: {
          text: title,
          style: { fontWeight: 'bold', fontSize: 'large' }
        },
        showFirstLabel: false
      }],
      series: [{
        type: 'column',
        color: s1Color,
        pointPlacement: -0.2,
        linkedTo: 'main',
        data: series1Data,
        name: series1
      }, {
        type: 'column',
        name: series2,
        color: s2Color,
        id: 'main',
        dataSorting: {
          enabled: true,
          matchByName: true
        },
        data: series2Data
      }],
      exporting: {
        allowHTML: true
      }
    }

  }

  React.useEffect(() => {
    const xAxis: string[] = breakdown === 'Date'
      ? ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'Sweptember', 'October', 'November', 'December']
      : breakdown === 'Sector'
        ? ['Energy', 'Materials', 'Industrials', 'Consumer', 'Health', 'Financials', 'Technology', 'Communications', 'Utilities']
        : breakdown === 'Rating'
          ? ['Aaa', 'Aa1', 'Aa2', 'Aa3', 'A1', 'A2', 'A3', 'Baa1', 'Baa2', 'Baa3', 'Ba1']
          : ['5Y', '8Y', '9Y', '10Y', '15Y', '20Y', '25Y']

    const volume: number[] = []
    for (let i = 0; i < xAxis.length; i++) {
      volume.push((Math.random() * 1000) * 100)
    }

    setVolumeOptions({
      chart: {
        type: 'column',
        height: volumeDivRef.current?.clientHeight,
        width: volumeDivRef.current?.clientWidth,
      },
      title: {
        text: ''
      },
      xAxis: {
        categories: xAxis,
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Traded Volume',
          style: { fontWeight: 'bold', fontSize: 'large' }
        },
        enabled: false,
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: [
        {
          name: 'Volume',
          type: 'column',
          data: volume
        }
      ],
      legend: {
        enabled: false
      }
    })

  }, [breakdown, client])

  React.useEffect(() => {
    const ccAxis = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'Sweptember', 'October', 'November', 'December']
    const buys: number[] = []
    const sells: number[] = []
    for (let i = 0; i < ccAxis.length; i++) {
      buys.push(Math.random() * 56 + 1)
      sells.push(Math.random() * 56 + 1)
    }
    setBuySellOptions(comparisonBarChart(ccAxis, 'BuySell Ratio', 'Buy', 'Sell', buys, sells, 'rgb(6,104,178)', 'orange'))

    const quotes: number[] = []
    const hits: number[] = []
    for (let i = 0; i < ccAxis.length; i++) {
      const breakdownQuote = Math.floor(Math.random() * 56 + 1);
      quotes.push(breakdownQuote)
      const breakdownHit = Math.floor(breakdownQuote - (Math.random() * breakdownQuote))
      hits.push(breakdownHit)
    }
    setHitRatioOptions(comparisonBarChart(ccAxis, 'Hit Ratio', 'Quotes', 'Hit', quotes, hits, 'red', 'green'))
  }, [client])

  return (
    <div
      className='clientProfileMain'
      style={styleDivFromTheme(theme)}
    >
      <div className='clientProfileHeader'>
        <h2 className='clientProfileTitle'>{client.client}</h2>
        <div className='clientProfileProps'>
          <div><b>Contact:</b>Mrs Joanna Moore</div>
          <div><b>Numnber:</b>+44 207 4958181 </div>
        </div>
        <div className='clientProfileToggleGroup'>
          <ToggleButton textOff='Date' textOn='Date' onChecked={() => setBreakdown('Date')} checked={breakdown === 'Date'} />
          <ToggleButton textOff='Sector' textOn='Sector' onChecked={() => setBreakdown('Sector')} checked={breakdown === 'Sector'} />
          <ToggleButton textOff='Ratings' textOn='Rating' onChecked={() => setBreakdown('Rating')} checked={breakdown === 'Rating'} />
          <ToggleButton textOff='Maturity' textOn='Maturity' onChecked={() => setBreakdown('Maturity')} checked={breakdown === 'Maturity'} />
        </div>
      </div>
      <div className='clientProfileCharts'>
        <div
          className='clientProfileVolume'
          ref={volumeDivRef}
        >
          <HighchartsReact
            highcharts={Highcharts}
            constructorType={"chart"}
            options={volumeOptions}
          />
        </div>
        <div className='clientProfileBuySell'
          ref={buysellDivRef}
        >
          <HighchartsReact
            highcharts={Highcharts}
            constructorType={"chart"}
            options={buySellOptions}
          />
        </div>
        <div className='clientProfileHitRatio'
          ref={hitRatioDivRef}
        >
          <HighchartsReact
            highcharts={Highcharts}
            constructorType={"chart"}
            options={hitRatioOptions}
          />
        </div>
      </div>

    </div>

  )
}

export default ClientProfile