import * as React from 'react'
import { getAgGridStyle } from "../../themes"
import { Matcher } from 'multi-source-select'
import { AgGridReact } from "ag-grid-react"
import { fetchBondsAndCache } from '../../services/bondsService'
import Bond from '../../types/Bond'
import { ColDef, RowClickedEvent } from 'ag-grid-community'
import { buySellStyle, createFilter, getColumn, graidentStyle } from '../../types/AgFilter'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { isUnique } from '../../utils'
import AxeRender from '../../types/AxeRender'
import './Bonds.css'
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"
import { setContext } from '../../store/contextSlice'

const Bonds = () => {
  const agGridRef = React.useRef<AgGridReact<Bond> | null>(null)
  const [isAxe, setisAxe] = React.useState<boolean>(true)
  const [rowData, setRowData] = React.useState<Bond[]>()
  const [columnDefs] = React.useState<ColDef<Bond>[]>([
    { field: "isin", filter: 'agTextColumnFilter', sortable: true, resizable: true, width: 90 },
    { field: "axed", filter: 'agTextColumnFilter', sortable: true, resizable: true, width: 30, cellRenderer: AxeRender },
    { field: "side", filter: 'agTextColumnFilter', sortable: true, resizable: true, width: 50, cellStyle: buySellStyle },
    { field: "rv", filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 80, cellStyle: graidentStyle, valueFormatter: () => "", sort: 'desc' },
    { field: "currency", headerName: 'CCY', filter: 'agTextColumnFilter', sortable: true, resizable: true, width: 50 },
    { field: "ticker", filter: 'agTextColumnFilter', sortable: true, resizable: true, width: 90 },
    { field: "sector", filter: 'agTextColumnFilter', sortable: true, resizable: true, width: 90 },
    { field: "issueDate", filter: 'agDateColumnFilter', sortable: true, resizable: true, width: 80 },
    { field: "maturityDate", filter: 'agDateColumnFilter', sortable: true, resizable: true, width: 80 },
    { field: "coupon", filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 80 },
    { field: "price", filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 80 },
    { field: "size", filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 80 },
    { field: "issuer", filter: 'agTextColumnFilter', sortable: true, resizable: true, width: 350 },
    { field: "hairCut", filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 80 },
  ])

  const theme = useAppSelector((state) => state.theme.theme)
  const context = useAppSelector((state) => state.context)
  const dispatch = useAppDispatch()

  const matchersChanged = React.useCallback((newMatchers: Matcher[]) => {
    const sources = newMatchers.filter(m => !m.changing).map(m => m.source).filter(isUnique)
    sources.forEach(source => {
      const column = getColumn(source)
      const values = newMatchers.filter(m => m.source === source && !m.changing)
      const filter = createFilter(values)
      const instance = agGridRef.current?.api?.getFilterInstance(column)
      if (instance) {
        instance?.setModel(filter)
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
    fetchBondsAndCache()
      .then(data => setRowData(isAxe ? data.filter(r => r.axed) : data))
      .catch(error => {
        if (typeof error === 'string') {
          console.log(error)
        } else if (error instanceof Error) {
          console.log(error.message)
          console.log(error.stack)
        } else {
          console.log(error.toString())
        }
      })
  }, [isAxe])

  React.useEffect(() => {
    matchersChanged(context.matchers)
  }, [context.matchers, matchersChanged])

  const handleSelection = (event: RowClickedEvent<Bond>) => {
    if (event.data?.isin && event.data?.side) {
      dispatch(setContext([
        {
          key: 'SELECT-CLIENT',
          operator: '&',
          comparison: '=',
          source: 'ISIN',
          value: event.data.isin,
          text: event.data.isin
        },
        ...(event.data.side ? [{
          key: 'SELECT-BOND',
          operator: '&',
          comparison: '=',
          source: 'Side',
          value: event.data.side,
          text: event.data.side
        }] : [])
      ]))
    }
  }

  return (
    <div className='mainBlotter'>
      <div className='mainMultiselectBonds'>
        <div
          className='mainAxeBondToggle'
          onClick={() => setisAxe(!isAxe)}
        >{isAxe ? 'Axes Only ' : 'Bonds and Axes'}</div>
      </div>
      <div
        className="ag-theme-alpine agBondsGrid"
        style={getAgGridStyle(theme)}
      >
        <AgGridReact
          ref={agGridRef}
          rowData={rowData}
          rowSelection='single'
          rowMultiSelectWithClick={true}
          onRowDoubleClicked={handleSelection}
          columnDefs={columnDefs}>
        </AgGridReact>
      </div>
    </div>

  )
}

export default Bonds