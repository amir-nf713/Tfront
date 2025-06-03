'use client'
import { useEffect, useState } from "react";
import axios from "axios";
import apiKey from "@/app/API";
import Link from "next/link";
import dayjs from "dayjs";

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [groupedTickets, setGroupedTickets] = useState({});
  const [openGroups, setOpenGroups] = useState({}); // کنترل باز و بسته بودن هر روز

  const fetchData = async () => {
    try {
      const res = await axios.get(`${apiKey.ticket}`);

      // مرتب‌سازی نزولی
      const sortedTickets = res.data.data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      // گروه‌بندی بر اساس تاریخ (YYYY/MM/DD)
      const grouped = {};
      sortedTickets.forEach((ticket) => {
        const dateKey = dayjs(ticket.date).format("YYYY/MM/DD");
        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(ticket);
      });

      setGroupedTickets(grouped);
    } catch (error) {
      console.error("Error fetching ticket data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleGroup = (date) => {
    setOpenGroups((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  const deletetiket = async (id) => {
    try {
      await axios.put(`${apiKey.ticket}/${id}`, {
        status: "close",
      });
      await fetchData();
    } catch (error) {
      console.error("Error closing ticket:", error);
    }
  };

  // کلیدهای تاریخ رو مرتب می‌کنیم (نزولی)
  const sortedDates = Object.keys(groupedTickets).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-3xl mx-auto space-y-6">
        {sortedDates.map((date) => {
          const isOpen = openGroups[date] ?? false;
          const ticketsForDate = groupedTickets[date].filter(
            (t) => t.status === "درحال بررسی"
          );

          // اگر برای این روز تیکت باز نداشته باشیم، کل بخش رو نمایش نمی‌دیم
          if (ticketsForDate.length === 0) return null;

          return (
            <div
              key={date}
              className="border rounded-lg shadow-sm bg-white overflow-hidden"
            >
              <button
                onClick={() => toggleGroup(date)}
                className="w-full flex justify-between items-center px-4 py-2 bg-blue-100 hover:bg-blue-200 transition-all font-bold text-blue-800"
              >
                <span>📅 {date}</span>
                <span>{isOpen ? "🔼 بستن" : "🔽 باز کردن"}</span>
              </button>

              {isOpen && (
                <div className="p-4 space-y-4">
                  {ticketsForDate.map((ticket) => (
                    <div
                      key={ticket._id}
                      className="flex justify-between items-center bg-gray-50 rounded-lg p-3 shadow"
                    >
                      <span className="w-[40%]">{ticket.title}</span>
                      <span className="text-gray-600">
                        {dayjs(ticket.date).format("HH:mm")}
                      </span>

                      <span className="text-sm font-bold px-3 py-1 rounded bg-orange-300 text-white">
                        باز
                      </span>

                      <Link
                        href={`/adminPannle/ticket/page?id=${ticket._id}`}
                        className="text-blue-500 cursor-pointer"
                      >
                        مشاهده
                      </Link>

                      <button
                        onClick={() => deletetiket(ticket._id)}
                        className="hover:bg-red-800 bg-red-500 rounded-xl p-2 text-white text-sm"
                      >
                        بستن
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
