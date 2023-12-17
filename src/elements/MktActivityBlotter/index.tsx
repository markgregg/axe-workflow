import * as React from 'react'
import { getAgGridStyle } from "../../themes"
import { AgGridReact } from "ag-grid-react"
import { ColDef } from 'ag-grid-community'
import { buySellStyle } from '../../types/AgFilter'
import { useAppSelector } from '../../hooks/redux'
import './MktActivityBlotter.css'
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"
import SelectedBond from '../../types/SelectedBond'
import MarketActivity from '../../types/MarketActivity'
import { marketActivityList } from './MarketActivity'
import ToggleButton from '../ToggleButton'
import { MdBubbleChart } from "react-icons/md";
import { MdGridView } from "react-icons/md";
import HighchartsReact from 'highcharts-react-official'
import Highcharts, { Options } from 'highcharts'

const MktActivityBlotter: React.FC = () => {
  const agGridRef = React.useRef<AgGridReact<MarketActivity> | null>(null)
  const [rowData, setRowData] = React.useState<MarketActivity[]>()
  const [columnDefs] = React.useState<ColDef<MarketActivity>[]>([
    { field: "date", filter: 'agDateColumnFilter', sortable: true, resizable: true, width: 110 },
    { field: "isin", filter: 'agTextColumnFilter', sortable: true, resizable: true, width: 110 },
    { field: "side", filter: 'agTextColumnFilter', sortable: true, resizable: true, width: 80, cellStyle: buySellStyle },
    { field: "sizeDelta", filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 80 },
    { field: "highPrice", filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 80 },
    { field: "lowPrice", filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 80 },
    { field: "lastPrice", filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 80 },
    { field: "vwas", filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 80 },
    { field: "highSpread", filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 80 },
    { field: "lowSpread", filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 80 },
  ])
  const [showBChart, setShowBChart] = React.useState<boolean>(false)
  const [period, setPeriod] = React.useState<'Today' | '7 Days' | 'Month' | 'Year'>('Today')
  const [chartType, setChartType] = React.useState<'Spread' | 'Volume'>('Volume')
  const [options, setOptions] = React.useState<Options | null>(null)
  const bondDivRef = React.useRef<HTMLDivElement | null>(null)

  const theme = useAppSelector((state) => state.theme.theme)
  const bond = useAppSelector((state) => state.selectedBond)

  const bondChanged = React.useCallback((bond: SelectedBond | null) => {
    if (bond) {
      const filter = {
        filterType: 'text',
        filter: bond.isin,
        type: 'equals'
      }
      const instance = agGridRef.current?.api?.getFilterInstance('isin')
      if (instance) {
        instance?.setModel(filter)
      }
      if (bond?.side) {
        const filter2 = {
          filterType: 'text',
          filter: bond.side,
          type: 'equals'
        }
        const instance = agGridRef.current?.api?.getFilterInstance('side')
        if (instance) {
          instance?.setModel(filter2)
        }
      }
    } else {
      const instance = agGridRef.current?.api?.getFilterInstance('isin')
      if (instance) {
        instance?.setModel(null)
      }
      const instance2 = agGridRef.current?.api?.getFilterInstance('side')
      if (instance2) {
        instance2?.setModel(null)
      }
    }

    agGridRef.current?.api?.onFilterChanged()
  }, [])

  React.useEffect(() => {
    bondChanged(bond.bond)
  }, [bond.bond, bondChanged])

  React.useEffect(() => {
    setRowData(marketActivityList)
  }, [])


  React.useEffect(() => {
    const xAxis: string[] = period === 'Today'
      ? ['9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm']
      : period === '7 Days'
        ? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        : period === 'Month'
          ? ['Week 1', 'Week 2', 'Week 3', 'Week 4']
          : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'Sweptember', 'October', 'November', 'December']

    if (chartType === 'Spread') {
      const bids: number[] = []
      const asks: number[] = []
      for (let i = 0; i < xAxis.length; i++) {
        const bid = Math.random() + 90 + (Math.random() * 40)
        const ask = bid - (Math.random() * 15) - Math.random()
        bids.push(bid)
        asks.push(ask)
      }

      setOptions({
        chart: {
          type: 'area',
          height: bondDivRef.current?.clientHeight,
          width: bondDivRef.current?.clientWidth,
        },
        title: {
          text: ''
        },
        subtitle: {
          text: ''
        },
        xAxis: {
          categories: xAxis,
        },
        yAxis: {
          title: {
            text: 'Px'
          }
        },
        tooltip: {
          shared: true,
          headerFormat: '<span style="font-size:12px"><b>{point.key}</b></span><br>'
        },
        plotOptions: {
          area: {
            stacking: 'normal',
            lineColor: '#666666',
            lineWidth: 1,
            marker: {
              lineWidth: 1,
              lineColor: '#666666'
            }
          }
        },
        series: [{
          name: 'Bid',
          type: 'area',
          data: bids,
          color: 'rgb(6,104,178)'
        }, {
          name: 'Ask',
          type: 'area',
          data: asks,
          color: 'orange'
        }]
      })
    } else {
      const volume: number[] = []
      for (let i = 0; i < xAxis.length; i++) {
        volume.push((Math.random() * 1000) * 100)
      }

      setOptions({
        chart: {
          type: 'column',
          height: bondDivRef.current?.clientHeight,
          width: bondDivRef.current?.clientWidth,
        },
        title: {
          text: ''
        },
        xAxis: {
          categories: xAxis,
          crosshair: true,
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Traded Volume'
          }
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
        ]
      })
    }

  }, [chartType, period, showBChart, bond])

  return (
    <div className='marketActivityMain'>
      <div className='marketActivitiyViews'>
        <ToggleButton IconOn={MdBubbleChart} IconOff={MdGridView} onChecked={setShowBChart} checked={showBChart} />
        <div className='clientInterestToggleGroup'>
          <div className='clientInterestSmallText'>Show</div>
          <ToggleButton textOff='Today' textOn='Today' onChecked={() => setPeriod('Today')} checked={period === 'Today'} />
          <ToggleButton textOff='7 Days' textOn='7 Days' onChecked={() => setPeriod('7 Days')} checked={period === '7 Days'} />
          <ToggleButton textOff='Month' textOn='Month' onChecked={() => setPeriod('Month')} checked={period === 'Month'} />
          <ToggleButton textOff='Year' textOn='Year' onChecked={() => setPeriod('Year')} checked={period === 'Year'} />
        </div>
        {
          showBChart &&
          <div className='clientInterestToggleGroup'>
            <div className='clientInterestSmallText'>Chart</div>
            <ToggleButton textOff='Spread' textOn='Spread' onChecked={() => setChartType('Spread')} checked={chartType === 'Spread'} />
            <ToggleButton textOff='Volume' textOn='Volume' onChecked={() => setChartType('Volume')} checked={chartType === 'Volume'} />
          </div>
        }
      </div>
      {
        showBChart
          ? <div ref={bondDivRef} className='marketActivityChartContainer'>
            <div className='marketActivitiyChart'>
              <HighchartsReact
                highcharts={Highcharts}
                constructorType={"chart"}
                options={options}
              />
            </div>
          </div>
          : <div
            className="ag-theme-alpine agGrid"
            style={getAgGridStyle(theme)}
          >
            <AgGridReact
              ref={agGridRef}
              rowData={rowData}
              columnDefs={columnDefs}>
            </AgGridReact>
          </div>
      }

    </div>

  )
}

export default MktActivityBlotter