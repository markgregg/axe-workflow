export interface ClientInterest {
  date: string
  isin?: string
  maturityFrom?: string
  maturityTo?: string
  side: 'BUY' | 'SELL'
  size?: number
  couponFrom?: number
  couponTo?: number
  industry?: string
}

export const clientInterestList: ClientInterest[] = [
  {
    "date": "20-10-2023",
    "maturityFrom": "20y",
    "maturityTo": "25y",
    "side": 'SELL',
    "industry": "Technology"
  },
  {
    "date": "01-10-2023",
    "isin": "XS1848875172",
    "side": 'BUY',
  },
  {
    "date": "16-09-2023",
    "isin": "IT0004026420",
    "side": 'SELL',
  },
  {
    "date": "05-09-2023",
    "maturityFrom": "5y",
    "maturityTo": "9y",
    "side": 'BUY',
    "industry": "Technology"
  },
  {
    "date": "05-09-2023",
    "couponFrom": 0.52,
    "couponTo": 0.95,
    "side": 'BUY',
    "industry": "Metals"
  },
]