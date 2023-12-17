import * as React from 'react'
import { useAppSelector } from '../../hooks/redux'
import { getAgGridStyle, styleDivFromTheme } from '../../themes'
import { ClientInterest, clientInterestList } from './clientInterests'
import { AgGridReact } from "ag-grid-react"
import { ColDef } from 'ag-grid-community'
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"
import './ClientInterests.css'



const ClientInterests = () => {
  const theme = useAppSelector((state) => state.theme.theme)
  const [columnDefs] = React.useState<ColDef<ClientInterest>[]>([
    { field: "date", filter: 'agDateColumnFilter', sortable: true, resizable: true, width: 80 },
    { field: "isin", filter: 'agTextColumnFilter', sortable: true, resizable: true, width: 110 },
    { field: "side", filter: 'agTextColumnFilter', sortable: true, resizable: true, width: 80 },
    { field: "maturityFrom", filter: 'agDateColumnFilter', sortable: true, resizable: true, width: 80 },
    { field: "maturityTo", filter: 'agDateColumnFilter', sortable: true, resizable: true, width: 80 },
    { field: "size", filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 80 },
    { field: "couponFrom", filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 80 },
    { field: "couponTo", filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 80 },
    { field: "industry", filter: 'agTextColumnFilter', sortable: true, resizable: true, width: 110 },
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
          rowData={clientInterestList}
          rowSelection='single'
          columnDefs={columnDefs}>
        </AgGridReact>
      </div>
    </div>
  )
}

export default ClientInterests