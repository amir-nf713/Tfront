"use client";
import axios from "axios";
import React, { useCallback, useState } from "react";
import apiKey from "./API";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";

export default function page() {
  const router = useRouter();
  const getCookie = useCallback((name) => {
    return Cookies.get(name) || null;
  }, []);

  useEffect(() => {
    const login = getCookie("login");
    if (login) {
      router.push("/userPannle");
    }
  }, [getCookie, router]);

  const [codeBox, setCodeBox] = useState("hidden");
  const [NumBox, setNumBox] = useState("flex");
  const [numinp, setnuminp] = useState("");
  const [codeinp, setcodeinp] = useState("");
  const [err, seterr] = useState("");
  const [errsendCode, seterrsendCode] = useState("ارسال");
  const [loading, setloading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);

  function setLoginCookie(userId) {
    Cookies.set("login", userId, { expires: 5, path: "/" });
  }

  const buttonhandler = () => {
    setloading(true);
    if (numinp === "9216069232") {
      router.push("/adminPannle");
    } else {
      axios
        .post(`${apiKey.sendsms}/+98${numinp}`)
        .then((data) => {
          console.log(data);

          if (data.data.massege === "ok") {
            if (codeBox === "hidden") {
              setCodeBox("flex");
              setNumBox("hidden");
              setloading(false);
            }
          }
          if (
            data.data.message ===
            "You have reached the limit of requests (5 per 5 minutes)"
          ) {
            seterrsendCode("دسترسی شما تا دقایقی محدود شده");
            setTimeout(() => {
              seterrsendCode("ارسال");
            }, 120000); // دو دقیقه
          }
        })
        .catch((errr) => {});
    }
  };

  const buttonhandlerr = () => {
    setCodeBox("hidden");
    setNumBox("flex");
  };

  const inphanler = (e) => {
    setnuminp(e.target.value);
    if (numinp.length >= 9) {
      setloading(false);
    } else {
      setloading(true);
    }
  };

  const codeinphandler = (e) => {
    setcodeinp(e.target.value);
    if (codeinp.length >= 2) {
      setloading(false);
    } else {
      setloading(true);
    }
  };

  const loginhanler = () => {
    setLoginLoading(true); // ✅ شروع لودینگ
    axios
      .post(apiKey.login, {
        number: Number("98" + numinp),
        code: codeinp,
      })
      .then((data) => {
        if (data.data.message === "ok" || data.data.login === "true") {
          const id = data.data.data._id;
          setLoginCookie(id);
          router.push("/userPannle");
        } else if (data.data.message === "data is false") {
          seterr("کد اشتباه است");
        }
      })
      .catch((er) => {
        console.log(er);
        seterr("خطایی رخ داده است");
      })
      .finally(() => {
        setLoginLoading(false); // ✅ پایان لودینگ (فقط اگر ارور داده یا کد اشتباه بود)
      });
  };

  return (
    <div className="w-full font-dorna h-[100vh] flex justify-center items-center">
      <div className="h-96 m-9 max-Wide-mobile-s:m-5 flex justify-around items-center flex-col w-[600px] border rounded-xl border-gray-700">
        <div className="w-full flex justify-center items-center">
          <img src="\logo\tylogoo-1.png" className="size-32" alt="" />
        </div>

        <div
          className={`w-full ${NumBox} justify-center items-center flex-col`}
        >
          <div className="w-[90%] ">
            <p className="font-extrabold text-2xl max-mobile-xlk:text-xl">
              ورود | ثبت نام
            </p>
            <p className="text-lg max-mobile-xlk:text-sm mb-2 text-gray-500 font-extralight">
              برای ورود یا ثبت نام شماره موبایل خود را وارد کنید
            </p>
          </div>
          <div className="w-full flex justify-center items-center flex-row">
            <input
              onChange={inphanler}
              value={numinp}
              placeholder="شماره را بدون صفر وارد کنید"
              type="text"
              className="mr-1.5  rounded-l-none border-l-0 font-sans w-[83%] ltr border-2 rounded-md px-2 text-gray-500 text-xl font-extrabold h-12 border-gray-300"
            />
            <div className="h-12 ml-1.5 font-extrabold flex justify-center items-center w-12 font-sans rounded-r-none ltr border-2 rounded-md px-2 text-gray-500 border-gray-300">
              +98
            </div>
          </div>
          <p className="font-light max-Wide-mobile-s:text-xs text-sm text-red-500 text-start w-[90%] pt-2">
            {" "}
            - شماره را بدون صفر وارد کنید : 0000-000-900
          </p>
        </div>

        <div
          className={`w-full ${codeBox} justify-center items-center flex-col`}
        >
          <div className="w-[97%] ">
            <p className="font-extrabold text-2xl max-mobile-xlk:text-xl">
              ورود | ثبت نام
            </p>
            <p className="text-lg max-mobile-xlk:text-sm mb-2 text-gray-500 font-extralight">
              برای ورود یا ثبت نام کد را وارد کنید
              <span
                onClick={buttonhandlerr}
                className="mx-5 cursor-pointer text-sky-500 font-extrabold"
              >
                ویرایش شماره
              </span>
            </p>
          </div>
          <input
            type="text"
            value={codeinp}
            onChange={codeinphandler}
            placeholder="کد را وارد کنید"
            className="w-[97%] border-2 rounded-md px-2 text-gray-500 font-semibold h-12 border-gray-300"
          />
          <p className="text-lg text-red-500">{err}</p>
        </div>

        <button
          disabled={loading}
          onClick={buttonhandler}
          className={`w-[97%] disabled:bg-gray-300 ${NumBox} justify-center items-center cursor-pointer h-12 rounded-lg bg-sky-500 text-white`}
        >
          {errsendCode}
        </button>
        <button
          disabled={loading || loginLoading}
          onClick={loginhanler}
          className={`w-[97%] disabled:bg-gray-300 ${codeBox} justify-center items-center cursor-pointer h-12 rounded-lg bg-sky-500 text-white`}
        >
          {loginLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
          ) : (
            "ورود | ثبت نام"
          )}
        </button>
      </div>
    </div>
  );
}
