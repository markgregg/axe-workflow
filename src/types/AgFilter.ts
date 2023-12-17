import { Matcher } from 'multi-source-select'
import { CellClassParams, CellStyle, CellStyleFunc, ValueFormatterParams } from 'ag-grid-community'
import { Insight } from '@/elements/ClientInsight/ClientInsight'
import Reference from './Reference'


export const asHypen = (params: ValueFormatterParams<any, any>) => {
  if (!params.value || params.value === 0) {
    return '-'
  }
  return params.value
}

export const buySellStyle: CellStyleFunc<any, any> = (params: CellClassParams<any, any>): CellStyle => {
  return {
    backgroundColor: params.value === '' ? 'white' : params.value === 'BUY' ? 'rgb(6,104,178)' : 'orange',
    color: 'white'
  }
}

export const buyStyle: CellStyleFunc<Insight, any> = (): CellStyle => {
  return {
    color: 'rgb(6,104,178)'
  }
}
export const sellStyle: CellStyleFunc<Insight, any> = (): CellStyle => {
  return {
    color: 'orange'
  }
}

export const refBuyStyle: CellStyleFunc<Reference, any> = (): CellStyle => {
  return {
    backgroundColor: 'rgb(136,226,18)'
  }
}

export const refSellStyle: CellStyleFunc<Reference, any> = (): CellStyle => {
  return {
    backgroundColor: 'rgb(255,150,154)'
  }
}

export const graidentStyle: CellStyleFunc<any, any> = (params: CellClassParams<any, any>): CellStyle => {
  return {
    background: `linear-gradient(90deg, rgba(255,0,0,1) 0%, rgb(125, 255, 125) ${100 - (params.value ?? 0)}%, rgba(0,255,0,1) 100%)`
  }
}

export const bidAskValueStyle: CellStyleFunc<Insight, any> = (params: CellClassParams<Insight, any>): CellStyle => {
  return {
    color: params.value > 0 ? 'rgb(6,104,178)' : params.value < 0 ? 'orange' : 'black'
  }
}

export const currencyValueStyleMetallic: CellStyleFunc<Insight, any> = (params: CellClassParams<Insight, any>): CellStyle => {
  return {
    color: params && params.value && params.value >= 0 ? '#d3d3d3' : 'red'
  }
}

export type AgFilterType = 'date' | 'text' | 'number'
export type AgOperator = 'AND' | 'OR'

export interface AgDateFilter {
  filterType: 'date'
  dateFrom: Date | string | null
  dateTo: Date | string | null
  type: 'equals' | 'notEqual' | 'greaterThan' | 'lessThan' | 'greaterThanOrEqual' | 'lessThanOrEqual'
}

export interface AgNumberFilter {
  filterType: 'number'
  filter: number
  type: 'equals' | 'notEqual' | 'greaterThan' | 'lessThan' | 'greaterThanOrEqual' | 'lessThanOrEqual'
}

export interface AgTextFilter {
  filterType: 'text'
  filter: string
  type: 'equals' | 'notEqual' | 'contains' | 'notContains' | 'startsWith' | 'endsWith'
}

type AgSingleFilter = AgDateFilter | AgNumberFilter | AgTextFilter

export interface AgDualFilter {
  condition1: AgSingleFilter
  condition2: AgSingleFilter
  filterType: 'date' | 'number' | 'text'
  operator: AgOperator
}

type AgFilter = AgSingleFilter | AgDualFilter

export const getColumn = (source: string): string => {
  switch (source) {
    case 'MaturityDate':
      return 'maturityDate'
    case 'IssueDate':
      return 'issueDate'
    case 'HairCut':
      return 'hairCut'
    case 'Issuer2':
      return 'issuer'
    case "Axes":
      return "axeType"
  }
  return source.toLowerCase()
}

export const getFilterType = (source: string): AgFilterType => {
  switch (source) {
    case 'ISIN':
    case 'Currency':
    case 'Issuer':
    case 'Issuer2':
    case 'Side':
    case 'Client':
    case "Axes":
    case "Sector":
      return 'text'
    case 'MaturityDate':
    case 'IssueDate':
      return 'date'
    default:
      return 'number'
  }
}

const getTextComparisonType = (comparison: string):
  'equals' | 'notEqual' | 'contains' | 'notContains' | 'startsWith' | 'endsWith' => {
  switch (comparison) {
    case '!':
      return 'notEqual'
    case '*':
      return 'contains'
    case '!*':
      return 'notContains'
    case '>*':
      return 'startsWith'
    case '<*':
      return 'endsWith'
    default:
      return 'equals'
  }
}

const getDateNumberComparisonType = (comparison: string):
  'equals' | 'notEqual' | 'greaterThan' | 'lessThan' | 'greaterThanOrEqual' | 'lessThanOrEqual' => {
  switch (comparison) {
    case '!':
      return 'notEqual'
    case '>':
      return 'greaterThan'
    case '<':
      return 'lessThan'
    case '>=':
      return 'greaterThanOrEqual'
    case '<=':
      return 'lessThanOrEqual'
    default:
      return 'equals'
  }
}

const getOperator = (operator: string): AgOperator => {
  return operator === '&' || operator === 'and'
    ? 'AND'
    : 'OR'
}

const createCondition = (matcher: Matcher): AgSingleFilter => {
  switch (getFilterType(matcher.source)) {
    case 'date':
      const dateParts = typeof matcher.value === 'string' ? matcher.value.split('/') : []
      return {
        filterType: 'date',
        dateFrom: typeof matcher.value === 'string'
          ? `${dateParts[2]}-${dateParts[1].length === 1 ? '0' + dateParts[1] : dateParts[1]}-${dateParts[0].length === 1 ? '0' + dateParts[0] : dateParts[0]}`
          : matcher.value instanceof Date
            ? matcher.value
            : new Date(matcher.value),
        dateTo: null,
        type: getDateNumberComparisonType(matcher.comparison)
      }
    case 'number':
      return {
        filterType: 'number',
        filter: typeof matcher.value === 'number'
          ? matcher.value
          : Number(matcher.value.toString()),
        type: getDateNumberComparisonType(matcher.comparison)
      }
    case 'text':
      return {
        filterType: 'text',
        filter: typeof matcher.value === 'string'
          ? matcher.value
          : matcher.value.toString(),
        type: getTextComparisonType(matcher.comparison)
      }
  }
}

export const createFilter = (matchers: Matcher[]): AgFilter => {
  if (matchers.length === 1) {
    return createCondition(matchers[0])
  } else {
    const condition1 = createCondition(matchers[0])
    const condition2 = createCondition(matchers[1])
    return {
      condition1,
      condition2,
      filterType: condition1.filterType,
      operator: getOperator(matchers[1].operator)
    }

  }
}

export default AgFilter