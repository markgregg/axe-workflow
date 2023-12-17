import * as React from 'react'
import { styleFromTheme } from "../../themes"
import { DataSource, Matcher, Nemonic, SourceItem, defaultComparison, numberComparisons, stringComparisons } from 'multi-source-select'
import MultiSelect from 'multi-source-select'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { extractDate, getSize, isSize } from '../../utils'
import Bond from '../../types/Bond'
import { setContext } from '../../store/contextSlice'
import './CommandBar.css'
import { productList } from '../Bonds/Products'
import { Insight, clientInsightList } from '../ClientInsight/ClientInsight'
import { setClient } from '../../store/ClientSlice'

interface CommandBarProps {
  onClientChanged: (matcher?: Matcher[]) => void
}

const CommandBar: React.FC<CommandBarProps> = ({ onClientChanged }) => {
  const theme = useAppSelector((state) => state.theme.theme)
  const [bonds, setBonds] = React.useState<Bond[]>([])
  const [clients, setClients] = React.useState<Insight[]>([])

  const dispatch = useAppDispatch()
  const client = useAppSelector((state) => state.selectedClient)

  const findItems = React.useCallback((text: string, field: 'isin' | 'currency' | 'issuer'): SourceItem[] => {
    const uniqueItems = new Set<string>()
    bonds.forEach(bond => {
      const value = bond[field]
      if (value &&
        value.toUpperCase().includes(text.toUpperCase())) {
        uniqueItems.add(value)
      }
    })
    let items = [...uniqueItems].sort()
    if (items.length > 10) {
      items = items?.slice(10)
    }
    return items
  }, [bonds])

  const findClients = React.useCallback((text: string, field: 'company'): SourceItem[] => {
    const uniqueItems = new Set<string>()
    clients.forEach(client => {
      const value = client[field]
      if (value &&
        value.toUpperCase().includes(text.toUpperCase())) {
        uniqueItems.add(value)
      }
    })
    let items = [...uniqueItems].sort()
    if (items.length > 10) {
      items = items?.slice(10)
    }
    return items
  }, [clients])

  const functions = React.useMemo<Nemonic[]>(() => [
    {
      name: 'Interest',
      optionalDataSources: ['Coupon', 'Size', 'MaturityDate', 'CountryRegion', 'Sector', 'ISIN', 'Side']
    },

  ], [])

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
          source: async (text) => new Promise((resolve) => {
            setTimeout(
              () =>
                resolve(findItems(text, 'isin')
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
          source: async (text) => new Promise((resolve) => {
            setTimeout(
              () =>
                resolve(findItems(text, 'currency')
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
        },
        {
          ignoreCase: true,
          searchStartLength: 3,
          source: async (text) => new Promise((resolve) => {
            setTimeout(
              () =>
                resolve(findItems(text, 'issuer')
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
      name: 'Client',
      title: 'Client',
      comparisons: defaultComparison,
      precedence: 3,
      selectionLimit: 2,
      definitions: [
        {
          ignoreCase: true,
          searchStartLength: 1,
          source: async (text) => new Promise((resolve) => {
            setTimeout(
              () =>
                resolve(findClients(text, 'company')
                ),
              5,
            )
          })
        }
      ]
    },
  ],
    [findItems]
  )

  React.useEffect(() => {
    setBonds(productList)
    setClients(clientInsightList)
  }, [])

  const handleAction = (matchers: Matcher[], func?: string) => {
    if (func) {
      if (client.client) {
        const valueMatchers = matchers.filter(matcher => matcher.source.toLowerCase() !== 'actions')
        if (onClientChanged) {
          onClientChanged(valueMatchers)
        }
      }
    } else {
      if (matchers.find(m => m.source === 'Client')) {
        const client = matchers.find(m => m.source === 'Client')?.text
        if (client) {
          if (onClientChanged) {
            onClientChanged()
          }
          dispatch(setClient(client))
        }
      } else {
        const contextMatchers = matchers?.filter(m => m.source !== 'TradeDate' && m.source !== 'Client') ?? []
        if (matchers.length > 0) {
          dispatch(setContext(contextMatchers))
        }
      }
    }
  }

  return (
    <div>
      <div
        className='mainMultiselectContainer'
      >
        <div className='mainMultiselect'>
          <MultiSelect
            functions={functions}
            dataSources={dataSource}
            styles={styleFromTheme(theme)}
            showCategories={true}
            hideToolTip={true}
            onComplete={handleAction}
          />
        </div>
      </div>
    </div>
  )
}

export default CommandBar