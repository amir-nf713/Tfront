"use client";
import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import apiKey from "../API";
import Cookies from "js-cookie";
import { GoArrowDown } from "react-icons/go";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [ticket, setticket] = useState([]);
  const [userAuthentication, setUserAuthentication] = useState("");
  const [userAuthenticationtextcolor, setUserAuthenticationtextcolor] =
    useState("");
  const [userAuthenticationbgcolor, setUserAuthenticationbgcolor] =
    useState("");
  const [ticketU, setticketU] = useState("");
  const [ticketUtextcolor, setticketUtextcolor] = useState("");
  const [ticketUbgcolor, setticketUbgcolor] = useState("");
  const [loading, setLoading] = useState(true);

  const calculateUserAge = useCallback((createdDate) => {
    if (!createdDate) return "نامشخص";

    const now = new Date();
    const created = new Date(createdDate);

    if (isNaN(created.getTime())) return "نامشخص";

    const diffInMilliseconds = now - created;
    const diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24);
    const diffInMonths = diffInDays / 30.44;
    const diffInYears = diffInDays / 365.25;

    if (diffInDays < 1) {
      return "امروز";
    } else if (diffInDays < 7) {
      return "کمتر از 7 روز";
    } else if (diffInDays < 30) {
      return "کمتر از یک ماه";
    } else if (diffInMonths < 2) {
      return "حدود ۱ ماه";
    } else if (diffInMonths < 12) {
      const months = Math.floor(diffInMonths);
      return `${months} ماه`;
    } else if (diffInYears < 2) {
      return "حدود ۱ سال";
    } else {
      const years = Math.floor(diffInYears);
      return `${years} سال`;
    }
  }, []);

  const getCookie = useCallback((name) => {
    return Cookies.get(name) || null;
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const loginCookieValue = getCookie("login");
      if (!loginCookieValue) return;
      try {
        const response = await axios.get(
          `${apiKey.getuserbyid}/${loginCookieValue}`
        );
        setUser(response.data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [getCookie]);

  useEffect(() => {
    const fetchData = async () => {
      const loginCookieValue = getCookie("login");
      if (!loginCookieValue) return;
      try {
        const res = await axios.get(`${apiKey.ticket}/${loginCookieValue}`);
        setticket(res.data.data);
      } catch (error) {
        console.error("Error fetching ticket data:", error);
      }
    };

    fetchData();
  }, [getCookie]);

  useEffect(() => {
    if (!user) return;

    const updateAuthenticationStatus = () => {
      if (user.Authentication === "false") {
        setUserAuthentication("انجام نشده");
        setUserAuthenticationtextcolor("#FD7600");
        setUserAuthenticationbgcolor("#FFB06B");
      } else if (user.Authentication === "true") {
        setUserAuthentication("تایید شده");
        setUserAuthenticationtextcolor("#05CF2A");
        setUserAuthenticationbgcolor("#A2FFAD");
      }else if (user.Authentication === "درحال بررسی") {
        setUserAuthentication("درحال بررسی");
        setUserAuthenticationtextcolor("#FD7600");
        setUserAuthenticationbgcolor("#FFB06B");
      }
    };

    updateAuthenticationStatus();
    const interval = setInterval(updateAuthenticationStatus, 1000);

    return () => clearInterval(interval);
  }, [user]);

  if (loading) {
    return (
      <div className="w-full h-[100vh] flex justify-center items-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full h-[100vh] flex justify-center items-center">
        User not found
      </div>
    );
  }

  const userAge = calculateUserAge(user.date);

  return (
    <div className=" w-full h-[100vh] flex justify-center items-center">
      <div className="w-[1260px] h-[93%] flex justify-around items-center flex-col">
        {/*  */}
        <div className="w-full flex justify-between items-center mb-5 max-desktop-s:flex-col">
          <div className="h-80 max-tablet-l:justify-center max-tablet-l:items-center max-tablet-l:h-auto max-tablet-l:w-11/12 max-desktop-s:w-[700px] flex flex-row justify-between shadow-xl rounded-2xl w-[1000px] bg-white">
            <div className="h-full max-tablet-l:justify-center items-center max-tablet-l:flex-col flex">
              <div className="flex h-full items-center mr-9 max-tablet-l:mr-0">
                <img
                  src={user.photo || "./images.png"}
                  alt="User profile"
                  className="size-48 max-tablet-l:size-32 max-tablet-l:mt-5 rounded-2xl"
                />
              </div>
              <div className="p-4 max-tablet-l:flex max-tablet-l: justify-center max-tablet-l:items-center max-tablet-l:flex-col mt-8 max-tablet-l:mt-0">
                <p className="text-2xl font-bold">{user.name}</p>
                <p className="text-lg mt-1.5 font-medium font-dorna text-gray-500">
                  مدت زمان عضویت: {userAge}
                </p>
                <div className="flex  gap-1.5 flex-row items-center mt-8">
                  <p className="text-lg max-tablet-l:text-sm font-bold"> وضعیت احراز هویت: </p>

                  <div
                    className={`px-3 max-tablet-l:text-lg py-1 font-extrabold text-xl font-dorna rounded-full`}
                    style={{
                      backgroundColor: userAuthenticationbgcolor,
                      color: userAuthenticationtextcolor,
                    }}
                  >
                    {userAuthentication}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-sky-500 max-desktop-s:hidden rounded-l-2xl h-full w-2xs"></div>
          </div>

          <div className="max-tablet-l:w-11/12 max-Wide-mobile-xl:flex-col max-Wide-mobile-xl:py-2.5 max-Wide-mobile-xl:gap-3 shadow-xl max-desktop-s:min-h-64 max-desktop-s:w-[700px] max-desktop-s:flex-row max-desktop-s:gap-12 max-desktop-s:px-5 max-desktop-s:mt-5 rounded-2xl text-2xl font-dorna  min-w-60 min-h-80 flex flex-col-reverse items-center justify-evenly bg-white">
            <div className="flex flex-row font-bold items-center justify-evenly w-full">
              <div>
                <img src="/3840766.png" alt="EURO" className="size-28" />
              </div>
              <div>
                <p>EUR</p>
                <p>100.000</p>
              </div>
            </div>

            <div className="flex flex-row font-bold items-center justify-evenly w-full">
              <div>
                <img
                  src="/Cjdowner-Cryptocurrency-Flat-Dollar-USD.1024.png"
                  alt="USD"
                  className="size-28"
                />
              </div>
              <div>
                <p>USD</p>
                <p>70.000</p>
              </div>
            </div>
          </div>
        </div>
 {/*  */}
        <div className="flex max-desktop-s:mt-0 flex-row max-desktop-s:flex-col items-center justify-between w-full">
          <div className="h-[550px] gap-2 flex flex-col  max-tablet-l:w-11/12 max-tablet-l:  max-desktop-s:w-[700px] overflow-auto px-3 py-4 w-[743px] bg-white shadow-xl rounded-2xl">
            {Array.isArray(ticket) && ticket.length > 0 ? (
              ticket.map((data, index) => (
                <div key={index} className="font-dorna font-bold text-gray-500 flex flex-row items-center justify-between">
                  <div className="">{data.title}</div>
                  <div className="max-Wide-mobile-xl:hidden" >{data.date.split("T")[0]}</div>
                  {data.status === "درحال بررسی" ? (
                    
                    <div
                      className={`px-3 py-1 font-extrabold text-xl font-dorna rounded-full`}
                      style={{
                        backgroundColor: "#FFB06B",
                        color: "#FD7600",
                      }}
                    >
                      <p className="">درحال بررسی</p>
                    </div>
                  ) : (
                    <div
                      className={`px-3 py-1 font-extrabold text-xl font-dorna rounded-full`}
                      style={{
                        backgroundColor: "#A2FFAD",
                        color: "#05CF2A",
                      }}
                    >
                      <p className="">پاسخ داده شده </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>هیچ تیکتی پیدا نشد.</p>
            )}
          </div>

          <div className="flex max-tablet-l:w-11/12 max-desktop-s:w-[700px] max-desktop-s:h-auto max-desktop-s:mb-5 flex-col max-desktop-s:mt-5 justify-between h-[550px] w-[495px]">
            <div className="rounded-2xl bg-white flex flex-col justify-around items-center shadow-xl w-full h-64">
              <div className="w-[95%] gap-1.5 text-white text-2xl font-extrabold flex justify-center items-center rounded-2xl h-1/2 bg-sky-300">
                <span className="">{(user.wallet * 1).toLocaleString()}</span>
                 
                <span className=""> تومان </span>
              </div>
              <div className="flex flex-row justify-center items-center bg-[#A2FFAD] text-[#05cf2a] text-xl font-bold px-3 py-2 rounded-full">
                <span className="">{(user.deposit * 1).toLocaleString()}</span>
                <span className=""><GoArrowDown /></span>
              </div>
            </div>
            <div className=" max-desktop-s:hidden rounded-2xl bg-sky-300 shadow-xl w-full h-64">

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
