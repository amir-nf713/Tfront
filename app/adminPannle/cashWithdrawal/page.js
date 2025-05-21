"use client";
import apiKey from "@/app/API";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [users, setUsers] = useState({}); // اینجا اطلاعات چند کاربر رو نگه می‌داریم
  const [withdrawalMoney, setWithdrawalMoney] = useState([]);

  useEffect(() => {
    axios
      .get(apiKey.withdrawalMoney)
      .then((res) => {
        const data = res.data.data;
        setWithdrawalMoney(data);
  
        const userIds = [...new Set(data.map((item) => item.userid))];
  
        userIds.forEach((id) => {
          axios
            .get(`${apiKey.getuserbyid}/${id}`)
            .then((userRes) => {
              const user = userRes.data.data;
  
              if (user && user._id) {
                setUsers((prev) => ({
                  ...prev,
                  [user._id]: user,
                }));
              } else {
                console.warn("کاربر معتبر نیست:", user);
              }
            })
            .catch((err) => {
              console.error("خطا در گرفتن کاربر:", err);
            });
        });
      })
      .catch((err) => {
        console.error("خطا در گرفتن withdrawalMoney:", err);
      });
  }, []);
  

  const truesend = (id, num, name, price) => {
    axios
      .put(`${apiKey.withdrawalMoney}/${id}`, {
        status: "true",
      })
      .then(() => {
        // بروز رسانی وضعیت آیتم بدون رفرش
        setWithdrawalMoney((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, status: "true" } : item
          )
        );
      })
      .catch(() => {});

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
            apikey:
              "OWVlMTcwY2MtNDdlMy00NDI1LWE3NjAtYzA3OTljNDliMmNlMmVhNjA3ZjBiNzM3ZTQ2ZWFjYjRlZTQzMTk3YzI4ZDY=", // 👈 جایگزین کن با کلید واقعی خودت
            "Content-Type": "application/json",
          },
        }
      );
  };
  

  return (
    <div className="py-6 flex flex-col justify-center items-center gap-2.5 flex-wrap">
      {withdrawalMoney.map((data, index) => {
        const user = users[data.userid]; // گرفتن کاربر مرتبط با این درخواست
        return (
          <div
            key={index}
            className="flex w-11/12 justify-between items-center border rounded-xl p-3 mb-3 shadow-sm"
          >
            <span className="text-gray-500 text-sm">
              {user?.number || "شماره پیدا نشد"}
            </span>
            <span className="text-gray-500 text-sm">{data.shaba}</span>
            <span className="text-sky-500 font-bold">
              {(data.price * 1).toLocaleString()}
            </span>
            <button
              onClick={() => truesend(data._id, user?.number, user?.name , data.price)}
              className="disabled:hidden bg-sky-500 py-2 text-white font-bold cursor-pointer px-7 rounded-2xl"
              disabled={data.status !== "درحال بررسی"}
            >
              تایید
            </button>
          </div>
        );
      })}
    </div>
  );
}
