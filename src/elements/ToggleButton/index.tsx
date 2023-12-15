import * as React from 'react'
import { IconType } from 'react-icons'
import './ToggleButton.css'

interface ToggleButtonProps {
  IconOn?: IconType
  IconOff?: IconType
  textOn?: string
  textOff?: string
  checked?: boolean
  onChecked?: (on: boolean) => void
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  IconOn,
  IconOff,
  textOn,
  textOff,
  checked,
  onChecked
}) => {

  const toggle = () => {
    if (onChecked) {
      onChecked(!checked)
    }
  }

  return (
    <div
      onClick={toggle}
      className={'buttonMain ' + (checked ? 'buttonActive' : 'buttonInactive')}
    >
      {IconOn && IconOff
        ? checked
          ? <IconOn className='buttonIcon' />
          : <IconOff className='buttonIcon' />
        : <></>
      }
      {textOn && textOff
        ? checked
          ? textOn
          : textOff
        : ''
      }
    </div>
  )
}

export default ToggleButton