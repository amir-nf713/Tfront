'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import apiKey from '../API'

export default function AdminPage() {
  const [accessGranted, setAccessGranted] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const handleAccess = () => {
    axios.post(apiKey.adminlogin,{
      code,
    }).then(data => {
      console.log(data);
      
      if (data.data.login === "true") {
      setAccessGranted(true)
      setError('')
    } else {
      setError('رمز وارد شده صحیح نیست.')
    }
    })
    
  }

  if (!accessGranted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm text-center space-y-4">
          <h1 className="text-xl font-bold text-sky-600">ورود ادمین</h1>
          <input
            type="password"
            placeholder="رمز ورود را وارد کنید"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-400 outline-none"
          />
          <button
            onClick={handleAccess}
            className="w-full bg-sky-500 text-white py-2 rounded-lg hover:bg-sky-600 transition"
          >
            ورود
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      </div>
    )
  }

  // اگر کد درست بود، صفحه ادمین نمایش داده می‌شود
  return (
    <div className='w-full flex justify-center items-center h-[100vh] bg-gray-50'>
      <div className="border gap-2.5 w-[600px] mx-2 rounded-2xl border-sky-500 flex flex-col justify-center items-center p-5 bg-white shadow-lg">
        <Link href={"/adminPannle/users"} className="py-2.5 text-xl text-sky-500 font-bold border border-sky-500 w-[97%] flex justify-center items-center gap-2.5 rounded-full">user</Link>
        <Link href={"/adminPannle/ticket"} className="py-2.5 text-xl text-sky-500 font-bold border border-sky-500 w-[97%] flex justify-center items-center gap-2.5 rounded-full">ticket</Link>
        <Link href={"/adminPannle/videos"} className="py-2.5 text-xl text-sky-500 font-bold border border-sky-500 w-[97%] flex justify-center items-center gap-2.5 rounded-full">video</Link>
        <Link href={"/adminPannle/cashWithdrawal"} className="py-2.5 text-xl text-sky-500 font-bold border border-sky-500 w-[97%] flex justify-center items-center gap-2.5 rounded-full">cash withdrawal</Link>
        <Link href={"/adminPannle/authentication"} className="py-2.5 text-xl text-sky-500 font-bold border border-sky-500 w-[97%] flex justify-center items-center gap-2.5 rounded-full">authentication</Link>
        <Link href={"/adminPannle/notification"} className="py-2.5 text-xl text-sky-500 font-bold border border-sky-500 w-[97%] flex justify-center items-center gap-2.5 rounded-full">notification</Link>
        
      </div>
    </div>
  )
}
