import * as React from 'react'
import { getAgGridStyle } from "../../themes"
import { AgGridReact } from "ag-grid-react"
import { ColDef } from 'ag-grid-community'
import { buySellStyle } from '../../types/AgFilter'
import { useAppSelector } from '../../hooks/redux'
import './ClientActivity.css'
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"
import InternalActivity from '@/types/InternalActivity'
import { internalActivityList } from '../ActivityBlotter/InternalActivity'

const ClientActivity: React.FC = () => {
  const agGridRef = React.useRef<AgGridReact<InternalActivity> | null>(null)
  const [rowData, setRowData] = React.useState<InternalActivity[]>()
  const [columnDefs] = React.useState<ColDef<InternalActivity>[]>([
    { field: "date", filter: 'agDateColumnFilter', sortable: true, resizable: true, width: 90 },
    { field: "isin", filter: 'agTextColumnFilter', sortable: true, resizable: true, width: 110 },
    { field: "status", filter: 'agTextColumnFilter', sortable: true, resizable: true, width: 100 },
    { field: "side", filter: 'agTextColumnFilter', sortable: true, resizable: true, width: 80, cellStyle: buySellStyle },
    { field: "isin", filter: 'agTextColumnFilter', sortable: true, resizable: true, width: 110 },
    { field: "price", filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 110 },
    { field: "yield", filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 110 },
    { field: "spread", filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 110 },
    { field: "salesperson", filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 80 },
    { field: "platform", filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 80 },
    { field: "trader", filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 80 },
    { field: "customerName", filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 80 },
  ])

  const theme = useAppSelector((state) => state.theme.theme)
  const client = useAppSelector((state) => state.selectedClient)

  React.useEffect(() => {
    setRowData(internalActivityList.filter(a => a.customerFirmName === client.client))
  }, [client])

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

export default ClientActivity