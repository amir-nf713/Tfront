"use client";
import apiKey from "@/app/API";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [users, setUsers] = useState({});
  const [withdrawalMoney, setWithdrawalMoney] = useState([]);

  useEffect(() => {
    axios
      .get(apiKey.withdrawalMoney)
      .then((res) => {
        const data = res.data.data;
  
        const sorted = data.sort((a, b) => {
          if (a.status === "درحال بررسی" && b.status !== "درحال بررسی") return -1;
          if (a.status !== "درحال بررسی" && b.status === "درحال بررسی") return 1;
          return new Date(a.createdAt) - new Date(b.createdAt);
        });
  
        setWithdrawalMoney(sorted);
  
        const userIds = [...new Set(sorted.map((item) => item.userid))]; // حتما از sorted استفاده کنید
        userIds.forEach((id) => {
          axios.get(`${apiKey.getuserbyid}/${id}`).then((userRes) => {
            const user = userRes.data.data;
            if (user && user._id) {
              setUsers((prev) => ({
                ...prev,
                [user._id]: user,
              }));
            }
          });
        });
      });
  }, []);
  
  const truesend = (id, num, name, price) => {
    axios
      .put(`${apiKey.withdrawalMoney}/${id}`, { status: "true" })
      .then(() => {
        setWithdrawalMoney((prev) => {
          // به روزرسانی آیتم
          const updated = prev.map((item) =>
            item._id === id ? { ...item, status: "true" } : item
          );
          // مرتب‌سازی مجدد بعد از تغییر وضعیت
          return updated.sort((a, b) => {
            if (a.status === "درحال بررسی" && b.status !== "درحال بررسی") return -1;
            if (a.status !== "درحال بررسی" && b.status === "درحال بررسی") return 1;
            return new Date(a.createdAt) - new Date(b.createdAt);
          });
        });
      });
  
    // ارسال پیامک (مثل قبلی)
    axios.post(
      "https://api2.ippanel.com/api/v1/sms/pattern/normal/send",
      {
        code: "9pol8vodj0p9xs5",
        sender: "+983000505",
        recipient: `+${num}`,
        variable: {
          name: `${name}`,
          number: `${price}`,
        },
      },
      {
        headers: {
          accept: "application/json",
          apikey: "YOUR_REAL_API_KEY",
          "Content-Type": "application/json",
        },
      }
    );
  };
  

  return (
    <div className="py-6 px-4 max-w-4xl mx-auto space-y-4">
      {withdrawalMoney.map((data, index) => {
        const user = users[data.userid];
        const isPending = data.status === "درحال بررسی";

        return (
          <div
            key={index}
            className={`flex flex-col sm:flex-row sm:justify-between items-start sm:items-center border p-4 rounded-xl shadow-md transition-all ${
              isPending ? "border-yellow-400 bg-yellow-50" : "bg-gray-100"
            }`}
          >
            <div className="flex flex-col space-y-1">
              <span className="text-gray-700 font-medium">
                📱 شماره: {user?.number || "یافت نشد"}
              </span>
              <span className="text-gray-600 text-sm">🏦 شبا: {data.shaba}</span>
              <span className="text-sky-600 font-bold text-lg">
                💰 مبلغ: {(data.price * 1).toLocaleString()} تومان
              </span>
              <span className="text-xs text-gray-400">
                ⏰ تاریخ: {new Date(data.date).toLocaleString("fa-IR")}
              </span>
            </div>

            <button
              onClick={() =>
                truesend(data._id, user?.number, user?.name, data.price)
              }
              disabled={!isPending}
              className={`mt-4 sm:mt-0 sm:ml-4 px-6 py-2 rounded-full font-bold text-white transition-all ${
                isPending
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {isPending ? "تایید" : "تایید شده"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
