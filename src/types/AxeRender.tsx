import { FaStar } from "react-icons/fa";
import { GiFireAxe } from "react-icons/gi";
import { FaRegThumbsUp } from "react-icons/fa";
import { ICellRendererParams } from 'ag-grid-community'
import Bond from "./Bond";

export const AxeRender = (params: ICellRendererParams<Bond>) => {
  return (
    params.data?.axeType === 'Axe'
      ? <div style={{ color: 'orange' }}><GiFireAxe /></div>
      : params.data?.axeType === 'New'
        ? <div style={{ color: 'gold' }}><FaStar /></div>
        : params.data?.axeType === 'Pref'
          ? <div style={{ color: 'blue' }}><FaRegThumbsUp /></div>
          : <div />

  )
}

export default AxeRender