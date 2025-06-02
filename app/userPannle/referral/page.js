"use client";
import apiKey from "@/app/API";
import { useLoginCheck } from "@/app/myhook/cookiesHook";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ReferralPage() {
  const router = useRouter();
  const { getCookieSafe } = useLoginCheck();
  const [loginCookie, setLoginCookie] = useState(null);
  const [user, setUser] = useState({});
  const [iban, setIban] = useState("");
  const [verifyNumber, setVerifyNumber] = useState("");
  const [rewards, setRewards] = useState(120000); // نمونه
  const [invitedUsers, setInvitedUsers] = useState([]);

  useEffect(() => {
    const cookie = getCookieSafe("login");
    if (!cookie) {
      router.push("/");
    } else {
      setLoginCookie(cookie);
    }
  }, [getCookieSafe, router]);

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

        const invited = [];
        for (const element of userData.referralBy) {
          const res = await axios.get(`${apiKey.getuserbyid}/${element}`);
          const invitedUser = res?.data?.data;
          if (invitedUser) invited.push(invitedUser);
        }
        setInvitedUsers(invited); // بعد از حلقه
      } catch (error) {
        Cookies.remove("login");
        router.replace("/");
      }
    };

    fetchUser();
  }, [loginCookie, router]);

  console.log(user);

  const handleWithdraw = () => {
    alert(`درخواست برداشت به شماره شبا: ${iban}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto text-right font-sans space-y-8 bg-white text-gray-800">
      <h1 className="text-3xl font-bold text-blue-700">دعوت دوستان</h1>

      <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 shadow-sm">
        <h2 className="font-bold text-blue-600 mb-2">کد دعوت شما:</h2>
        <div className="flex items-center justify-between bg-white p-2 rounded border border-blue-300">
          <span className="text-sm break-all">{user.referralCode}</span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(referralLink);
            }}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
          >
            کپی
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
        <h2 className="text-blue-600 font-bold mb-3">کاربران دعوت‌شده:</h2>
        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-blue-100 text-right">
              <th className="p-2 border">نام</th>
              <th className="p-2 border">شماره</th>
              <th className="p-2 border">تاریخ عضویت</th>
            </tr>
          </thead>
          <tbody>
            {invitedUsers.map((user, index) => (
              <tr key={index} className="text-right">
                <td className="p-2 border">{user.name || "—"}</td>
                <td className="p-2 border">{user.number || "—"}</td>
                <td className="p-2 border">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("fa-IR")
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 space-y-4">
        <h2 className="text-blue-600 font-bold">موجودی پاداش:</h2>
        <div className="text-xl font-bold text-green-600">
          {user.referralPrice.toLocaleString()} تومان
        </div>

        <h3 className="text-blue-600 font-semibold mt-4">درخواست برداشت:</h3>
        <div className="flex flex-col gap-2">
          <label className="text-sm">شماره شبا (IR...):</label>
          <input
            type="text"
            value={iban}
            onChange={(e) => setIban(e.target.value)}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-400"
            placeholder="IR..."
          />
          <button
            onClick={handleWithdraw}
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            برداشت
          </button>
        </div>
      </div>
    </div>
  );
}
