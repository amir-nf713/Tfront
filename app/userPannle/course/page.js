'use client'
import React, { useCallback, useEffect, useState } from "react";
import CorseBox from "../componnet/corseBox/CorseBox";
import axios from "axios";
import apiKey from "@/app/API";
import Link from "next/link";
import Cookies from "js-cookie";

export default function page() {
  const [course, setcourse] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getCookie = useCallback((name) => {
    return Cookies.get(name) || null;
  }, []);

  const loginCookieValue = getCookie("login");

  useEffect(() => {
    axios
      .get(`${apiKey.getuserbyid}/${loginCookieValue}`)
      .then((data) => {
        setUser(data.data.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    axios.get(apiKey.course)
      .then(data => {
        setcourse(data.data.data);
      })
      .catch(() => {});
  }, []);

  if (loading) {
    return (
      <div className="w-full h-[100vh] flex flex-col justify-center items-center bg-blue-100 text-blue-700">
        <svg
          className="animate-spin -ml-1 mr-3 h-16 w-16 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        <p className="mt-4 text-2xl font-semibold tracking-wide">
          لطفا صبر کنید...
        </p>
      </div>
    );
  }

  if (!user || user.Authentication !== "true") {
    return (
      <div className="h-screen pb-16 bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center text-xl text-gray-700">
          قبل از احراز هویت این صفحه در دسترس نمی‌باشد
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center items-center mt-16">
      <div className="w-11/12 max-tablet-l:gap-1.5 flex justify-center items-center flex-wrap gap-4">
        {course.map((data) => (
          <Link key={data._id} href={`/userPannle/course/page?id=${data._id}`}>
            <CorseBox
              title={data.title}
              description={data.explanation}
              image={data.photo}
              rating={5.0}
              price={data.price}
              teacher={data.teachersname}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
