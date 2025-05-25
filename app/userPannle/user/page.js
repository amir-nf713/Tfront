"use client"
import { useState } from 'react'
import axios from 'axios'
import apiKey from '@/app/API'
import { useRouter } from 'next/navigation'
import { useLoginCheck } from '@/app/myhook/cookiesHook'

export default function ProfileForm() {
  const { getCookieSafe } = useLoginCheck();
  const loginCookie = getCookieSafe("login");

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    profileImage: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  if (!loginCookie) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, profileImage: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true);

    const updatedData = {
      name: formData.firstName,
      lastname: formData.lastName
    };

    if (formData.profileImage) {
      updatedData.photo = formData.profileImage;
    }

    try {
      await axios.put(`${apiKey.putuser}/${loginCookie}`, updatedData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      router.push("/userPannle");
    } catch (error) {
      alert('خطایی رخ داده است!')
      console.error(error)
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <style>{`
        .spinner {
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top: 3px solid white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          animation: spin 1s linear infinite;
          margin: auto;
        }
        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
      `}</style>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr p-4">
        <div className="w-full max-w-lg bg-white shadow-lg rounded-xl p-8 space-y-6">
          <h2 className="text-3xl font-bold text-center text-indigo-600">ویرایش پروفایل</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
              <div className="w-full">
                <label className="block text-gray-700 font-medium mb-1">نام</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  placeholder="نام شما"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="w-full">
                <label className="block text-gray-700 font-medium mb-1">نام خانوادگی</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  placeholder="نام خانوادگی"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <label className="block text-gray-700 font-medium">عکس پروفایل</label>
              <div className="relative w-full">
                <input
                  type="file"
                  accept="image/*"
                  id="profileImageInput"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isLoading}
                />
                <label
                  htmlFor="profileImageInput"
                  className={`cursor-pointer inline-flex items-center justify-center px-4 py-2 rounded-md border border-indigo-300 transition duration-200
                    ${isLoading ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'}`}
                >
                  انتخاب عکس
                </label>
                {formData.profileImage && (
                  <p className="mt-2 text-sm text-green-600">عکس انتخاب شد ✅</p>
                )}
              </div>
            </div>

            {formData.profileImage && (
              <div className="flex justify-center">
                <img
                  src={formData.profileImage}
                  alt="پیش‌نمایش"
                  className="w-28 h-28 object-cover rounded-full ring-2 ring-indigo-400 transition-all duration-300"
                />
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-2 px-4 rounded-lg font-semibold transition duration-200
                ${isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
              disabled={isLoading}
            >
              {isLoading ? <div className="spinner" /> : 'ارسال اطلاعات'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
