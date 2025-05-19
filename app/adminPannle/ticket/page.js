'use client'
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import apiKey from "@/app/API";
import Link from "next/link";

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);

 



 
 
 
  
    const fetchData = async () => {
       try {
        const res = await axios.get(`${apiKey.ticket}`);
      
        // مرتب‌سازی بر اساس تاریخ به صورت نزولی (جدیدترین اول)
        const sortedTickets = res.data.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      
        setTickets(sortedTickets);
      } catch (error) {
        console.error("Error fetching ticket data:", error);
      }
    };

    fetchData();
  

  const deletetiket = (e) => {
    axios.put(`${apiKey.ticket}/${e}`,{
      status : "close"
    })
    fetchData()
  }

  return (
    <div className="min-h-screen p-4 bg-gray-50">
    

      {/* لیست تیکت‌ها */}
      <div className="max-w-3xl mx-auto space-y-4">
        {tickets.map((ticket) => (
          ticket.status === "درحال بررسی" ? (

          <div
            key={ticket.id}
            className="flex justify-between items-center bg-white rounded-lg shadow p-4"
          >
            <span className="w-[40%]">{ticket.title}</span>
            <span className="text-gray-600">{ticket.date.split("T")[0]}</span>
            
            <span
              className={`text-sm font-bold px-3 py-1 rounded ${
                ticket.status === "درحال بررسی"
                  ? "bg-orange-300 text-white"
                  : "bg-gray-400 text-white"
              }`}
            >
              {ticket.status === "درحال بررسی" ? "باز" : "بسته شده"}
            </span>
            <Link href={`/adminPannle/ticket/page?id=${ticket._id}`} className="text-blue-500 cursor-pointer"> مشاهده </Link>

            <button onClick={() => deletetiket(ticket._id)} className="hover:bg-red-800 bg-red-500 rounded-xl p-2 text-white text-sm">بستن</button>
          </div>
          ) : (<></>)
        ))}
      </div>
    </div>
  );
}
