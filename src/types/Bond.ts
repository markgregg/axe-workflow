
export default interface Bond {
  isin: string
  axed: boolean
  side?: 'BUY' | 'SELL'
  rv: number
  currency: string
  ticker: string
  sector: string
  issueDate: string
  maturityDate: string
  price: number
  size: number
  coupon: number
  issuer: string
  hairCut: number
}
