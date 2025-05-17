'use client'
import React, { useCallback, useEffect, useState } from "react";
import CorseBox from "../componnet/corseBox/CorseBox";
import axios from "axios";
import apiKey from "@/app/API";
import Link from "next/link";
import Cookies from "js-cookie";
// import { useSearchParams } from "next/navigation";

export default function page() {
  
    const [course, setcourse] = useState([])
    const [user, setUser] = useState([]);

    const getCookie = useCallback((name) => {
      return Cookies.get(name) || null;
    }, []);
  
    const loginCookieValue = getCookie("login");
 useEffect(() => {
    axios
      .get(`${apiKey.getuserbyid}/${loginCookieValue}`)
      .then((data) => {
        setUser(data.data.data);
      })
      .catch(() => {});
  }, []);


    useEffect(() => {
      axios.get(apiKey.course)
      .then(data => {
         setcourse(data.data.data)
      }).catch(() => {})
    }, [])

  return (
    <div className="w-full flex justify-center items-center mt-16">
      <div className="w-11/12 max-tablet-l:gap-1.5 flex justify-center items-center flex-wrap gap-4">

      {
user.Authentication === "true" ? (
   course.map((data, index) => (
            <Link href={`/userPannle/course/page?id=${data._id}`}>
                <CorseBox
                  title={data.title}
                  description={data.explanation}
                  image={data.photo}
                  rating={5.0}
                  price={data.price}
                  teacher={data.teachersname}
                ></CorseBox>
            </Link>
        ))
) : (
  <div className="h-screen pb-16 bg-gray-100 flex items-center justify-center">
  <div className="bg-white p-8 rounded-lg shadow-lg text-center text-xl text-gray-700">
    قبل از احراز هویت این صفحه در دسترس نمی‌باشد
  </div>
</div>
)

       
    }
      </div>
    </div>
  );
}
