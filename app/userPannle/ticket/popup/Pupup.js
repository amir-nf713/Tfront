'use client';
import apiKey from "@/app/API";
import { data } from "autoprefixer";
import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";

export default function Popup({ isOpen, onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    const loginCookieValue = Cookies.get("login") || null;

    if (title.length > 2) {
      axios.post(apiKey.ticket, {
        title: title,
        description: description,
        userid: loginCookieValue
      }).then(data => {
        if (title.length > 2) {
          axios.post(apiKey.tickettext, {
            text: description,
            ticketid: data.data.save._id,
            rol: "user"
          });
        }
         
      }).catch(err => {})
    }

    setTitle("");
    setDescription("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-xl rounded-xl p-6 relative space-y-4">

        {/* دکمه بستن */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-2xl font-bold text-gray-600 hover:text-gray-800"
        >
          ✕
        </button>

        {/* عنوان */}
        <div>
          <label className="block text-right font-bold mb-1">عنوان</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded-md bg-gray-100 focus:outline-none"
            placeholder="عنوان تیکت را وارد کنید"
          />
        </div>

        {/* توضیحات */}
        <div>
          <label className="block text-right font-bold mb-1">توضیحات</label>
          <textarea
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded-md bg-gray-100 resize-none focus:outline-none"
            placeholder="توضیحات تیکت را وارد کنید"
          />
        </div>

        {/* دکمه تایید */}
        <div className="pt-4">
          <button
            onClick={() => handleSubmit()}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md font-bold transition"
          >
            تایید
          </button>
        </div>
      </div>
    </div>
  );
}
