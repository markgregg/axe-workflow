export default interface Interest {
  isin?: string
  maturityFrom?: string
  maturityTo?: string
  couponFrom?: number
  couponTo?: number
  industry?: string
  side: 'BUY' | 'SELL'
  size?: number
}

export const defaultInterest: Interest = {
  side: 'BUY'
}