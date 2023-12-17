import * as React from 'react'
import { getAgGridStyle } from "../../themes"
import { AgGridReact } from "ag-grid-react"
import { ColDef } from 'ag-grid-community'
import { useAppSelector } from '../../hooks/redux'
import './ReferencePrice.css'
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"
import Reference from '@/types/Reference'
import { refBuyStyle, refSellStyle } from '../../types/AgFilter'

const ReferencePrice = () => {
  const agGridRef = React.useRef<AgGridReact<Reference> | null>(null)
  const [rowData, setRowData] = React.useState<Reference[]>()
  const [columnDefs] = React.useState<ColDef<Reference>[]>([
    { field: "source", filter: 'agTextColumnFilter', sortable: true, resizable: true, width: 90 },
    { field: "bid", filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 60, cellStyle: refBuyStyle },
    { field: "spread", filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 65 },
    { field: "offer", filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 60, cellStyle: refSellStyle },
    { field: "price", filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 60 },
    { field: "yield", filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 60 },
  ])

  const theme = useAppSelector((state) => state.theme.theme)

  React.useEffect(() => {
    setRowData([
      {
        source: 'Internal',
        bid: 2.5,
        spread: 0,
        offer: 2.5,
        price: 99.95,
        yield: 2.92
      },
      {
        source: 'Max CP+',
        bid: 4.5,
        spread: 0,
        offer: 4.5,
        price: 98.95,
        yield: 3.92
      },
      {
        source: 'ICE CEP',
        bid: 2.4,
        spread: 0,
        offer: 2.4,
        price: 97.75,
        yield: 3.45
      }, {
        source: 'Bond Port',
        bid: 4.2,
        spread: 0,
        offer: 4.2,
        price: 96.91,
        yield: 3.01
      }
    ])
  }, [])


  return (
    <div className='mainBlotter'>
      <div
        className="ag-theme-alpine agBondsGrid"
        style={getAgGridStyle(theme)}
      >
        <AgGridReact
          ref={agGridRef}
          rowData={rowData}
          rowSelection='single'
          columnDefs={columnDefs}>
        </AgGridReact>
      </div>
    </div>
  )
}

export default ReferencePrice