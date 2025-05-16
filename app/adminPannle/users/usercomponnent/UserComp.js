"use client"
import React, { useState } from 'react';
import axios from 'axios';
import apiKey from '@/app/API';

const UserProfile = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState({
    name: props.name,
    number: props.phoneNumber,
    wallet: props.balance,
    Authentication: props.status,
  });

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ارسال درخواست برای به‌روزرسانی کاربر
      await axios.put(`${apiKey.putuser}/${props.id}`, userData);
      alert("اطلاعات کاربر با موفقیت ویرایش شد!");
      toggleModal(); // بستن مودال پس از موفقیت
    } catch (error) {
      console.error("خطا در ویرایش اطلاعات:", error);
      alert("خطا در ویرایش اطلاعات!");
    }
  };

  const deleteuser = async () => {
    try {
      // ارسال درخواست برای حذف کاربر
      await axios.delete(`${apiKey.deletuser}/${props.id}`);
     
      // برای آپدیت صفحه پس از حذف کاربر می‌توانید از یک متد یا رفرش صفحه استفاده کنید.
    } catch (error) {
      
    }
  };

  return (
    <div className="w-72 p-5 rounded-lg bg-gray-50 shadow-sm border border-gray-200 font-sans">
      <img src={props.profile} alt="userData.name" />
      <h2 className="text-lg font-semibold text-gray-800 mb-4">{props.name}</h2>

      <div className="flex justify-between items-center mb-3 text-sm">
        <span className="text-gray-600">مدت زمان عضویت:</span>
        <span className="text-gray-800 font-medium">{props.membershipDuration}</span>
      </div>

      <div className="flex justify-between items-center mb-3 text-sm">
        <span className="text-gray-600">وضعیت احراز هویت:</span>
        <span className="text-green-600 font-medium">{props.status}</span>
      </div>

      <div className="flex justify-between items-center mb-3 text-sm">
        <span className="text-gray-600">موجودی حساب:</span>
        <span className="text-gray-800 font-medium">{props.balance}</span>
      </div>

      <div className="flex justify-between items-center mb-3 text-sm">
        <span className="text-gray-600">شماره:</span>
        <span className="text-gray-800 font-medium">{props.phoneNumber}</span>
      </div>

      <button
        onClick={toggleModal}
        className="w-full py-2 mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition-colors duration-300"
      >
        ویرایش
      </button>

      <button
        onClick={deleteuser}
        className="w-full py-2 mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md transition-colors duration-300"
      >
        حذف
      </button>

      {/* پاپ آپ مودال */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-4">ویرایش اطلاعات کاربر</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700">نام:</label>
                <input
                  type="text"
                  name="name"
                  value={userData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700">شماره:</label>
                <input
                  type="text"
                  name="number"
                  value={userData.number}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700">موجودی حساب:</label>
                <input
                  type="text"
                  name="wallet"
                  value={userData.wallet}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700">وضعیت احراز هویت:</label>
                <input
                  type="text"
                  name="Authentication"
                  value={userData.Authentication}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
              </div>
           

              <button
                type="submit"
                className="w-full py-2 mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition-colors duration-300"
              >
                ذخیره تغییرات
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
    </div>
  );
};

export default UserProfile;
