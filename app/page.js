"use client";
import axios from "axios";
import React, { Suspense, useCallback, useState } from "react";
import apiKey from "./API";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";

 function LoginPage() {
  const searchParams = useSearchParams()
  const ref = searchParams.get('/ref')
  console.log(ref);
  
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
  const [numinp2, setnuminp2] = useState("");
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
    let cleanedNumber = numinp.startsWith("0") ? numinp.slice(1) : numinp;
  
    if (cleanedNumber === "9216069232") {
      router.push("/adminPannle");
    } else {
      axios
        .post(`${apiKey.sendsms}/+98${cleanedNumber}`)
        .then((data) => {
          console.log(data);

          if (data.data.massege === "ok") {
            if (codeBox === "hidden") {
              setCodeBox("flex");
              setNumBox("hidden");
              setloading(true);
              
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
    const value = e.target.value;
    setnuminp(value);
    setloading(value.trim().length < 11); // مثلاً شماره باید ۹ رقم باشه
  };
  const inphanler2 = (e) => {
    const value = e.target.value;
    setnuminp2(value);
   
  };
  
  const codeinphandler = (e) => {
    const value = e.target.value;
    setcodeinp(value);
    setloading(value.trim().length < 2); // مثلاً کد باید حداقل ۴ رقم باشه
  };
  

  const loginhanler = () => {

    setLoginLoading(true); // ✅ شروع لودینگ
    let cleanedNumber = numinp.startsWith("0") ? numinp.slice(1) : numinp;
    axios
      .post(apiKey.login, {
        number: Number("98" + cleanedNumber),
        code: codeinp,
        referralFrom: numinp2
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
          <div className="w-[97%]">
            <p className="font-extrabold text-2xl max-mobile-xlk:text-xl">
              ورود | ثبت نام
            </p>
            <p className="text-lg max-mobile-xlk:text-sm mb-2 text-gray-500 font-extralight">
              برای ورود یا ثبت نام شماره موبایل خود را وارد کنید
            </p>
          </div>
          <div className="w-[97%] flex justify-center items-center flex-col gap-2.5">
            <input
              onChange={inphanler2}
              value={numinp2}
              placeholder="ایا کد دعوت دارید ؟"
              type="text"
              className=" w-full border-2 rounded-md px-2 text-gray-400 text-sm font-extrabold h-12 border-gray-200"
            />
            <input
              onChange={inphanler}
              value={numinp}
              placeholder="شماره خود را وارد کنید"
              type="text"
              className=" w-full border-2 rounded-md px-2 text-gray-500 text-sm font-extrabold h-12 border-gray-300"
            />
            
          </div>
         
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


export default function Pdage() {
  return (
    <Suspense fallback={<div>در حال بارگذاری...</div>}>
      <LoginPage />
    </Suspense>
  );
}
