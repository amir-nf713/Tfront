"use client";
import apiKey from "@/app/API";
import { useState, useEffect } from "react";
import axios from "axios";
import { useMemo } from "react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = localStorage.getItem("notifications");
    if (cached) {
      setNotifications(JSON.parse(cached));
      setLoading(false);
    }

    const fetchNotifications = async () => {
      try {
        const response = await axios.get(apiKey.Notification);
        setNotifications(response.data.data);
        localStorage.setItem(
          "notifications",
          JSON.stringify(response.data.data)
        );
      } catch (error) {
        console.error("خطا در گرفتن اعلان‌ها:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const toggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  const pinned = useMemo(() => notifications.filter((n) => n.pinned === "true"), [notifications]);
  const others = useMemo(() => notifications.filter((n) => n.pinned !== "true"), [notifications]);

  return (
    <div className="min-h-screen font-dorna bg-gray-100 py-10 px-4 ">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          📢 اعلان‌های شما
        </h1>

        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-20 bg-gray-300 rounded animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          <>
            {/* پین‌شده‌ها */}
            {pinned.length > 0 && (
              <>
                <h2 className="text-lg font-semibold text-yellow-600 mb-3">
                  🔖 اعلان‌های پین‌شده
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {pinned.map((item) => (
                    <div
                      key={item._id}
                      className="bg-yellow-100 border border-yellow-300 rounded-2xl shadow p-4 relative transition hover:shadow-lg"
                    >
                      <h3 className="font-semibold text-yellow-900">
                        {item.title}
                      </h3>
                      <p className="text-sm text-yellow-800 mt-2 line-clamp-2">
                        {item.msg}
                      </p>
                      <button
                        onClick={() => toggle(item._id)}
                        className="text-sm text-blue-600 mt-3 hover:underline"
                      >
                        {openId === item._id ? "بستن" : "مشاهده جزئیات"}
                      </button>
                      {openId === item._id && (
                        <div className="mt-3 bg-white p-3 rounded-lg shadow-inner text-sm text-gray-700">
                          {item.msg}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* دیگر اعلان‌ها */}
            <h2 className="text-lg font-semibold text-gray-700 mt-8 mb-3">
              📨 سایر اعلان‌ها
            </h2>
            {others.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {others.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white border border-gray-200 rounded-2xl shadow p-4 relative transition hover:shadow-md"
                  >
                    <h3 className="font-semibold text-gray-800">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {item.msg}
                    </p>
                    <button
                      onClick={() => toggle(item._id)}
                      className="text-sm text-blue-600 mt-3 hover:underline"
                    >
                      {openId === item._id ? "بستن" : "مشاهده جزئیات"}
                    </button>
                    {openId === item._id && (
                      <div className="mt-3 bg-gray-50 p-3 rounded-lg shadow-inner text-sm text-gray-700">
                        {item.msg}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center mt-6">
                هیچ اعلانی وجود ندارد.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
