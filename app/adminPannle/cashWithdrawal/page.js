'use client'
import apiKey from '@/app/API'
import axios from 'axios'
import React, { useState } from 'react'

export default function page() {

    const [withdrawalMoney ,setwithdrawalMoney] = useState([])
    axios.get(apiKey.withdrawalMoney)
    .then(data => {
        setwithdrawalMoney(data.data.data)
    }).catch(err=>{})

  const truesend = (e) => {
    axios.put(`${apiKey.withdrawalMoney}/${e}`,{
        status : "true"
    })
    .then(data => {
       
    }).catch(err=>{})
  }
  return (
    <div className='py-6 flex flex-col justify-center items-center gap-2.5 flex-wrap'>
      {
        withdrawalMoney.map((data, index) => (
            <div
              key={index}
              className="flex w-11/12 justify-between items-center border rounded-xl p-3 mb-3 shadow-sm"
            >
              <span className={`px-3 py-1 text-sm rounded-full font-medium ${data.status === "درحال بررسی" ? 'bg-orange-200 text-orange-800' : 'bg-green-200 text-green-800'}`}>
                {data.status}
              </span>
              <span className="text-gray-500 text-sm">{data.shaba}</span>
              <span className="text-sky-500 font-bold">{(data.price *1).toLocaleString()}</span>
              <button onClick={() => {truesend(data._id)}} className=' disabled:hidden  bg-sky-500 py-2 text-white font-bold cursor-pointer px-7 rounded-2xl' disabled={data.status === "درحال بررسی" ? false : true}>تایید</button>
            </div>
          ))}
    </div>
  )
}
