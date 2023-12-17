import * as React from 'react'
import { getAgGridStyle, styleFromTheme } from "../../themes"
import MultiSelect, { DataSource, Matcher, SourceItem, defaultComparison, numberComparisons, stringComparisons } from 'multi-source-select'
import { AgGridReact } from "ag-grid-react"
import Bond from '../../types/Bond'
import { ColDef, IRowNode, RowClassParams, RowClickedEvent } from 'ag-grid-community'
import { buySellStyle, createFilter, getColumn } from '../../types/AgFilter'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { extractDate, getSize, isSize, isUnique } from '../../utils'
import AxeRender from '../../types/AxeRender'
import './Bonds.css'
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"
import { productList } from './Products'
import { setProduct } from '../../store/productSlice'
import Button from '../Button'
import { TiExport } from "react-icons/ti";

const commandHistory: (Matcher[])[] = []
const MAX_COMMANDS = 5

const Bonds = () => {
  const agGridRef = React.useRef<AgGridReact<Bond> | null>(null)
  const [rowData, setRowData] = React.useState<Bond[]>()
  const [matchers, setMatchers] = React.useState<Matcher[]>([])
  const [columnDefs] = React.useState<ColDef<Bond>[]>([
    { field: "axeType", headerName: 'Type', filter: 'agTextColumnFilter', sortable: true, resizable: true, width: 60, cellRenderer: AxeRender },
    { field: "isin", filter: 'agTextColumnFilter', sortable: true, resizable: true, width: 90 },
    { field: "side", filter: 'agTextColumnFilter', sortable: true, resizable: true, width: 60, cellStyle: buySellStyle },
    { field: "currency", headerName: 'CCY', filter: 'agTextColumnFilter', sortable: true, resizable: true, width: 60 },
    { field: "ticker", filter: 'agTextColumnFilter', sortable: true, resizable: true, width: 90 },
    { field: "sector", filter: 'agTextColumnFilter', sortable: true, resizable: true, width: 90 },
    { field: "esg", headerName: 'ESG', filter: 'agTextColumnFilter', sortable: true, resizable: true, width: 90 },
    { field: "zSpread", filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 80 },
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

  React.useEffect(() => {
    setRowData(productList)
  }, [])

  const handleSelection = (event: RowClickedEvent<Bond>) => {
    if (event.data?.isin) {
      dispatch(setProduct({ isin: event.data.isin, side: event.data.side }))
    }
  }

  const findItems = React.useCallback((text: string, field: 'isin' | 'currency' | 'issuer', op: 'and' | 'or' | null): SourceItem[] => {
    const uniqueItems = new Set<string>()
    const callback = (row: IRowNode<Bond>) => {
      if (row.data) {
        const value = row.data[field]
        if (value &&
          value.toUpperCase().includes(text.toUpperCase())) {
          uniqueItems.add(value)
        }
      }
    }
    if (op === 'or') {
      agGridRef.current?.api.forEachLeafNode(callback)
    } else {
      agGridRef.current?.api.forEachNodeAfterFilter(callback)
    }
    let items = [...uniqueItems].sort()
    if (items.length > 10) {
      items = items?.slice(10)
    }
    return items
  }, [])

  const dataSource = React.useMemo<DataSource[]>(() => [
    {
      name: 'ISIN',
      title: 'ISIN Code',
      comparisons: defaultComparison,
      precedence: 3,
      selectionLimit: 2,
      definitions: [
        {
          ignoreCase: true,
          searchStartLength: 1,
          source: async (text, op) => new Promise((resolve) => {
            setTimeout(
              () =>
                resolve(findItems(text, 'isin', op)
                ),
              5,
            )
          })
        }
      ]
    },
    {
      name: 'Currency',
      title: 'Currency Code',
      comparisons: defaultComparison,
      precedence: 2,
      selectionLimit: 2,
      definitions: [
        {
          ignoreCase: true,
          source: async (text, op) => new Promise((resolve) => {
            setTimeout(
              () =>
                resolve(findItems(text, 'currency', op)
                ),
              5,
            )
          })
        }
      ]
    },
    {
      name: 'Coupon',
      title: 'Coupon',
      comparisons: numberComparisons,
      precedence: 1,
      selectionLimit: 2,
      definitions: [
        {
          match: (text: string) => !isNaN(Number(text)),
          value: (text: string) => Number.parseFloat(text),
        }
      ]
    },
    {
      name: 'HairCut',
      title: 'Hair Cut',
      comparisons: numberComparisons,
      precedence: 1,
      selectionLimit: 2,
      definitions: [
        {
          match: (text: string) => !isNaN(Number(text)),
          value: (text: string) => Number.parseFloat(text),
        }
      ]
    },
    {
      name: 'Price',
      title: 'Price',
      comparisons: numberComparisons,
      precedence: 4,
      selectionLimit: 2,
      functional: true,
      definitions: [
        {
          match: (text: string) => !isNaN(Number(text)),
          value: (text: string) => Number.parseFloat(text),
        }
      ]
    },
    {
      name: 'Size',
      title: 'Size',
      comparisons: numberComparisons,
      precedence: 4,
      selectionLimit: 2,
      definitions: [
        {
          match: (text: string) => isSize(text),
          value: (text: string) => getSize(text),
        }
      ]
    },
    {
      name: 'Side',
      title: 'Side',
      comparisons: stringComparisons,
      precedence: 9,
      selectionLimit: 1,
      definitions: [
        {
          ignoreCase: true,
          source: ['BUY', 'SELL']
        }
      ]
    },
    {
      name: 'Issuer',
      title: 'Issuer',
      comparisons: stringComparisons,
      precedence: 1,
      selectionLimit: 2,
      definitions: [
        {
          match: /^[a-zA-Z ]{2,}$/,
          value: (text: string) => text,
        }
      ]
    },
    {
      name: 'Issuer2',
      title: 'Issuer',
      comparisons: defaultComparison,
      precedence: 1,
      selectionLimit: 2,
      definitions: [
        {
          ignoreCase: true,
          searchStartLength: 3,
          source: async (text, op) => new Promise((resolve) => {
            setTimeout(
              () =>
                resolve(findItems(text, 'issuer', op)
                ),
              5,
            )
          })
        }
      ]
    },
    {
      name: 'MaturityDate',
      title: 'Maturity Date',
      comparisons: numberComparisons,
      precedence: 4,
      selectionLimit: 2,
      definitions: [
        {
          match: /^[0-9]{0,2}[yYmM]$/,
          value: (text: string) => extractDate(text),
        }
      ]
    },
    {
      name: 'IssueDate',
      title: 'Issue Date',
      comparisons: numberComparisons,
      precedence: 3,
      selectionLimit: 2,
      definitions: [
        {
          match: /^[0-9]{0,2}[yYmM]$/,
          value: (text: string) => extractDate(text),
        }
      ]
    },
    {
      name: 'TradeDate',
      title: 'Trade Date',
      comparisons: numberComparisons,
      precedence: 4,
      selectionLimit: 2,
      functional: true,
      definitions: [
        {
          match: /^[0-9]{0,2}[yYmM]$/,
          value: (text: string) => extractDate(text),
        }
      ]
    },
    {
      name: 'Sector',
      title: 'Sector',
      comparisons: stringComparisons,
      precedence: 8,
      definitions: [
        {
          searchStartLength: 2,
          ignoreCase: true,
          source: [
            'Energy',
            'Materials',
            'Industrials',
            'Consumer',
            'Health',
            'Financials',
            'Technology',
            'Communications',
            'Utilities'
          ]
        }
      ]
    },
    {
      name: 'Axes',
      title: 'Axes',
      comparisons: numberComparisons,
      precedence: 10,
      selectionLimit: 1,
      definitions: [
        {
          ignoreCase: true,
          source: ['Axed', 'Pref', 'New']
        }
      ]
    },
  ],
    [findItems]
  )

  const matchersChanged = React.useCallback((newMatchers: Matcher[]) => {
    if (commandHistory.length === MAX_COMMANDS) {
      commandHistory.splice(0, 1)
    }
    commandHistory.push(newMatchers)
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
    setMatchers(newMatchers)
  }, [columnDefs])

  React.useEffect(() => {
    matchersChanged(context.matchers)
  }, [context.matchers, matchersChanged])

  const getRowStyle = (params: RowClassParams<Bond>) => {
    if (params.data?.axeType === 'Axe') {
      return { backgroundColor: 'rgb(255, 228, 178)' }
    } else if (params.data?.axeType === 'New') {
      return { backgroundColor: 'rgb(255, 255, 163)' }
    } else if (params.data?.axeType === 'Pref') {
      return { backgroundColor: 'rgb(181, 181, 248)' }
    }
  };

  return (
    <div className='mainBlotter'>
      <div>
        <div className='mainMultiselectBonds'>
          <div style={{ flexGrow: 1 }}>
            <MultiSelect
              matchers={matchers}
              dataSources={dataSource}
              onMatchersChanged={matchersChanged}
              styles={styleFromTheme(theme)}
              maxDropDownHeight={120}
              showCategories={true}
              hideToolTip={false}
              operators='AgGrid'
            />
          </div>
          <Button Icon={TiExport} />
        </div>
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
          onRowClicked={handleSelection}
          getRowStyle={getRowStyle}
          columnDefs={columnDefs}>
        </AgGridReact>
      </div>
    </div>
  )
}

export default Bonds