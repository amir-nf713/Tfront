'use client'
import React, { useEffect, useState } from "react";
import CorseBoxx from "./CorseBoxx";
import axios from "axios";
import apiKey from "@/app/API";
import Link from "next/link";

export default function page() {
  const [course, setcourse] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // برای کنترل پاپ آپ
  const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    price: '',
    teacher: '',
    image: '', // اینجا به جای URL تصویر، Base64 را ذخیره خواهیم کرد
  });

  useEffect(() => {
    axios.get(apiKey.course)
      .then(data => {
        setcourse(data.data.data);
        setLoading(false);
      })
      .catch(() => {
        setError("خطا در دریافت دوره‌ها");
        setLoading(false);
      });
  }, []);

  // برای باز و بسته کردن پاپ آپ
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // برای مدیریت تغییرات فرم
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse({ ...newCourse, [name]: value });
  };

  // تبدیل تصویر به Base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCourse({ ...newCourse, image: reader.result });
      };
      reader.readAsDataURL(file); // تبدیل تصویر به Base64
    }
  };

  // برای ارسال درخواست به API برای اضافه کردن دوره جدید
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(apiKey.course, {
        title: newCourse.title,
        explanation: newCourse.description,
        teachersname: newCourse.teacher,
        price: newCourse.price,
        photo: newCourse.image
      });
  
      if (response.data?.massage === "ok") {
        // ساخت آیتم دستی چون پاسخ شامل داده نیست
        const newItem = {
          _id: Date.now().toString(), // آیدی موقت برای رندر
          title: newCourse.title,
          explanation: newCourse.description,
          teachersname: newCourse.teacher,
          price: newCourse.price,
          photo: newCourse.image
        };
  
        setcourse([...course, newItem]);
        toggleModal();
  
        // پاک‌سازی فرم
        setNewCourse({
          title: '',
          description: '',
          price: '',
          teacher: '',
          image: '',
        });
      } else {
        alert("مشکلی در افزودن دوره پیش آمده است.");
      }
  
    } catch (error) {
      console.log('خطا در ارسال دوره:', error);
      alert("ارسال دوره با خطا مواجه شد.");
    }
  };


  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-600 space-y-4">
        <svg
          className="animate-spin h-12 w-12 text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
        <p className="text-lg font-semibold">در حال بارگذاری...</p>
      </div>
    );
  
  if (error)
    return (
      <div className="flex flex-col items-center justify-center py-20 text-red-600 space-y-3 border border-red-400 bg-red-100 rounded-md max-w-md mx-auto">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"
          />
        </svg>
        <p className="text-center text-lg font-semibold">{error}</p>
      </div>
    );
  

  

  return (
    <div className="w-full flex justify-center items-center mt-16">
      <div className="w-11/12 max-tablet-l:gap-1.5 flex justify-center items-center flex-wrap gap-4">
        
        {/* دکمه "اضافه کردن دوره" */}
        <button
          onClick={toggleModal}
          className="w-full py-2 mb-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition-colors duration-300"
        >
          اضافه کردن دوره
        </button>

        {/* پاپ آپ برای اضافه کردن دوره جدید */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h3 className="text-xl font-semibold mb-4">اضافه کردن دوره جدید</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700">عنوان دوره:</label>
                  <input
                    type="text"
                    name="title"
                    value={newCourse.title}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">تصویر:</label>
                  <input
                    type="file"
                    name="image"
                    onChange={handleImageChange}
                    className="w-full p-2 border border-gray-300 rounded mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">قیمت:</label>
                  <input
                    type="number"
                    name="price"
                    value={newCourse.price}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">نام استاد:</label>
                  <input
                    type="text"
                    name="teacher"
                    value={newCourse.teacher}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">توضیحات:</label>
                  <textarea
                    name="description"
                    value={newCourse.description}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded mt-1"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition-colors duration-300"
                >
                  ذخیره دوره
                </button>
                <button
                  type="button"
                  onClick={toggleModal}
                  className="w-full py-2 mt-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-md transition-colors duration-300"
                >
                  بستن
                </button>
              </form>
            </div>
          </div>
        )}

        {/* نمایش لیست دوره‌ها */}
        {
          course.map((data, index) => (
            
              <CorseBoxx
                title={data.title}
                description={data.explanation}
                image={data.photo}
                rating={5.0}
                price={data.price}
                teacher={data.teachersname}
                id={data._id}
              />
            
          ))
        }
      </div>
    </div>
  );
}
