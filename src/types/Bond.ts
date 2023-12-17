
export default interface Bond {
  axeType?: 'New' | 'Pref' | 'Axe'
  isin: string
  esg?: 'Green' | 'Eco' | 'Sustainable'
  side?: 'BUY' | 'SELL'
  currency: string
  zSpread: number
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

