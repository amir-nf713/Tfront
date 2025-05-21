"use client";
import { Suspense } from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import apiKey from "@/app/API";

function TicketChatPage() {
  const searchParams = useSearchParams();
  const ticketId = searchParams.get("id");
  const [users, setUsers] = useState([]);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");


  axios.get(`${apiKey.ticket}`).then((res) => {
    res.data.data.some((element) => {
      if (element._id === ticketId) {
       

        
          axios
            .get(`${apiKey.getuserbyid}/${element.userid} `)
            .then((res) => {
              
              
              setUsers(res.data.data);
            })
            .catch((err) => {
              console.error("خطا در دریافت کاربران:", err);
            });
        


        return true;
      }
    });
  });



  useEffect(() => {
    if (!ticketId) return;

    axios
      .get(`${apiKey.tickettext}/${ticketId}`)
      .then((res) => {
        const data = Array.isArray(res.data.data) ? res.data.data : [];
        setMessages(data);
      })
      .catch((err) => {
        console.error("خطا در گرفتن پیام‌ها:", err);
        setMessages([]);
      });
  }, [ticketId]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const newMsg = {
      text: newMessage,
      rol: "admin",
      ticketid: ticketId,
    };

    axios
      .post(apiKey.tickettext, newMsg)
      .then(() => {
        setNewMessage("");
        return axios.get(`${apiKey.tickettext}/${ticketId}?_=${Date.now()}`);
      })
      .then((res) => {
        const data = Array.isArray(res.data.data) ? res.data.data : [];
        setMessages(data);
      })
      .catch((err) => {
        console.error("خطا در ارسال یا دریافت پیام:", err);
      });

      axios.post(
        "https://api2.ippanel.com/api/v1/sms/pattern/normal/send",
        {
          code: "3nyujl9x3yirqbh",
          sender: "+983000505",
          recipient: `+${users.number}`,
          variable: {
            name: users.name,
          },
        },
        {
          headers: {
            accept: "application/json",
            apikey:
              "OWVlMTcwY2MtNDdlMy00NDI1LWE3NjAtYzA3OTljNDliMmNlMmVhNjA3ZjBiNzM3ZTQ2ZWFjYjRlZTQzMTk3YzI4ZDY=", // 👈 جایگزین کن با کلید واقعی خودت
            "Content-Type": "application/json",
          },
        }
      );


      
  };

  
  
  
  return (
    <div className="flex flex-col h-screen max-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow p-4 flex flex-col flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-4 px-2 flex flex-col">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-xs px-4 py-2 rounded-lg ${
                msg.rol === "user"
                  ? "bg-blue-500 text-white self-end rounded-br-none"
                  : "bg-gray-200 text-black self-start rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div className="mt-4 border-t pt-4 flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="پیام خود را بنویسید..."
            className="flex-1 p-3 rounded-md border focus:outline-none"
          />
          <button
            onClick={handleSend}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-bold"
          >
            ارسال
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>در حال بارگذاری...</div>}>
      <TicketChatPage />
    </Suspense>
  );
}
