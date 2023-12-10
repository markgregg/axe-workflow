import * as React from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { getAgGridStyle, styleDivFromTheme } from '../../themes'
import { ClientPicture, clientHoldingsList } from './ClientHoldings'
import { AgGridReact } from "ag-grid-react"
import { ColDef, RowClickedEvent } from 'ag-grid-community'
import { bidAskValueStyle, getColumn, graidentStyle, createFilter } from '../../types/AgFilter'
import { Matcher, isUnique } from 'multi-source-select'
import { setContext } from '../../store/contextSlice'
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"
import './ClientHoldings.css'



type ClientViews = 'Isin' | 'Ticker' | 'Issuer' | 'Sector'
const viewItems: ClientViews[] = ['Isin', 'Ticker', 'Issuer', 'Sector']

const ClientHoldings = () => {
  const agGridRef = React.useRef<AgGridReact<ClientPicture> | null>(null)
  const theme = useAppSelector((state) => state.theme.theme)
  const [selectedView, setSelectedView] = React.useState<ClientViews>('Isin')
  const [columnDefs] = React.useState<ColDef<ClientPicture>[]>([
    { field: "client", filter: 'agTextColumnFilter', sortable: true, resizable: true, width: 120 },
    { field: "isin", filter: 'agTextColumnFilter', sortable: true, resizable: true, width: 90, hide: selectedView !== 'Isin' },
    { field: "side", filter: 'agTextColumnFilter', sortable: true, resizable: true, width: 90, hide: true },
    { field: "ticker", filter: 'agTextColumnFilter', sortable: true, resizable: true, width: 90, hide: selectedView !== 'Ticker' },
    { field: "issuer", filter: 'agTextColumnFilter', sortable: true, resizable: true, width: 90, hide: selectedView !== 'Issuer' },
    { field: "sector", filter: 'agTextColumnFilter', sortable: true, resizable: true, width: 90, hide: selectedView !== 'Sector' },
    { field: "score", filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 80, cellStyle: graidentStyle, valueFormatter: () => "", sort: 'desc' },
    { field: "interest", filter: 'agTextColumnFilter', sortable: true, resizable: true, width: 40, },
    { field: "holdings", filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 70, cellStyle: bidAskValueStyle },
    { field: "change", filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 70, cellStyle: bidAskValueStyle },
    { field: "monthsVolume", headerName: 'month', filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 70, cellStyle: bidAskValueStyle },
    { field: "threeMonthsVolume", headerName: '3 months', filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 70, cellStyle: bidAskValueStyle },
    { field: "sixMonthsVolume", headerName: '6 months', filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 70, cellStyle: bidAskValueStyle },
    { field: "yearsVolume", headerName: '1 year', filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 70, cellStyle: bidAskValueStyle }
  ])

  const context = useAppSelector((state) => state.context)
  const dispatch = useAppDispatch()

  const updateView = (view: ClientViews) => {
    setSelectedView(view)
    if (agGridRef.current) {
      agGridRef.current.columnApi.setColumnVisible(view.toLowerCase(), true)
      agGridRef.current.columnApi.setColumnVisible(selectedView.toLowerCase(), false)
    }
  }

  const matchersChanged = React.useCallback((newMatchers: Matcher[]) => {
    const sources = newMatchers.filter(m => !m.changing).map(m => m.source).filter(isUnique)
    sources.forEach(source => {
      const column = getColumn(source)
      const values = newMatchers.filter(m => m.source === source && !m.changing)
      const filter = createFilter(values)
      if (!viewItems.includes(source as ClientViews) || source === selectedView) {
        const instance = agGridRef.current?.api?.getFilterInstance(column)
        if (instance) {
          instance?.setModel(filter)
        }
      }
    })
    columnDefs.map(source => source.field).filter(field => field && !sources.find(src => getColumn(src) === field))
      .forEach(field => {
        if (field) {
          const instance = agGridRef.current?.api?.getFilterInstance(field)
          if (instance) {
            instance?.setModel(null)
          }
        }
      })
    agGridRef.current?.api?.onFilterChanged()
  }, [columnDefs])

  React.useEffect(() => {
    matchersChanged(context.matchers)
  }, [context.matchers, matchersChanged])

  const handleSelection = (event: RowClickedEvent<ClientPicture>) => {
    if (event.data?.client && event.data.isin) {
      dispatch(setContext([
        {
          key: 'SELECT-CLIENT',
          operator: '&',
          comparison: '=',
          source: 'Client',
          value: event.data.client,
          text: event.data.client
        },
        {
          key: 'SELECT-BOND',
          operator: '&',
          comparison: '=',
          source: 'ISIN',
          value: event.data.isin,
          text: event.data.isin
        }
      ]))
    }
  }

  return (
    <div
      className='clientInterestsMain'
      style={styleDivFromTheme(theme)}
    >
      <div className='clientInterestViews'>
        {
          viewItems.map(view => <div key={view}
            className={view === selectedView ? 'clientInterestViewSelected' : 'clientInterestVieUnSelected'}
            onClick={() => updateView(view)}
          >
            {view}
          </div>
          )
        }
      </div>
      <div
        className="ag-theme-alpine agInterestsGrid"
        style={getAgGridStyle(theme)}
      >
        <AgGridReact
          ref={agGridRef}
          rowData={clientHoldingsList}
          rowSelection='single'
          rowMultiSelectWithClick={true}
          onRowDoubleClicked={handleSelection}
          columnDefs={columnDefs}>
        </AgGridReact>
      </div>
    </div>
  )
}

export default ClientHoldings