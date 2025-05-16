import React from 'react'
import { GrFormPrevious } from "react-icons/gr";


export default function MenuBtn(props) {
  return (
    <div className='max-Wide-mobile-s:text-sm cursor-pointer text-white text-xl font-dorna font-bold flex flex-row justify-between active:bg-[#35353b] px-5 max-Wide-mobile-s:h-11 h-14 rounded-full w-full items-center'>
      <span className=''>{props.text}</span>
      <span className='max-Wide-mobile-s:text-xl text-3xl'><GrFormPrevious /></span>
    </div>
  )
}
