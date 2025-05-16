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
    <div className="min-h-screen p-4 bg-gray-50">
    
      {/* دکمه ثبت تیکت */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-8 rounded-md font-bold"
        >
          + ثبت تیکت جدید
        </button>
      </div>

      {/* لیست تیکت‌ها */}
      <div className="max-w-3xl mx-auto space-y-4">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="flex justify-between items-center bg-white rounded-lg shadow p-4"
          >
            <span>{ticket.title}</span>
            <span className="text-gray-600">{ticket.date.split("T")[0]}</span>
            
            <span
              className={`text-sm font-bold px-3 py-1 rounded ${
                ticket.status === "درحال بررسی"
                  ? "bg-orange-300 text-white"
                  : "bg-gray-400 text-white"
              }`}
            >
              {ticket.status === "درحال بررسی" ?"باز " : "بسته شده"}
            </span>
            <Link href={`/userPannle/ticket/page?id=${ticket._id}`} className="text-blue-500 cursor-pointer"> مشاهده </Link>
          </div>
        ))}
      </div>

      {/* مودال */}
      <Popup
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        
      ></Popup>
    </div>
  );
}
