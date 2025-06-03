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
  const [err, setErr] = useState("");
  const [invitedUsers, setInvitedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [withdrawals, setWithdrawals] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

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

    const fetchUserAndWithdrawals = async () => {
      try {
        const res = await axios.get(`${apiKey.getuserbyid}/${loginCookie}`);
        const userData = res?.data?.data;
        if (!userData || userData === "not found") {
          Cookies.remove("login");
          router.replace("/");
          return;
        }
        setUser(userData);

        // دریافت کاربران دعوت‌شده
        const invited = [];
        for (const id of userData.referralBy) {
          const res = await axios.get(`${apiKey.getuserbyid}/${id}`);
          if (res.data.data) invited.push(res.data.data);
        }
        setInvitedUsers(invited);

        // دریافت لیست برداشت‌ها
        const wres = await axios.get(`${apiKey.withdrawalMoney}/${loginCookie}`);
        const refWithdrawals = wres.data.data.filter(w => w.from === "ref");
        setWithdrawals(refWithdrawals);
        setPageLoading(false);

      } catch (error) {
        Cookies.remove("login");
        router.replace("/");
      }
    };

    fetchUserAndWithdrawals();
  }, [loginCookie, router]);

  const handleWithdraw = async () => {
    if ((user.referralPrice || 0) <= 10000) {
      setErr("موجودی شما باید بیشتر از 10000 تومان باشد.");
      return;
    }

    if (!iban) {
      setErr("شماره شبا خالی است.");
      return;
    }

    setLoading(true);
    setErr("");

    try {
      const res = await axios.post(apiKey.withdrawalMoneyref, {
        price: user.referralPrice,
        userid: loginCookie,
        shaba: iban,
        from: "ref",
      });

      if (res.data.massage === "ok") {
        await axios.put(`${apiKey.putuser}/${loginCookie}`, {
          referralPrice: 0,
        });

        const updatedUser = await axios.get(`${apiKey.getuserbyid}/${loginCookie}`);
        setUser(updatedUser.data.data);

        const updatedWithdrawals = await axios.get(`${apiKey.withdrawalMoney}/${loginCookie}`);
        const refWithdrawals = updatedWithdrawals.data.data.filter(w => w.from === "ref");
        setWithdrawals(refWithdrawals);

        setIban("");
      } else {
        setErr("مشکلی در برداشت پیش آمده.");
      }
    } catch (error) {
      setErr("خطا در ارتباط با سرور.");
    }

    setLoading(false);
  };

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  

  return (
    <div className="p-6 mt-16 max-w-4xl mx-auto text-right font-sans space-y-8 bg-white text-gray-800">
      <h1 className="text-3xl font-bold text-blue-700">دعوت از دوستان</h1>

      <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 shadow-sm">
        <h2 className="font-bold text-blue-600 mb-2">کد دعوت شما:</h2>
        <div className="flex items-center justify-between bg-white p-2 rounded border border-blue-300">
          <span className="text-sm break-all">{user.referralCode}</span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(`${user.referralCode}`);
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
          {(user.referralPrice || 0).toLocaleString()} تومان
        </div>

        <h3 className="text-blue-600 font-semibold mt-4">درخواست برداشت:</h3>
        <div className="flex flex-col gap-2">
          <label className="text-sm">شماره شبا بدون ( IR ) : </label>
          <input
            type="text"
            value={iban}
            onChange={(e) => setIban(e.target.value)}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-400"
            placeholder="مثلاً: 123456789012345678901234"
          />
          {err && <p className="my-2 text-sm text-red-700">{err}</p>}
          <button
            onClick={handleWithdraw}
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-60"
            disabled={loading}
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-white border-t-blue-400 rounded-full animate-spin"></span>
            )}
            برداشت
          </button>
        </div>
      </div>

      {withdrawals.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
          <h2 className="text-blue-600 font-bold mb-3">تاریخچه برداشت‌ها:</h2>
          <table className="w-full text-sm border">
            <thead>
              <tr className="bg-blue-100 text-right">
                <th className="p-2 border">مبلغ</th>
                <th className="p-2 border">شماره شبا</th>
                <th className="p-2 border">تاریخ</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((item, index) => (
                <tr key={index} className="text-right">
                  <td className="p-2 border">{item.price.toLocaleString()} تومان</td>
                  <td className="p-2 border">IR{item.shaba}</td>
                  <td className="p-2 border">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString("fa-IR")
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
