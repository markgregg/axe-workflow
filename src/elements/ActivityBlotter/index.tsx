import * as React from 'react'
import { getAgGridStyle } from "../../themes"
import { Matcher, } from 'multi-source-select'
import { AgGridReact } from "ag-grid-react"
import { fetchBondsAndCache } from '../../services/bondsService'
import Bond from '../../types/Bond'
import { ColDef } from 'ag-grid-community'
import { buySellStyle, createFilter, getColumn } from '../../types/AgFilter'
import { useAppSelector } from '../../hooks/redux'
import { isUnique } from '../../utils'
import './ActivityBlotter.css'
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"

const ActivityBlotter: React.FC = () => {
  const agGridRef = React.useRef<AgGridReact<Bond> | null>(null)
  const [rowData, setRowData] = React.useState<Bond[]>()
  const [columnDefs] = React.useState<ColDef<Bond>[]>([
    { field: "isin", filter: 'agTextColumnFilter', sortable: true, resizable: true, width: 110 },
    { field: "currency", filter: 'agTextColumnFilter', sortable: true, resizable: true, width: 80 },
    { field: "issueDate", filter: 'agDateColumnFilter', sortable: true, resizable: true, width: 90 },
    { field: "maturityDate", filter: 'agDateColumnFilter', sortable: true, resizable: true, width: 90 },
    { field: "coupon", filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 80 },
    { field: "price", filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 80 },
    { field: "size", filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 80 },
    { field: "side", filter: 'agTextColumnFilter', sortable: true, resizable: true, width: 80, cellStyle: buySellStyle },
    { field: "issuer", filter: 'agTextColumnFilter', sortable: true, resizable: true, width: 350 },
    { field: "hairCut", filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 80 },
  ])
  const theme = useAppSelector((state) => state.theme.theme)
  const context = useAppSelector((state) => state.context)

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
    matchersChanged(context.matchers)
  }, [context.matchers, matchersChanged])

  React.useEffect(() => {
    fetchBondsAndCache()
      .then(setRowData)
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
  }, [])



  return (
    <div className='mainBlotter'>
      <div
        className="ag-theme-alpine agGrid"
        style={getAgGridStyle(theme)}
      >
        <AgGridReact
          ref={agGridRef}
          rowData={rowData}
          columnDefs={columnDefs}>
        </AgGridReact>
      </div>
    </div>

  )
}

export default ActivityBlotter