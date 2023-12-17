export default interface MarketActivity {
  date: string
  isin: string
  side: 'BUY' | 'SELL'
  sizeDelta: number
  vwap: number
  highPrice: number
  lowPrice: number
  lastPrice: number
  vwas: number
  highSpread: number
  lowSpread: number
}