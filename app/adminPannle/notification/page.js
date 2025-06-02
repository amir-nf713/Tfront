"use client";
import apiKey from "@/app/API";
import axios from "axios";
import { Indent } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [items, setitems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [btn, setbtn] = useState(false);
  const [btn2, setbtn2] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [modal, setmodal] = useState("hidden");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [pinned, setPinned] = useState("false");

  const [msg, setmsg] = useState();

  const [openId, setOpenId] = useState(null);

  const msghanler = (e) => {
    setmsg(e.target.value);
  };

  const getitem = () => {
    axios.get(apiKey.Notification).then((data) => {
      setitems(data.data.data);
    });
  };
  getitem();

  const submite = (e) => {
    setbtn(true);
    axios
      .post(apiKey.Notification, {
        msg,
        title,
        tags: tags.split(",").map((t) => t.trim()), // تگ‌ها به صورت آرایه
        pinned,
      })

      .then(() => {})
      .catch((err) => {
        console.error("خطا در ارسال پیام:", err);
      })
      .finally(() => {
        setbtn(false);
        setmsg("");
        setTitle("");
        setTags("");
        setPinned("false");
      });
    getitem();
  };

  const daletenotifi = (e) => {
    setbtn2(true);
    axios
      .delete(apiKey.Notification)
      .then(() => {})
      .catch((err) => {
        console.error("خطا در حذف پیام ها:", err);
      })
      .finally(() => {
        setbtn2(false);
        setmsg("");
      });
    getitem();
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(apiKey.getuserbyid)
      .then((res) => {
        const count = res.data.data.length;

        setUserCount(count);
      })
      .catch((err) => {
        console.error("خطا در دریافت کاربران:", err);
      })
      .finally(() => {
        setLoading(false);
      });
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

  return (
    <div className="w-full h-[100vh] flex pt-[10vh] flex-col items-center">
      <div className="rounded-3xl bg-white shadow-xl m-3 w-full max-w-2xl px-4 py-6 mx-auto flex justify-center items-center flex-col">
        <textarea
          value={msg}
          onChange={msghanler}
          placeholder="متن اعلان را وارد کنید"
          className="h-24 p-3 w-full border border-gray-300 rounded-lg mt-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="عنوان اعلان"
          className="h-12 p-3 w-full border border-gray-300 rounded-lg mt-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="تگ‌ها (با کاما جدا کنید مثلاً: فوری,تخفیف)"
          className="h-12 p-3 w-full border border-gray-300 rounded-lg mt-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <select
          value={pinned}
          onChange={(e) => setPinned(e.target.value)}
          className="h-12 p-3 w-full border border-gray-300 rounded-lg mt-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="false">معمولی</option>
          <option value="true">پین‌شده</option>
        </select>

        <h1 className="flex gap-1.5 text-neutral-500 my-4 text-sm">
          <span>تعداد کل کاربران:</span>
          <span>{loading ? "در حال بارگذاری..." : userCount}</span>
        </h1>

        <button
          disabled={btn}
          onClick={submite}
          className="h-12 disabled:bg-neutral-500 disabled:cursor-not-allowed w-full mb-2 bg-sky-500 text-white rounded-xl flex items-center justify-center gap-2 transition hover:bg-sky-600"
        >
          {btn ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
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
              <span>در حال ارسال...</span>
            </>
          ) : (
            "ارسال اعلان"
          )}
        </button>

        <button
          disabled={btn2}
          onClick={() => setmodal("flex")}
          className="h-12 disabled:bg-neutral-500 disabled:cursor-not-allowed w-full mb-2 bg-red-600 text-white rounded-xl flex items-center justify-center gap-2 transition hover:bg-red-700"
        >
          {btn2 ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
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
              <span>در حال حذف...</span>
            </>
          ) : (
            "حذف تمام اعلان‌ها"
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 py-10 w-full max-w-7xl">
        {items.map((item, index) => (
          <div
            key={item._id}
            className={`relative bg-white border shadow-lg rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] ${
              item.pinned === "true"
                ? "border-yellow-500"
                : "border-neutral-200"
            }`}
          >
            {item.pinned === "true" && (
              <div className="absolute top-3 right-3 bg-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                📌 پین‌شده
              </div>
            )}
            <h2 className="text-lg mt-5 font-bold text-blue-700 mb-2">
              {item.title || `اعلان شماره ${index + 1}`}
            </h2>
            <p className="text-gray-700 mb-4 leading-relaxed whitespace-pre-line">
              {item.msg}
            </p>
            {item.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {item.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-400">
              🕒 {new Date(item.createdAt).toLocaleString("fa-IR")}
            </p>
          </div>
        ))}
      </div>

      <div
        className={`w-full h-[100vh] fixed top-0 ${modal} justify-center items-center left-0 backdrop-blur-3xl bg-black/80 z-40`}
      >
        <div className="h-56 w-96 mx-2.5 flex flex-col justify-evenly items-center rounded-xl bg-white">
          <h1>ایا میخواهید همه اعلان ها را حذف کنید</h1>
          <div className="w-full flex justify-evenly items-center">
            <button
              onClick={() => {
                daletenotifi();
                setmodal("hidden");
              }}
              className="bg-neutral-500 text-white h-10 w-20 rounded-full"
            >
              بله
            </button>
            <button
              onClick={() => setmodal("hidden")}
              className="bg-red-500 text-white h-10 w-20 rounded-full"
            >
              خیر
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
