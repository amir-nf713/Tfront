'use client'
import React, { useCallback, useEffect, useState } from 'react';
import UserProfile from './usercomponnent/UserComp';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // برای تغییر صفحه
import apiKey from '@/app/API';

function App() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    axios.get(apiKey.getuserbyid)
      .then(res => {
        setUsers(res.data.data);
      })
      .catch(err => {
        console.error('خطا در دریافت کاربران:', err);
      });
  }, []);

  const calculateUserAge = useCallback((createdDate) => {
    if (!createdDate) return "نامشخص";

    const now = new Date();
    const created = new Date(createdDate);
    if (isNaN(created.getTime())) return "نامشخص";

    const diffInMilliseconds = now - created;
    const diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24);
    const diffInMonths = diffInDays / 30.44;
    const diffInYears = diffInDays / 365.25;

    if (diffInDays < 1) return "امروز";
    if (diffInDays < 7) return "کمتر از 7 روز";
    if (diffInDays < 30) return "کمتر از یک ماه";
    if (diffInMonths < 2) return "حدود ۱ ماه";
    if (diffInMonths < 12) return `${Math.floor(diffInMonths)} ماه`;
    if (diffInYears < 2) return "حدود ۱ سال";
    return `${Math.floor(diffInYears)} سال`;
  }, []);

  const handleDeleteUser = (id) => {
    axios.delete(`${apiKey.deletuser}/${id}`)
      .then(() => {
        setUsers(prevUsers => prevUsers.filter(user => user._id !== id));
      })
      .catch(err => {
        console.error('خطا در حذف کاربر:', err);
      });
  };

  const filteredUsers = users.filter(user =>
    user.number?.toString().includes(search)
  );

  const handleEditUser = (id) => {
    router.push(`/adminPannle/users/edit/${id}`); // هدایت به صفحه ویرایش
  };
  

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start p-4">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="جستجو بر اساس شماره تلفن"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-2 border border-gray-300 rounded mb-6 w-full max-w-md"
      />

      {/* Users Grid */}
      <div className="w-full flex justify-center items-center flex-wrap gap-4">
        {
          filteredUsers.map((user, index) => (
            <UserProfile
              key={index}
              id={user._id}
              name={user.name}
              membershipDuration={calculateUserAge(user.date)}
              status={user.Authentication}
              balance={user.wallet}
              phoneNumber={user.number}
              profile={user.photo}
              onDelete={handleDeleteUser}
              onEdit={handleEditUser} // ارسال تابع ویرایش
            />
          ))
        }
      </div>
    </div>
  );
}

export default App;
