import * as React from 'react'
import { useAppSelector } from '../../hooks/redux'
import { getAgGridStyle, styleDivFromTheme } from '../../themes'
import { ClientInterest, clientInterestList } from './clientInterests'
import { AgGridReact } from "ag-grid-react"
import { ColDef } from 'ag-grid-community'
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"
import './ClientInterests.css'
import { MdAdd } from "react-icons/md";
import Button from '../Button'
import { Matcher } from 'multi-source-select'
import EnterInterest from '../EnterInterest'
import Interest from '../../types/Interest'
import { buySellStyle } from '../../types/AgFilter'

interface ClientInterestProps {
  enterInterest?: Matcher[] | null
  onInterestEntered?: () => void
}

const ClientInterests: React.FC<ClientInterestProps> = ({ enterInterest, onInterestEntered }) => {
  const theme = useAppSelector((state) => state.theme.theme)
  const [interest, setInterest] = React.useState<Interest | null>(null)
  const [columnDefs] = React.useState<ColDef<ClientInterest>[]>([
    { field: "date", filter: 'agDateColumnFilter', sortable: true, resizable: true, width: 80 },
    { field: "isin", filter: 'agTextColumnFilter', sortable: true, resizable: true, width: 100 },
    { field: "side", filter: 'agTextColumnFilter', sortable: true, resizable: true, width: 60, cellStyle: buySellStyle },
    { field: "maturityFrom", filter: 'agDateColumnFilter', sortable: true, resizable: true, width: 100 },
    { field: "maturityTo", filter: 'agDateColumnFilter', sortable: true, resizable: true, width: 100 },
    { field: "size", filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 70 },
    { field: "couponFrom", filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 80 },
    { field: "couponTo", filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 80 },
    { field: "industry", filter: 'agTextColumnFilter', sortable: true, resizable: true, width: 110 },
  ])


  React.useEffect(() => {
    if (enterInterest) {
      const isin = enterInterest.find(m => m.source.toLowerCase() === 'isin')?.text
      const side = enterInterest.find(m => m.source.toLowerCase() === 'side')?.text as 'BUY' | 'SELL'
      const sector = enterInterest.find(m => m.source.toLowerCase() === 'sector')?.text
      const size = enterInterest.find(m => m.source.toLowerCase() === 'sector')?.value as number
      const maturityFrom = enterInterest.find(m => m.source.toLowerCase() === 'maturitydate' && m.comparison === '>')?.text
      const maturityTo = enterInterest.find(m => m.source.toLowerCase() === 'maturitydate' && m.comparison === '>')?.text
      const couponFrom = enterInterest.find(m => m.source.toLowerCase() === 'maturitydate' && m.comparison === '>')?.value as number
      const couponTo = enterInterest.find(m => m.source.toLowerCase() === 'maturitydate' && m.comparison === '>')?.value as number

      const interest: Interest = {
        isin,
        side,
        sector,
        size,
        maturityFrom,
        maturityTo,
        couponFrom,
        couponTo
      }
      setInterest(interest)
    }
  }, [enterInterest])


  return (
    <div
      className='clientInterestsMain'
      style={styleDivFromTheme(theme)}
    >
      <div className='clientInterestsButtons'>
        <Button Icon={MdAdd} onClick={() => setInterest({})} />
      </div>
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
      {
        interest &&
        <EnterInterest interest={interest} onClose={() => {
          setInterest(null)
          if (onInterestEntered) {
            onInterestEntered()
          }
        }} />
      }
    </div>
  )
}

export default ClientInterests