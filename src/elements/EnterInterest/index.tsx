import Interest from '@/types/Interest'
import * as React from 'react'
import { useAppSelector } from '../../hooks/redux'
import { styleDivFromTheme } from '../../themes'
import './EnterInterest.css'
import Window from '../Window'

interface EnterInterestProps {
  interest: Interest
  onClose: () => void
}

const EnterInterest: React.FC<EnterInterestProps> = ({ interest, onClose }) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const theme = useAppSelector((state) => state.theme.theme)

  React.useEffect(() => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 10)
  }, [])

  return (
    <div className='enterInterestMain'>
      <Window title='Enter Interest' titleColor={'rgb(179, 179, 179)'}>
        <form
          className='enterInterestForm'
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
            <label className='interestLabel'>Sector:</label>
            <input type="text" id="sector" value={interest.sector} />
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
          <input
            ref={inputRef}
            type="submit"
            value="Submit"
            style={{ width: 60, backgroundColor: 'green', color: 'white', marginTop: '5px', marginRight: '10px', alignSelf: 'flex-end', padding: '4px', borderRadius: '4px' }}
          />
        </form>
      </Window>
    </div>
  )
}

export default EnterInterest