import * as React from 'react'
import { styleFromTheme } from "../../themes"
import { DataSource, Matcher, SourceItem, defaultComparison, numberComparisons, stringComparisons } from 'multi-source-select'
import MultiSelect from 'multi-source-select'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { extractDate, getSize, isSize } from '../../utils'
import { fetchBondsAndCache } from '../../services/bondsService'
import Bond from '../../types/Bond'
import { setContext } from '../../store/contextSlice'
import { getColumn, getFilterType } from '../../types/AgFilter'
import './CommandBar.css'


type Operation = (bond: any) => boolean

const textCondition = (matcher: Matcher): Operation => {
  const field = getColumn(matcher.source)
  switch (matcher.comparison) {
    case '!':
      return (bond) => (bond[field] as string) !== matcher.value
    case '*':
      return (bond) => (bond[field] as string).includes(matcher.value as string)
    case '!*':
      return (bond) => !(bond[field] as string).includes(matcher.value as string)
    case '>*':
      return (bond) => (bond[field] as string).startsWith(matcher.value as string)
    case '<*':
      return (bond) => (bond[field] as string).endsWith(matcher.value as string)
    default:
      return (bond) => bond[field] === matcher.value
  }
}

const numberCondition = (matcher: Matcher): Operation => {
  const field = getColumn(matcher.source)
  switch (matcher.comparison) {
    case '!':
      return (bond) => bond[field] === matcher.value
    case '>':
      return (bond) => bond[field] > matcher.value
    case '<':
      return (bond) => bond[field] < matcher.value
    case '>=':
      return (bond) => bond[field] >= matcher.value
    case '<=':
      return (bond) => bond[field] <= matcher.value
    default:
      return (bond) => bond[field] === matcher.value
  }
}

const dateCondition = (matcher: Matcher): Operation => {
  const field = getColumn(matcher.source)
  switch (matcher.comparison) {
    case '!':
      return (bond) => bond[field] === matcher.value
    case '>':
      return (bond) => bond[field] > matcher.value
    case '<':
      return (bond) => bond[field] < matcher.value
    case '>=':
      return (bond) => bond[field] >= matcher.value
    case '<=':
      return (bond) => bond[field] <= matcher.value
    default:
      return (bond) => bond[field] === matcher.value
  }
}

const operator = (matcher: Matcher, comp1: Operation, comp2: Operation): Operation => {
  switch (matcher.operator.toLowerCase()) {
    case 'or':
    case '|':
      return (bond) => comp1(bond) || comp2(bond)
  }
  return (bond) => comp1(bond) && comp2(bond)
}

const operation = (matcher: Matcher): Operation => {
  switch (getFilterType(matcher.source)) {
    case 'date':
      return dateCondition(matcher)
    case 'number':
      return numberCondition(matcher)
  }
  return textCondition(matcher)
}

const getPredicate = (matchers: Matcher[]): Operation | null => {
  let op: Operation | null = null
  matchers.filter(matcher =>
    matcher.comparison !== '(' &&
    matcher.comparison !== ')' &&
    !matcher.changing &&
    matcher.source !== 'Channel'
  ).forEach(matcher => {
    const currentOp = operation(matcher)
    op = (op !== null)
      ? operator(matcher, op, currentOp)
      : currentOp
  })
  return op
}

const CommandBar = () => {
  const theme = useAppSelector((state) => state.theme.theme)
  const [bonds, setBonds] = React.useState<Bond[]>([])

  const dispatch = useAppDispatch()
  const context = useAppSelector((state) => state.context)

  const findItems = React.useCallback((text: string, field: 'isin' | 'currency' | 'issuer', op: 'and' | 'or' | null, matchers?: Matcher[]): SourceItem[] => {
    const uniqueItems = new Set<string>()
    const predicate = matchers && op !== 'or' ? getPredicate(matchers) : null
    bonds.forEach(bond => {
      if (!predicate || predicate(bond)) {
        const value = bond[field]
        if (value &&
          value.toUpperCase().includes(text.toUpperCase())) {
          uniqueItems.add(value)
        }
      }
    })
    let items = [...uniqueItems].sort()
    if (items.length > 10) {
      items = items?.slice(10)
    }
    return items
  }, [bonds])

  const dataSource = React.useMemo<DataSource[]>(() => [
    {
      name: 'ISIN',
      title: 'ISIN Code',
      comparisons: defaultComparison,
      precedence: 3,
      ignoreCase: true,
      searchStartLength: 1,
      selectionLimit: 2,
      source: async (text, op, matchers) => new Promise((resolve) => {
        setTimeout(
          () =>
            resolve(findItems(text, 'isin', op, matchers)
            ),
          5,
        )
      })
    },
    {
      name: 'Currency',
      title: 'Currency Code',
      comparisons: defaultComparison,
      precedence: 2,
      ignoreCase: true,
      selectionLimit: 2,
      source: async (text, op, matchers) => new Promise((resolve) => {
        setTimeout(
          () =>
            resolve(findItems(text, 'currency', op, matchers)
            ),
          5,
        )
      })
    },
    {
      name: 'Coupon',
      title: 'Coupon',
      comparisons: numberComparisons,
      precedence: 1,
      selectionLimit: 2,
      match: (text: string) => !isNaN(Number(text)),
      value: (text: string) => Number.parseFloat(text),
    },
    {
      name: 'HairCut',
      title: 'Hair Cut',
      comparisons: numberComparisons,
      precedence: 1,
      selectionLimit: 2,
      match: (text: string) => !isNaN(Number(text)),
      value: (text: string) => Number.parseFloat(text),
    },
    {
      name: 'Price',
      title: 'Price',
      comparisons: numberComparisons,
      precedence: 4,
      selectionLimit: 2,
      functional: true,
      match: (text: string) => !isNaN(Number(text)),
      value: (text: string) => Number.parseFloat(text),
    },
    {
      name: 'Size',
      title: 'Size',
      comparisons: numberComparisons,
      precedence: 4,
      selectionLimit: 2,
      match: (text: string) => isSize(text),
      value: (text: string) => getSize(text),
    },
    {
      name: 'Side',
      title: 'Side',
      comparisons: stringComparisons,
      precedence: 9,
      ignoreCase: true,
      selectionLimit: 1,
      source: ['BUY', 'SELL']
    },
    {
      name: 'Issuer',
      title: 'Issuer',
      comparisons: stringComparisons,
      precedence: 1,
      ignoreCase: true,
      selectionLimit: 2,
      match: /^[a-zA-Z ]{2,}$/,
      value: (text: string) => text,
    },
    {
      name: 'Issuer2',
      title: 'Issuer',
      comparisons: defaultComparison,
      precedence: 1,
      ignoreCase: false,
      searchStartLength: 3,
      selectionLimit: 2,
      source: async (text, op, matchers) => new Promise((resolve) => {
        setTimeout(
          () =>
            resolve(findItems(text, 'issuer', op, matchers)
            ),
          5,
        )
      })
    },
    {
      name: 'MaturityDate',
      title: 'Maturity Date',
      comparisons: numberComparisons,
      precedence: 4,
      selectionLimit: 2,
      match: /^[0-9]{0,2}[yYmM]$/,
      value: (text: string) => extractDate(text),
    },
    {
      name: 'IssueDate',
      title: 'Issue Date',
      comparisons: numberComparisons,
      precedence: 3,
      selectionLimit: 2,
      match: /^[0-9]{0,2}[yYmM]$/,
      value: (text: string) => extractDate(text),
    },
    {
      name: 'TradeDate',
      title: 'Trade Date',
      comparisons: numberComparisons,
      precedence: 4,
      selectionLimit: 2,
      functional: true,
      match: /^[0-9]{0,2}[yYmM]$/,
      value: (text: string) => extractDate(text),
    },
    {
      name: 'Sector',
      title: 'Sector',
      comparisons: stringComparisons,
      precedence: 8,
      ignoreCase: true,
      searchStartLength: 2,
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
  ],
    [findItems]
  )

  React.useEffect(() => {
    fetchBondsAndCache()
      .then(setBonds)
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

  const handleMatchersChanged = (matchers: Matcher[]) => {
    dispatch(setContext(matchers))
  }

  return (
    <div>
      <div className='mainMultiselectContainer'>
        <div className='mainMultiselect'>
          <MultiSelect
            dataSources={dataSource}
            matchers={context.matchers}
            styles={styleFromTheme(theme)}
            onMatchersChanged={handleMatchersChanged}
            showCategories={true}
            hideToolTip={true}
          />
        </div>
      </div>
    </div>
  )
}

export default CommandBar