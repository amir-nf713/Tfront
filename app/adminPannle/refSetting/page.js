'use client'
import apiKey from "@/app/API";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function GiftSettings() {
  const [courseGift, setCourseGift] = useState("");
  const [withdrawGift, setWithdrawGift] = useState("");
  const [loading, setLoading] = useState(false);

  const isValid = courseGift !== "" && withdrawGift !== "";

  const submit = () => {
    if (!isValid) return;

    setLoading(true);
    axios
      .put(apiKey.refset, {
        priceByCourse: Number(courseGift),
        priceWithroutMony: Number(withdrawGift),
      })
      .then((data) => {
        console.log(data.data);
        alert("تنظیمات با موفقیت ذخیره شد.");
      })
      .catch((err) => {
        console.error(err);
        alert("خطا در ذخیره تنظیمات.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">تنظیم هدیه دعوت‌کننده</h1>

        <div className="mb-4">
          <label htmlFor="courseGift" className="block mb-2 font-medium text-gray-700">
            مبلغ هدیه خرید دوره به دعوت‌کننده (تومان)
          </label>
          <input
            type="number"
            id="courseGift"
            value={courseGift}
            onChange={(e) => setCourseGift(e.target.value)}
            placeholder="مثلا 100000"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            min="0"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="withdrawGift" className="block mb-2 font-medium text-gray-700">
            مبلغ هدیه برداشت پول به دعوت‌کننده (تومان)
          </label>
          <input
            type="number"
            id="withdrawGift"
            value={withdrawGift}
            onChange={(e) => setWithdrawGift(e.target.value)}
            placeholder="مثلا 50000"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            min="0"
          />
        </div>

        <div className="text-center">
          <button
            onClick={submit}
            disabled={!isValid || loading}
            className={`px-6 py-2 rounded transition text-white ${
              !isValid || loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "در حال ذخیره..." : "ذخیره"}
          </button>
        </div>
      </div>
    </div>
  );
}
