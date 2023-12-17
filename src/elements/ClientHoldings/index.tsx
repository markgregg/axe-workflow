import * as React from 'react'
import { useAppSelector } from '../../hooks/redux'
import { getAgGridStyle, styleDivFromTheme } from '../../themes'
import { ClientHolding, clientHoldingsList } from './ClientHoldings'
import { AgGridReact } from "ag-grid-react"
import { ColDef } from 'ag-grid-community'
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"
import './ClientHoldings.css'


const ClientHoldings = () => {
  const agGridRef = React.useRef<AgGridReact<ClientHolding> | null>(null)
  const theme = useAppSelector((state) => state.theme.theme)
  const [columnDefs] = React.useState<ColDef<ClientHolding>[]>([
    { field: "isin", filter: 'agTextColumnFilter', sortable: true, resizable: true, width: 110, },
    { field: "position", filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 70, },
    { field: "changeValue", filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 60, },
    { field: "change", filter: 'agTextColumnFilter', sortable: true, resizable: true, width: 60 },
    { field: "postingDate", filter: 'agDateColumnFilter', sortable: true, resizable: true, width: 80 },
    { field: "changeFromDate", filter: 'agDateColumnFilter', sortable: true, resizable: true, width: 80 }
  ])


  return (
    <div
      className='clientInterestsMain'
      style={styleDivFromTheme(theme)}
    >
      <div
        className="ag-theme-alpine agInterestsGrid"
        style={getAgGridStyle(theme)}
      >
        <AgGridReact
          ref={agGridRef}
          rowData={clientHoldingsList}
          rowSelection='single'
          columnDefs={columnDefs}>
        </AgGridReact>
      </div>
    </div>
  )
}

export default ClientHoldings