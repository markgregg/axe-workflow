import { GiFireAxe } from "react-icons/gi";
import { ICellRendererParams } from 'ag-grid-community'
import Bond from "./Bond";

export const AxeRender = (params: ICellRendererParams<Bond>) => {
  return (
    params.data?.axed
      ? <GiFireAxe />
      : <div />

  )
}

export default AxeRender