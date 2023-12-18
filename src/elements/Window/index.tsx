import * as React from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import Button from '../Button'
import { useAppSelector } from '../../hooks/redux'
import { styleHeaderFromTheme } from '../../themes'
import { FaCircle } from "react-icons/fa6";
import './Window.css'


type WindowProps = {
  children?: React.ReactNode
  title: string
  color?: string
  titleColor?: string
  onHide?: () => void
}

const Window: React.FC<WindowProps> = ({
  children, title, onHide, color, titleColor
}) => {
  const theme = useAppSelector((state) => state.theme.theme)

  return (
    <div className={theme === 'metallic' ? 'windowMainMetallic' : 'windowMain'}>
      <div
        className='windowToolBar'
        style={styleHeaderFromTheme(theme)}
      >
        {
          onHide && <Button
            Icon={AiOutlineClose}
            onClick={onHide}
          />
        }
        <span style={{ flexGrow: 1, backgroundColor: titleColor, paddingLeft: '10px' }}>{title}</span>
        {
          color &&
          <FaCircle style={{ color, paddingRight: '4px' }} />
        }
      </div>
      {children}
    </div>
  )
}

export default Window