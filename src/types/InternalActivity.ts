export default interface InternalActivity {
  date: string
  isin: string
  status: string
  side: 'BUY' | 'SELL'
  customerFirmName: string
  price: number
  yield: number
  spread: number
  salesperson: string
  platform: string
  trader: string
  customerName: string
}
