"use client";
import apiKey from "@/app/API";
import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import MenuBtn from "./componnet/menubtn/MenuBtn";
import Link from "next/link";
import Menu from "./componnet/menu/Menu";
import { IoMenu } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useLoginCheck } from "../myhook/cookiesHook";
// import imageCompression from 'browser-image-compression';

export default function RootLayout({ children }) {
  const router = useRouter();
  const { getCookieSafe } = useLoginCheck();

  const [loginCookie, setLoginCookie] = useState(null);
  const [user, setUser] = useState({});
  const [menu, setmenu] = useState("-right-96");
  const [Popup, setPopup] = useState("hidden");
  const [buyCours, setbuyCours] = useState("");
  const menuRef = useRef(null);

  // گام اول: گرفتن کوکی در کلاینت
  useEffect(() => {
    const cookie = getCookieSafe("login");
    if (!cookie) {
      router.push("/");
    } else {
      setLoginCookie(cookie);
    }
  }, [getCookieSafe, router]);

  // گرفتن اطلاعات کاربر بعد از اطمینان از وجود کوکی
  useEffect(() => {
    if (!loginCookie) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${apiKey.getuserbyid}/${loginCookie}`);
        const userData = res?.data?.data;
        if (!userData || userData === "not found") {
          Cookies.remove("login");
          router.replace("/");
          return;
        }
        setUser(userData);
      } catch (error) {
        Cookies.remove("login");
        router.replace("/");
      }
    };

    fetchUser();
  }, [loginCookie, router]);

  // بررسی کلیک بیرون از منو
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setmenu("-right-96");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // بررسی اینکه کاربر همه دوره‌ها را دارد یا نه
  useEffect(() => {
    const checkUserInAllCourses = async () => {
      try {
        const allCoursesRes = await axios.get(apiKey.course);
        const allCourses = allCoursesRes.data.data;
  
        const userCoursesRes = await axios.get(
          `${apiKey.userscourse}/${loginCookie}`
        );
        const userCourses = userCoursesRes.data.data;
  
        const allCourseIds = allCourses.map((course) => course._id);
        const userCourseIds = userCourses
          .map((uc) => uc.courseid)
          .filter((id) => allCourseIds.includes(id)); // فقط آیدی‌هایی که واقعاً وجود دارن
  
        const userHasAllCourses = allCourseIds.every((id) =>
          userCourseIds.includes(id)
        );
  
       
  
        setbuyCours(userHasAllCourses);
      } catch (err) {
        console.error("خطا در بررسی دوره‌ها:", err);
      }
    };
  
    if (loginCookie) {
      checkUserInAllCourses();
    }
  }, [loginCookie]);
  

  // توابع مدیریتی
  const Menuhandler = () => {
    setmenu((prev) => (prev === "-right-96" ? "right-0" : "-right-96"));
  };

  const handlepopop = () => {
    setPopup((prev) => (prev === "hidden" ? "flex" : "hidden"));
  };

  // 🔒 نمایش لودینگ تا وقتی کوکی آماده نیست
  if (loginCookie === null) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        لطفاً صبر کنید...
      </div>
    );
  }

  const handleRemoveCookie = () => {
    Cookies.remove("login");
    router.push("/");
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
          ref={menuRef}
          className={`overflow-x-auto max-Wide-mobile-s:w-60 h-[100vh] fixed top-0 ${menu} transition-all font-dorna w-96 flex flex-col items-center bg-[#3F3F46]`}
        >
          <button
            onClick={Menuhandler}
            className="text-4xl w-full ltr pl-3 pt-3 text-white"
          >
            <MdClose />
          </button>
          <div className="w-full">
            {user && (
              <div className="w-full flex justify-center flex-col items-center">
                <img
                  src={user.photo === "" ? "/images.png" : user.photo}
                  alt=""
                  className="size-32 max-Wide-mobile-s:size-28 rounded-full"
                />
                <p className="max-Wide-mobile-s:text-sm text-white text-2xl font-dorna font-semibold mt-1.5">
                  {user.name === "unknown" ? "unknown" : user.name}
                </p>
              </div>
            )}

            <div className="flex max-Wide-mobile-s:text-xs flex-row font-bold text-lg mt-10 w-full items-center justify-between px-3">
              <div className="flex justify-center items-center gap-2.5 text-[#CCCCCC]">
                <span className="text-sm"> وجه برداشت شده تا کنون : </span>
                <span className="">
                  {(user.wallet * 1).toLocaleString()} تومان
                </span>
              </div>
            </div>

            <div className="w-full mt-2 bg-gray-300 h-[1px]"></div>
          </div>

          <div className="mt-5 max-Wide-mobile-s:w-[99%] w-[96%] flex flex-col justify-center items-center max-Wide-mobile-s:gap-0.5 gap-1">
            <Link className="w-full" onClick={Menuhandler} href={"/userPannle"}>
              <MenuBtn text="داشبورد"></MenuBtn>
            </Link>
            {user.Authentication === "false" && (
              <Link
                className="w-full"
                onClick={Menuhandler}
                href={"/userPannle/Authentication"}
              >
                <MenuBtn text="احراز هویت" />
              </Link>
            )}

            {buyCours === false && (
              <Link
                className="w-full"
                onClick={Menuhandler}
                href={"/userPannle/course"}
              >
                <MenuBtn text="عضویت در تدریس یار"></MenuBtn>
              </Link>
            )}

            <Link
              className="w-full"
              onClick={Menuhandler}
              href={"/userPannle/userCourse"}
            >
              <MenuBtn text="ویدیو ها"></MenuBtn>
            </Link>

            <Link
              className="w-full"
              onClick={Menuhandler}
              href={"/userPannle/cashwithdrawal"}
            >
              <MenuBtn text="برداشت وجه"></MenuBtn>
            </Link>
            <Link
              className="w-full"
              onClick={Menuhandler}
              href={"/userPannle/ticket"}
            >
              <MenuBtn text="تیکت ها"></MenuBtn>
            </Link>
            <Link
              className="w-full"
              onClick={Menuhandler}
              href={"/userPannle/referral"}
            >
              <MenuBtn text="دعوت از دوستان"></MenuBtn>
            </Link>

            <Link
              className="w-full"
              onClick={Menuhandler}
              href={"/userPannle/Contactus"}
            >
              <MenuBtn text="ارتباط با ما"></MenuBtn>
            </Link>
            <Link
              className="w-full"
              onClick={Menuhandler}
              href={"/userPannle/user"}
            >
              <MenuBtn text="تنظیمات کاربری"></MenuBtn>
            </Link>
            <Link
              className="w-full"
              onClick={Menuhandler}
              href={"/userPannle/notification"}
            >
              <MenuBtn text="اعلان ها"></MenuBtn>
            </Link>
            <div
              onClick={() => {
                handlepopop();
                Menuhandler();
              }}
              className="w-full"
            >
              {" "}
              {/*handleRemoveCookie */}
              <MenuBtn text="خروچ از حساب"></MenuBtn>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-xl bg-opacity-50 ${Popup} justify-center items-center`}
      >
        <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 sm:w-96">
          <h2 className="text-xl font-semibold text-center mb-4">
            آیا می‌خواهید از حساب خود خارج شوید؟
          </h2>
          <div className="flex justify-around mt-4">
            {/* دکمه‌های بله و خیر */}
            <button
              onClick={handlepopop}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition duration-300"
            >
              خیر
            </button>
            <button
              onClick={handleRemoveCookie}
              className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition duration-300"
            >
              بله
            </button>
          </div>
        </div>
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
}
