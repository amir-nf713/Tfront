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

  
  
    const fetchData = async () => {
      const loginCookieValue = getCookie("login");
      if (!loginCookieValue) return;
      try {
        const res = await axios.get(`${apiKey.ticket}/${loginCookieValue}`);
      
        // مرتب‌سازی بر اساس تاریخ به صورت نزولی (جدیدترین اول)
        const sortedTickets = res.data.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      
        // setTickets(sortedTickets);
      } catch (error) {
        console.error("Error fetching ticket data:", error);
      }
      
    };

    fetchData();
  





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

      <div className="max-w-5xl mx-auto space-y-6 border-8 border-neutral-200 shadow-xl bg-neutral-200 p-4 rounded-2xl max-h-[84vh] overflow-y-auto">
        {tickets.length > 0 ? (  tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="flex justify-between items-center bg-white rounded-lg shadow-sm p-6 transition-transform transform hover:scale-90 hover:shadow-lg"
          >
            <div className="space-y-2 w-[40%] ">
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

            {ticket.status === "درحال بررسی" ? (

            <Link href={`/userPannle/ticket/page?id=${ticket._id}`} className="text-blue-500 hover:text-blue-700">
              مشاهده
            </Link>
            ) : (<></>)}
          </div>
        ))
      ) : (
          
          <div
          
          className="flex items-center justify-center rounded-lg  p-6 transition-transform transform hover:scale-90 hover:shadow-lg"
        >
         تیکتی ثبت نکردید

  
        </div>
        )
    }
      </div>

      {/* مودال */}
      <Popup
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          fetchData()
          }}
      />
    </div>
  );
}
