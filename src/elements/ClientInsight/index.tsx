import * as React from 'react'
import { useAppSelector } from '../../hooks/redux'
import { getAgGridStyle, styleDivFromTheme } from '../../themes'
import { Insight, clientInsightList } from './ClientInsight'
import { AgGridReact } from "ag-grid-react"
import { ColDef } from 'ag-grid-community'
import { asHypen, bidAskValueStyle, buyStyle, sellStyle, } from '../../types/AgFilter'
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"
import { MdBubbleChart } from "react-icons/md";
import { MdGridView } from "react-icons/md";
import ToggleButton from '../ToggleButton'
import Highcharts, { Options } from 'highcharts'
import HC_more from "highcharts/highcharts-more";
import HighchartsReact from 'highcharts-react-official'
import { LuClock } from "react-icons/lu";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import './ClientInsight.css'

HC_more(Highcharts);

interface IsinSide {
  isin: string
  side: 'BUY' | 'SELL'
}

const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

const ClientInsight = () => {
  const agGridRef = React.useRef<AgGridReact<Insight> | null>(null)
  const [insights, setInsights] = React.useState<Insight[]>([])
  const [selected, setSeelcted] = React.useState<IsinSide | null>(null)
  const [options, setOptions] = React.useState<Options | null>(null)
  const theme = useAppSelector((state) => state.theme.theme)
  const [showBChart, setShowBChart] = React.useState<boolean>(false)
  const [showVolume, setShowVolume] = React.useState<boolean>(false)
  const [activity, setActivity] = React.useState<boolean>(true)
  const [holdings, setHoldings] = React.useState<boolean>(true)
  const [interests, setInterests] = React.useState<boolean>(true)
  const [showTop, setShowTop] = React.useState<'holdings' | 'activity' | 'interests'>('activity')
  const [columnDefs] = React.useState<ColDef<Insight>[]>([
    { field: "company", filter: 'agTextColumnFilter', sortable: true, resizable: true, width: 120 },
    { field: "position", headerName: 'holdings', filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 90, cellStyle: bidAskValueStyle, valueFormatter: asHypen },
    { field: "changeValue", headerName: 'holdings Chg', filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 100, cellStyle: bidAskValueStyle, valueFormatter: asHypen },
    { field: "postingDate", headerName: 'Posting Date', filter: 'agDateColumnFilter', sortable: true, resizable: true, width: 100, valueFormatter: asHypen },
    { field: "buyDate", filter: 'agDateColumnFilter', sortable: true, resizable: true, width: 90, cellStyle: buyStyle, valueFormatter: asHypen },
    { field: "buyVolume", filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 100, cellStyle: buyStyle, valueFormatter: asHypen },
    { field: "sellDate", filter: 'agDateColumnFilter', sortable: true, resizable: true, width: 90, cellStyle: sellStyle, valueFormatter: asHypen },
    { field: "sellVolume", filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 100, cellStyle: sellStyle, valueFormatter: asHypen },
    { field: "interestCaptureDate", headerName: 'Interest Date', filter: 'agDateColumnFilter', sortable: true, resizable: true, width: 100, valueFormatter: asHypen },
  ])

  const context = useAppSelector((state) => state.context)

  React.useEffect(() => {
    const isin = context.matchers.find(m => m.source.toLowerCase() === 'isin')?.value as string
    const side = context.matchers.find(m => m.source.toLowerCase() === 'side')?.value as ('BUY' | 'SELL')

    setSeelcted((isin && side) ? { isin, side } : null)

  }, [context.matchers])

  React.useEffect(() => {
    if (showBChart) {
      setChartData(selected, showVolume, activity, holdings, interests)
    } else {
      setGridData(selected, showVolume, showTop)
    }

  }, [showBChart, showVolume, activity, holdings, interests, showTop, selected])

  interface DataItem {
    name: string
    longName: string
    value: number
    explain: string
  }

  const daysFromDate = (date: string) => {
    if (date === '') {
      return 999
    }
    const jdata = Date.parse(date)
    return Math.round(Math.abs((Date.now() - jdata) / oneDay));
  }

  const setGridData = (axe: IsinSide | null, showVolume: boolean, showTop: 'holdings' | 'activity' | 'interests') => {
    const tmpInsights = clientInsightList
      .filter(item => !axe
        ? showTop === 'activity'
          ? item.buyVolume || item.sellVolume
          : showTop === 'holdings'
            ? item.position
            : item.interestCaptureDate
        : (axe.isin === item.isin &&
          (axe.side === 'BUY' &&
            (showTop === 'holdings' && (item.position ?? 0) > 0 ||
              showTop === 'activity' && item.buyVolume ||
              showTop === 'interests' && item.interestCaptureDate)) ||
          (axe.side === 'SELL' &&
            (showTop === 'holdings' && (item.position ?? 0) < 0 ||
              showTop === 'activity' && item.sellVolume ||
              showTop === 'interests' && item.interestCaptureDate))
        ))
    const sort = showTop === 'activity'
      ? (x1: Insight, x2: Insight) =>
        !axe
          ? showVolume
            ? ((x2.buyVolume ?? 0) > Math.abs(x2.sellVolume ?? 0) ? (x2.buyVolume ?? 0) : Math.abs(x2.sellVolume ?? 0)) -
            ((x1.buyVolume ?? 0) > Math.abs(x1.sellVolume ?? 0) ? (x1.buyVolume ?? 0) : Math.abs(x1.sellVolume ?? 0))
            : (365 - daysFromDate(x2.buyDate ?? '') > 365 - daysFromDate(x2.sellDate ?? '') ? 365 - daysFromDate(x2.buyDate ?? '') : 365 - daysFromDate(x2.sellDate ?? '')) -
            (365 - daysFromDate(x1.buyDate ?? '') > 365 - daysFromDate(x1.sellDate ?? '') ? 365 - daysFromDate(x1.buyDate ?? '') : 365 - daysFromDate(x1.sellDate ?? ''))
          : showVolume
            ? axe.side === 'BUY'
              ? (x2.buyVolume ?? 0) - (x1.buyVolume ?? 0)
              : (x2.sellVolume ?? 0) - (x1.sellVolume ?? 0)
            : axe.side === 'BUY'
              ? 365 - daysFromDate(x2.buyDate ?? '') - 365 - daysFromDate(x1.buyDate ?? '')
              : 365 - daysFromDate(x2.sellDate ?? '') - 365 - daysFromDate(x1.sellDate ?? '')
      : showTop === 'holdings'
        ? (x1: Insight, x2: Insight) =>
          !axe
            ? showVolume
              ? (x2.position ?? 0) - Math.abs(x1.position ?? 0)
              : 365 - daysFromDate(x2.postingDate ?? '') - 365 - daysFromDate(x1.postingDate ?? '')
            : showVolume
              ? axe.side === 'BUY'
                ? (x2.position ?? 0) - (x1.position ?? 0)
                : (x1.position ?? 0) - (x2.position ?? 0)
              : axe.side === 'BUY'
                ? 365 - daysFromDate((x2.position ?? 0) > 0 ? (x2.postingDate ?? '') : '') - 365 - daysFromDate((x1.position ?? 0) > 0 ? (x1.postingDate ?? '') : '')
                : 365 - daysFromDate((x2.position ?? 0) < 0 ? (x2.postingDate ?? '') : '') - 365 - daysFromDate((x1.position ?? 0) < 0 ? (x1.postingDate ?? '') : '')
        : (x1: Insight, x2: Insight) => 365 - daysFromDate(x2.interestCaptureDate ?? '') - 365 - daysFromDate(x1.interestCaptureDate ?? '')

    setInsights(tmpInsights.sort(sort))
  }

  const setChartData = (axe: IsinSide | null, showVolume: boolean, activity: boolean, holdings: boolean, interests: boolean) => {
    const activityData: DataItem[] = activity
      ? clientInsightList
        .filter(item => !axe || item.isin === axe.isin && (axe.side === 'BUY' && item.buyDate || axe.side === 'SELL' && item.sellDate))
        .map(item => {
          return {
            name: item.company,
            longName: item.company,
            value: showVolume
              ? !axe
                ? (item.buyVolume ?? 0) > Math.abs(item.sellVolume ?? 0)
                  ? (item.buyVolume ?? 0)
                  : Math.abs(item.sellVolume ?? 0)
                : axe.side === 'BUY'
                  ? (item.buyVolume ?? 0)
                  : (item.sellVolume ?? 0)
              : !axe
                ? 365 - daysFromDate(item.buyDate ?? '') > 365 - daysFromDate(item.sellDate ?? '')
                  ? 365 - daysFromDate(item.buyDate ?? '')
                  : 365 - daysFromDate(item.sellDate ?? '')
                : axe.side === 'BUY'
                  ? 365 - daysFromDate(item.buyDate ?? '')
                  : 365 - daysFromDate(item.sellDate ?? ''),
            explain: showVolume
              ? `Activity volume: ${!axe
                ? (item.buyVolume ?? 0) > (item.sellVolume ?? 0)
                  ? item.buyVolume
                  : item.sellVolume
                : axe.side === 'BUY'
                  ? item.buyVolume
                  : item.sellVolume}`
              : `Activity date: ${!axe
                ? (item.buyDate ?? '') > (item.sellDate ?? '')
                  ? (item.buyDate ?? '')
                  : (item.sellDate ?? '')
                : axe.side === 'BUY'
                  ? item.buyDate
                  : item.sellDate}`
          }
        })
        .sort((d1, d2) => d2.value - d1.value)
        .slice(0, 5)
      : []
    const holdingsData: DataItem[] = holdings
      ? clientInsightList
        .filter(item => !axe || item.isin === axe.isin && (axe.side === 'BUY' && item.position && item.position > 0 || axe.side === 'SELL' && item.position && item.position < 0))
        .map(item => {
          return {
            name: item.company,
            longName: item.company,
            value: showVolume ? Math.abs(item.position ?? 0) : 365 - daysFromDate(item.postingDate ?? ''),
            explain: showVolume ? `Holdings volume: ${item.position}` : `Holdings date: ${item.postingDate}`
          }
        })
        .sort((d1, d2) => d2.value - d1.value)
        .slice(0, 5)
      : []
    const interestData: DataItem[] = interests
      ? clientInsightList
        .filter(item => !axe || item.isin === axe.isin && item.interestCaptureDate)
        .map(item => {
          return {
            name: item.company,
            longName: item.company,
            value: 365 - daysFromDate(item.interestCaptureDate ?? ''),
            explain: `Interest date: ${item.interestCaptureDate}`
          }
        })
        .sort((d1, d2) => d2.value - d1.value)
        .slice(0, 5)
      : []

    const combinedData: DataItem[] = activity && holdings
      ? clientInsightList
        .filter(item => !axe || item.isin === axe.isin &&
          (axe.side === 'BUY' && (item.buyDate || item.position && item.position > 0)
            || axe.side === 'SELL' && (item.sellDate || item.position && item.position < 0))
        )
        .map(item => {
          return {
            name: item.company,
            longName: item.company,
            value: showVolume
              ? !axe
                ? (item.buyVolume ?? 0) > Math.abs(item.sellVolume ?? 0)
                  ? (item.buyVolume ?? 0) > (item.position ?? 0)
                    ? (item.buyVolume ?? 0)
                    : (item.position ?? 0)
                  : Math.abs(item.sellVolume ?? 0) > Math.abs(item.position ?? 0)
                    ? Math.abs(item.sellVolume ?? 0)
                    : Math.abs(item.position ?? 0)
                : axe.side === 'BUY'
                  ? (item.buyVolume ?? 0) > (item.position ?? 0)
                    ? (item.buyVolume ?? 0)
                    : (item.position ?? 0)
                  : Math.abs(item.sellVolume ?? 0) < Math.abs(item.position ?? 0)
                    ? Math.abs(item.sellVolume ?? 0)
                    : Math.abs(item.position ?? 0)
              : !axe
                ? 365 - daysFromDate(item.buyDate ?? '') > 365 - daysFromDate(item.sellDate ?? '')
                  ? 365 - daysFromDate(item.buyDate ?? '') > 365 - daysFromDate(item.postingDate ?? '')
                    ? 365 - daysFromDate(item.buyDate ?? '')
                    : 365 - daysFromDate(item.postingDate ?? '')
                  : 365 - daysFromDate(item.sellDate ?? '') > 365 - daysFromDate(item.postingDate ?? '')
                    ? 365 - daysFromDate(item.sellDate ?? '')
                    : 365 - daysFromDate(item.postingDate ?? '')
                : axe.side === 'BUY'
                  ? (item.position ?? 0) < 0 || 365 - daysFromDate(item.buyDate ?? '') > 365 - daysFromDate(item.postingDate ?? '')
                    ? 365 - daysFromDate(item.buyDate ?? '')
                    : 365 - daysFromDate(item.postingDate ?? '')
                  : (item.position ?? 0) > 0 || 365 - daysFromDate(item.sellDate ?? '') > 365 - daysFromDate(item.postingDate ?? '')
                    ? 365 - daysFromDate(item.sellDate ?? '')
                    : 365 - daysFromDate(item.postingDate ?? ''),
            explain: showVolume
              ? `Activity/Holding volume: ${!axe
                ? (item.buyVolume ?? 0) > (item.sellVolume ?? 0)
                  ? item.buyVolume
                  : item.sellVolume
                : axe.side === 'BUY'
                  ? item.buyVolume
                  : item.sellVolume}`
              : `Activity/Holding date: ${!axe
                ? (item.buyDate ?? '') > (item.sellDate ?? '')
                  ? (item.buyDate ?? '')
                  : (item.sellDate ?? '')
                : axe.side === 'BUY'
                  ? item.buyDate
                  : item.sellDate}`
          }
        })
        .sort((d1, d2) => d2.value - d1.value)
        .slice(0, 5)
      : []

    const series: Highcharts.SeriesOptionsType[] = []
    if (activityData.length > 0) {
      series.push({
        name: 'Activities',
        type: 'packedbubble',
        data: activityData
      })
    }
    if (holdingsData.length > 0) {
      series.push({
        name: 'Holdings',
        type: 'packedbubble',
        data: holdingsData
      })
    }
    if (interestData.length > 0) {
      series.push({
        name: 'Interests',
        type: 'packedbubble',
        data: interestData
      })
    }
    if (combinedData.length > 0) {
      series.push({
        name: 'Activities/Holdings',
        type: 'packedbubble',
        data: combinedData
      })
    }

    setOptions(
      {
        chart: {
          type: 'packedbubble',
        },
        title: {
          text: '',
          floating: true
        },
        tooltip: {
          useHTML: true,
          pointFormat: '<b>{point.longName}:</b> {point.explain}'
        },
        plotOptions: {
          packedbubble: {
            minSize: '40%',
            maxSize: '80%',
            layoutAlgorithm: {
              gravitationalConstant: 0.05,
              splitSeries: true,
              seriesInteraction: false,
              dragBetweenSeries: true,
              parentNodeLimit: true
            },
            dataLabels: {
              enabled: true,
              format: '{point.name}',
              style: {
                color: 'black',
                textOutline: 'none',
                fontWeight: 'normal'
              }
            }
          }
        },
        series
      }
    )
  }

  return (
    <div
      className='clientInterestsMain'
      style={styleDivFromTheme(theme)}
    >
      <div className='clientInterestViews'>
        <ToggleButton IconOn={MdBubbleChart} IconOff={MdGridView} onChecked={setShowBChart} checked={showBChart} />
        <div className='clientInterestSmallText'>Order by</div>
        <ToggleButton IconOn={FaRegMoneyBillAlt} IconOff={LuClock} onChecked={setShowVolume} checked={showVolume} />
        {
          showBChart
            ? <div className='clientInterestToggleGroup'>
              <ToggleButton textOff='Activity Off' textOn='Activity On' onChecked={setActivity} checked={activity} />
              <ToggleButton textOff='Holdings Off' textOn='Holdings On' onChecked={setHoldings} checked={holdings} />
              <ToggleButton textOff='Interests Off' textOn='Interests On' onChecked={setInterests} checked={interests} />
            </div>
            : <div className='clientInterestToggleGroup'>
              <div className='clientInterestSmallText'>Show</div>
              <ToggleButton textOff='Top Activity' textOn='Top Activity' onChecked={() => setShowTop('activity')} checked={showTop === 'activity'} />
              <ToggleButton textOff='Top Holdings' textOn='Top Holdings' onChecked={() => setShowTop('holdings')} checked={showTop === 'holdings'} />
              <ToggleButton textOff='Top Interests' textOn='Top Interests' onChecked={() => setShowTop('interests')} checked={showTop === 'interests'} />
            </div>
        }
      </div>
      {
        showBChart
          ? <div className='clientInterestChart'>
            <HighchartsReact
              highcharts={Highcharts}
              constructorType={"chart"}
              options={options}
            />
          </div>
          : <div
            className="ag-theme-alpine agInterestsGrid"
            style={getAgGridStyle(theme)}
          >
            <AgGridReact
              ref={agGridRef}
              rowData={insights}
              rowSelection='single'
              columnDefs={columnDefs}>
            </AgGridReact>
          </div>
      }
    </div>
  )
}

export default ClientInsight