import Interest from '@/types/Interest'
import * as React from 'react'
import { useAppSelector } from '../../hooks/redux'
import { styleDivFromTheme } from '../../themes'
import './EnterInterest.css'

interface EnterInterestProps {
  interest: Interest
  onClose: () => void
}

const EnterInterest: React.FC<EnterInterestProps> = ({ interest, onClose }) => {
  const theme = useAppSelector((state) => state.theme.theme)


  return (
    <form
      className='interestMain'
      style={styleDivFromTheme(theme)}
      onSubmit={onClose}
    >
      <div className='interestGroup'>
        <label className='interestLabel'>Buy/Sell:</label>
        <input type="text" id="buysell" value={interest.side} style={{ width: 40 }} />
      </div>
      <div className='interestGroup'>
        <label className='interestLabel'>ISIN:</label>
        <input type="text" id="isin" value={interest.isin} />
      </div>
      <div className='interestGroup'>
        <label className='interestLabel'>Industry:</label>
        <input type="text" id="indsutry" value={interest.industry} />
      </div>
      <div className='interestGroup'>
        <label className='interestLabel'>Maturity from:</label>
        <input type="text" id="maturityFrom" value={interest.maturityFrom} />
        <label className='interestLabelShort'>To:</label>
        <input type="text" id="maturityTo" value={interest.maturityTo} />
      </div>
      <div className='interestGroup'>
        <label className='interestLabel'>Coupon From:</label>
        <input type="number" id="couponFrom" value={interest.couponFrom} style={{ width: 60 }} />
        <label className='interestLabelShort'>To:</label>
        <input type="number" id="couponTo" value={interest.couponTo} style={{ width: 60 }} />
      </div>
      <div className='interestGroup'>
        <label className='interestLabel'>Size:</label>
        <input type="number" id="size" value={interest.size} />
      </div>
      <input type="submit" value="Submit" style={{ width: 60, backgroundColor: 'green', color: 'white' }} />
    </form>
  )
}

export default EnterInterest