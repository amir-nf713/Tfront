"use client";
import apiKey from "@/app/API";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import MenuBtn from "./componnet/menubtn/MenuBtn";
import Link from "next/link";
import Menu from "./componnet/menu/Menu";
import { IoMenu } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function RootLayout({ children }) {
  const router = useRouter();
  const handleRemoveCookie = () => {
    Cookies.remove("login");
    router.push("/");
  };

  const [user, setUser] = useState([]);
  const [menu, setmenu] = useState("-right-96");

  const getCookie = useCallback((name) => {
    return Cookies.get(name) || null;
  }, []);

  const loginCookieValue = getCookie("login");
  if (!loginCookieValue) {
    router.push("/");
  }
  useEffect(() => {
    axios
      .get(`${apiKey.getuserbyid}/${loginCookieValue}`)
      .then((data) => {
        setUser(data.data.data);
      })
      .catch(() => {});
  }, []);

  const Menuhandler = () => {
    if (menu === "-right-96") {
      setmenu("right-0");
    } else {
      setmenu("-right-96");
    }
  };

  return (
    <div className="w-full flex flex-row rtl h-[100vh]">
      <button
        onClick={Menuhandler}
        className="fixed bg-white/50 backdrop-blur-[50px] rounded-2xl m-4 top-0 right-0 text-4xl p-4"
      >
        <IoMenu />
      </button>
      <div className="z-50">
        <div
          className={`max-Wide-mobile-s:w-60 h-[100vh] fixed top-0 ${menu} transition-all font-dorna w-96 flex flex-col items-center bg-[#3F3F46]`}
        >
          <button
            onClick={Menuhandler}
            className="text-4xl w-full ltr pl-3 pt-3 text-white"
          >
            <MdClose />
          </button>
          <div className="w-full">
            <div className="w-full flex justify-center flex-col items-center">
              {user.photo === "" ? (
                <img
                  src="\images.png"
                  alt=""
                  className="size-32 max-Wide-mobile-s:size-28 rounded-full"
                />
              ) : (
                <img
                  src={user.photo}
                  alt=""
                  className="size-32 max-Wide-mobile-s:size-28 rounded-full"
                />
              )}
              {user.name === "unknown" ? (
                <p className="max-Wide-mobile-s:text-sm text-white text-2xl font-dorna font-semibold mt-1.5">
                  {"unknown"}
                </p>
              ) : (
                <p className="max-Wide-mobile-s:text-sm text-white text-2xl font-dorna font-semibold mt-1.5">
                  {user.name}
                </p>
              )}
            </div>

            <div className="flex max-Wide-mobile-s:text-xs flex-row font-bold text-lg mt-10 w-full items-center justify-between px-3">
              <div className="flex justify-center items-center text-[#CCCCCC]">
                <span className=""> موجودی : </span>
                <span className="">
                  {" "}
                  {(user.wallet * 1).toLocaleString()} نومان
                </span>
              </div>
              <div className="text-amber-300">افزایش موجودی</div>
            </div>

            <div className="w-full mt-2 bg-gray-300 h-[1px]"></div>
          </div>

          <div className="mt-5 max-Wide-mobile-s:w-[99%] w-[96%] flex flex-col justify-center items-center max-Wide-mobile-s:gap-0.5 gap-1">
            <Link className="w-full" href={"/userPannle"}>
              <MenuBtn text="داشبورد"></MenuBtn>
            </Link>
            {user.Authentication === "false" ? (
              <Link className="w-full" href={"/userPannle/Authentication"}>
                <MenuBtn text="احراض هویت"></MenuBtn>
              </Link>
            ) : (
              <></>
            )}

            {user.Authentication === "true" ? (
              <Link className="w-full" href={"/userPannle/course"}>
              <MenuBtn text="درخواست تدریس"></MenuBtn>
            </Link>
            ) : (
              <></>
            )}

            
            <Link className="w-full" href={"/userPannle/cashwithdrawal"}>
              <MenuBtn text="برداشت وجه"></MenuBtn>
            </Link>
            <Link className="w-full" href={"/userPannle/ticket"}>
              <MenuBtn text="تیکتینگ"></MenuBtn>
            </Link>
            <Link className="w-full" href={"/userPannle/userCourse"}>
              <MenuBtn text="دوره ها"></MenuBtn>
            </Link>
            <Link className="w-full" href={"/userPannle/user"}>
              <MenuBtn text="تنظیمات کاربری"></MenuBtn>
            </Link>
            <div onClick={handleRemoveCookie} className="w-full">
              <MenuBtn text="خروچ از حساب"></MenuBtn>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
}
