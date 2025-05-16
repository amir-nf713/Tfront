'use client'
import apiKey from '@/app/API'
import { data } from 'autoprefixer';
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import MenuBtn from '../menubtn/MenuBtn';
import Link from 'next/link';



export default function Menu() {

  const [user, setUser] = useState([])
  const [menu, setmenu] = useState("-right-96")

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  
  const loginCookieValue = getCookie('login');
  

  useEffect(() => {
    axios.get(`${apiKey.getuserbyid}/${loginCookieValue}`)
    .then(data => {
       setUser(data.data.data)
      
    }).catch(() => {})
  }, [])

  const Menuhandler = () => {
     if (menu === "-right-96") {
      setmenu("right-0")
      
     }else{
      setmenu("-right-96") 
     }
  }

  
  


  return (
    <div className={`h-[100vh] fixed top-0 ${menu} transition-all font-dorna w-96 flex flex-col items-center bg-[#3F3F46]`}>
        
        <button onClick={Menu} className=''></button>
      <div className="pt-8 w-full">

        <div className="w-full flex justify-center flex-col items-center">
        {user.photo === "" ? (
          <img src=".\images.png" alt="" className="size-32 rounded-full" />
        ) : (
          <img src={user.photo} alt="" className="size-32 rounded-full" />
        )}
        {
          user.name === "unknown" ? (
            <p className="text-white text-2xl font-dorna font-semibold mt-1.5">{"unknown"}</p>
          ) : (
            <p className="text-white text-2xl font-dorna font-semibold mt-1.5">{user.name}</p>
          )
        }
          
        </div>

        <div className="flex flex-row font-bold text-lg mt-10 w-full items-center justify-between px-3">
          <div className="flex justify-center items-center text-[#CCCCCC]">
            <span className=''> موجودی  : </span>
            <span className=''> {user.wallet} نومان</span>
          </div>
          <div className="text-amber-300">
            افزایش موجودی
          </div>
        </div>
        
         <div className="w-full mt-2 bg-gray-300 h-[1px]"></div>


      </div>

      <div className="mt-5 w-[96%] flex flex-col justify-center items-center gap-1">
        <Link className='w-full' href={"/userPannle"}><MenuBtn text='داشبورد'></MenuBtn></Link>

        <Link className='w-full' href={"/"}><MenuBtn text='احراض هویت'></MenuBtn></Link>
        <Link className='w-full' href={"/"}><MenuBtn text='ذرخواست تدریس'></MenuBtn></Link>
        <Link className='w-full' href={"/"}><MenuBtn text='برداشت وجه'></MenuBtn></Link>
        <Link className='w-full' href={"/"}><MenuBtn text='تیکتینگ'></MenuBtn></Link>
        <Link className='w-full' href={"/"}><MenuBtn text='دوره ها'></MenuBtn></Link>
        <Link className='w-full' href={"/"}><MenuBtn text='تنظیمات کاربری'></MenuBtn></Link>
        <Link className='w-full' href={"/"}><MenuBtn text='خروچ از حساب'></MenuBtn></Link>
          
          
      </div>

    </div>
  )
}
