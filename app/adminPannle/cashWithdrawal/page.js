"use client";
import apiKey from "@/app/API";
import axios from "axios";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import jalali from "dayjs-jalali";

dayjs.extend(jalali);

export default function Page() {
  const [users, setUsers] = useState({});
  const [withdrawalMoney, setWithdrawalMoney] = useState({});
  const [openGroups, setOpenGroups] = useState({}); // 👈 گروه‌های باز

  useEffect(() => {
    axios.get(apiKey.withdrawalMoney).then(async (res) => {
      const rawData = res.data.data;

      const sorted = rawData.sort((a, b) => {
        if (a.status === "درحال بررسی" && b.status !== "درحال بررسی") return -1;
        if (a.status !== "درحال بررسی" && b.status === "درحال بررسی") return 1;
        return new Date(a.createdAt) - new Date(b.createdAt);
      });

      const grouped = {};
      sorted.forEach((item) => {
        const dateKey = dayjs(item.date).format("YYYY/MM/DD");
        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(item);
      });

      setWithdrawalMoney(grouped);

      const userIds = [...new Set(sorted.map((item) => item.userid))];
      await Promise.all(
        userIds.map(async (id) => {
          const userRes = await axios.get(`${apiKey.getuserbyid}/${id}`);
          const user = userRes.data.data;
          if (user && user._id) {
            setUsers((prev) => ({
              ...prev,
              [user._id]: user,
            }));
          }
        })
      );
    });
  }, []);

  const truesend = (id, num, name, price) => {
    axios.put(`${apiKey.withdrawalMoney}/${id}`, { status: "true" }).then(() => {
      location.reload();
    });

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

  const toggleGroup = (date) => {
    setOpenGroups((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  return (
    <div className="py-6 px-4 max-w-4xl mx-auto space-y-4">
      {Object.entries(withdrawalMoney)
      .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
      .map(([date, items]) => {
        const isOpen = openGroups[date] ?? false;

        return (
          <div key={date} className="mb-6 border rounded-lg shadow-sm">
            <button
              onClick={() => toggleGroup(date)}
              className="w-full flex justify-between items-center px-4 py-2 bg-blue-100 hover:bg-blue-200 transition-all rounded-t-lg"
            >
              <h2 className="text-lg font-bold text-blue-800">
                📅 {date}
              </h2>
              <span className="text-blue-800">
                {isOpen ? "🔼 بستن" : "🔽 باز کردن"}
              </span>
            </button>

            {isOpen && (
              <div className="p-4 space-y-3">
                {items.map((data, index) => {
                  const user = users[data.userid];
                  const isPending = data.status === "درحال بررسی";
                  const isRef = data.from === "ref";

                  return (
                    <div
                      key={index}
                      className={`flex flex-col sm:flex-row sm:justify-between items-start sm:items-center border p-4 rounded-xl shadow-md transition-all mb-2 ${
                        isPending
                          ? "border-yellow-400 bg-yellow-50"
                          : isRef
                          ? "bg-green-50 border-green-300"
                          : "bg-gray-100"
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
                          ⏰ تاریخ: {dayjs(data.date).format("YYYY/MM/DD HH:mm")}
                        </span>
                        {isRef && (
                          <span className="text-green-600 text-xs font-semibold">
                            📌 برداشت مربوط به دعوت دوستان
                          </span>
                        )}
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
            )}
          </div>
        );
      })}
    </div>
  );
}
