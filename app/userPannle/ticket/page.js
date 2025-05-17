'use client'
import { useCallback, useEffect, useState } from "react";
import Popup from "./popup/Pupup";
import Cookies from "js-cookie";
import axios from "axios";
import apiKey from "@/app/API";
import Link from "next/link";

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getCookie = useCallback((name) => {
    return Cookies.get(name) || null;
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const loginCookieValue = getCookie("login");
      if (!loginCookieValue) return;
      try {
        const res = await axios.get(`${apiKey.ticket}/${loginCookieValue}`);
        setTickets(res.data.data);
      } catch (error) {
        console.error("Error fetching ticket data:", error);
      }
    };

    fetchData();
  }, [getCookie]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* دکمه ثبت تیکت جدید */}
      <div className="flex justify-center mb-8">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-md font-semibold shadow-md transition duration-300"
        >
          + ثبت تیکت جدید
        </button>
      </div>

      {/* لیست تیکت‌ها */}
      <div className="max-w-4xl mx-auto space-y-6">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="flex justify-between items-center bg-white rounded-lg shadow-sm p-6 transition-transform transform hover:scale-105 hover:shadow-lg"
          >
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-800">{ticket.title}</h3>
              <span className="text-gray-500 text-sm">{ticket.date.split("T")[0]}</span>
            </div>

            <span
              className={`text-sm font-bold px-4 py-1 rounded-full ${
                ticket.status === "درحال بررسی"
                  ? "bg-yellow-400 text-white"
                  : "bg-gray-400 text-white"
              }`}
            >
              {ticket.status === "درحال بررسی" ? "باز" : "بسته شده"}
            </span>

            <Link href={`/userPannle/ticket/page?id=${ticket._id}`} className="text-blue-500 hover:text-blue-700">
              مشاهده
            </Link>
          </div>
        ))}
      </div>

      {/* مودال */}
      <Popup
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
