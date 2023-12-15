import * as React from 'react'
import { IconType } from 'react-icons'
import './Button.css'

interface ButtonProps {
  Icon?: IconType
  text?: string
  onClick?: () => void
}

const Button: React.FC<ButtonProps> = ({ Icon, text, onClick }) => {
  return (
    <div
      onClick={onClick}
      className='buttonMain'
    >
      {Icon && <Icon />}
      {text}
    </div>
  )
}

export default Button