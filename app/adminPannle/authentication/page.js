'use client'

import apiKey from '@/app/API'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useCallback, useEffect, useState } from 'react'

export default function Home() {
  const [items, setItems] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [user, setUser] = useState([]);

  

  




  const fetchItems = () => {
    axios.get(apiKey.authentication)
      .then((res) => {
        const data = res.data.data || []
        const notAuthenticated = data.filter(item => !item.Authentication)
        setItems(notAuthenticated)
      })
      .catch((err) => {
        console.error('خطا در دریافت اطلاعات:', err)
      })
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const ok = (item) => {
    axios.put(`${apiKey.putuser}/${item.userid}`, {
      Authentication: "true",
      name: item.name,
      lastname: item.lastname,
      cartmeliphoto: item.cartmeliphoto,
      codemeli: item.codemeli,
      email: item.email,
      berthday: item.berthday,
      gender: item.gender
    })
      .then(() => {
        axios
        .get(`${apiKey.getuserbyid}/${item.userid}`)
        .then((data) => {
          setUser(data.data.data);
        })
        .catch(() => {});
        // بعد از تایید، دوباره آیتم‌ها رو از سرور بگیر
        fetchItems()
        setSelectedItem(null)
        axios.post(
          "https://api2.ippanel.com/api/v1/sms/pattern/normal/send",
          {
            code: "ljuy7t72ldd1pad",
            sender: "+983000505",
            recipient: `+${user.number}`,
            variable: {
              name: `${user.name}`,
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
      })
      .catch((err) => {
        console.error('خطا در تایید:', err)
      })

      axios.delete(`${apiKey.authentication}/${item._id}`)
      .then((res) => {
        
      })
      .catch((err) => {
        // console.error('خطا در دریافت اطلاعات:', err)
      })
  }

  const no  = (item) => {
    axios.put(`${apiKey.putuser}/${item.userid}`, {
      Authentication: "false",
    })
      .then(() => {
        // بعد از تایید، دوباره آیتم‌ها رو از سرور بگیر
        fetchItems()
        setSelectedItem(null)
      })
      .catch((err) => {
        console.error('خطا در تایید:', err)
      })

      axios.delete(`${apiKey.authentication}/${item._id}`)
      .then((res) => {
        
      })
      .catch((err) => {
        // console.error('خطا در دریافت اطلاعات:', err)
      })
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">لیست کاربران در انتظار تایید</h1>

      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item._id} className="bg-white shadow p-4 rounded flex items-center justify-between">
            <span className="text-lg font-semibold">#{item.userid}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedItem(item)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                نمایش
              </button>
              <button
                onClick={() => ok(item)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                تایید
              </button>
              <button
                onClick={() => no(item)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                تایید نمیشود
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6 space-y-4 overflow-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold text-center text-gray-800">اطلاعات کاربر</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-100 p-2 rounded border">نام: {selectedItem.name}</div>
              <div className="bg-gray-100 p-2 rounded border">نام خانوادگی: {selectedItem.lastname}</div>
            </div>

            <div className="bg-gray-100 p-2 rounded border">کد ملی: {selectedItem.codemeli}</div>
            <div className="bg-gray-100 p-2 rounded border">ایمیل: {selectedItem.email}</div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-100 p-2 rounded border">تاریخ تولد:</div>
              <div className="bg-gray-100 p-2 rounded border col-span-2">
                {selectedItem.brthday}
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <span className="text-gray-700">جنسیت:</span>
              <span className="font-semibold">{selectedItem.gender || selectedItem.gnder}</span>
            </div>

            {/* کارت ملی */}
            {selectedItem.cartmeliphoto ? (
              <div>
                <label className="block text-gray-700 font-semibold mb-2">کارت ملی:</label>
                <img
                  src={selectedItem.cartmeliphoto}
                  alt="کارت ملی"
                  className="w-32 h-32 object-cover rounded-lg shadow-md border"
                />
              </div>
            ) : (
              <div className="text-gray-500 italic">تصویر کارت ملی موجود نیست</div>
            )}

            <div className="text-right pt-4">
              <button
                onClick={() => setSelectedItem(null)}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
