"use client";
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import apiKey from "@/app/API";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { data } from "autoprefixer";

export default function UserForm() {
  const router = useRouter()


    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(false);


  const getCookie = useCallback((name) => {
    return Cookies.get(name) || null;
  }, []);

  const loginCookieValue = getCookie("login");
useEffect(() => {
  axios
    .get(`${apiKey.getuserbyid}/${loginCookieValue}`)
    .then((data) => {
      setUser(data.data.data);
    })
    .catch(() => {});
}, []);
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    codemeli: "",
    email: "",
    emailConfirm: "",
    brthday: "",
    birthMonth: "",
    birthDay: "",
    gnder: "",
    cartmeliphoto: "",
    userid: loginCookieValue,
  });
  const [okFaechdata, setokFaechdata] = useState("")
  const [okFaechdataa, setokFaechdataa] = useState("hidden")


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        cartmeliphoto: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(apiKey.authentication,{
         userid : formData.userid,
         cartmeliphoto :formData.cartmeliphoto,
         codemeli : formData.codemeli,
         name : formData.name,
         lastname : formData.lastname,
         email : formData.email,
         gnder : formData.gnder,
         brthday : formData.brthday,        
      }); 

      axios.put(`${apiKey.putuser}/${loginCookieValue}`,{
        Authentication : "درحال بررسی",
      }).then(data => {
       
        
        
      }).catch(err => {})
      setokFaechdata("hidden")
      setokFaechdataa("flex")


      axios.post(
        "https://api2.ippanel.com/api/v1/sms/pattern/normal/send",
        {
          code: "dsetfhc1s6voo6p",
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
  
      setTimeout(() => {
        router.push("/userPannle");
      }, 2000);
      
      
    
    } catch (err) {
      console.error("Error submitting form:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-16 w-full h-full flex justify-center items-center">

    <form
      onSubmit={handleSubmit}
      className={`max-w-4xl ${okFaechdata} mx-auto p-6 bg-white shadow-xl rounded-2xl space-y-6 font-dorna`}
    >
      <h2 className="text-2xl font-bold text-center text-gray-800">
        فرم اطلاعات کاربری
      </h2>

      {/* نام و نام خانوادگی */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
        required
          type="text"
          name="name"
          placeholder="نام"
          value={formData.name}
          onChange={handleChange}
          className="input"
        />
        <input
        required
          type="text"
          name="lastname"
          placeholder="نام خانوادگی"
          value={formData.lastname}
          onChange={handleChange}
          className="input"
        />
      </div>

      {/* کد ملی */}
      <input
      required
        type="text"
        name="codemeli"
        placeholder="کد ملی"
        value={formData.codemeli}
        onChange={handleChange}
        className="input w-full"
      />

      {/* ایمیل و تایید ایمیل */}
      <input
      required
        type="email"
        name="email"
        placeholder="ایمیل"
        value={formData.email}
        onChange={handleChange}
        className="input w-full"
      />

      {/* تاریخ تولد */}
      <div className="grid grid-cols-3 gap-4">
        <input
        required
          type="text"
          name="birthDay"
          placeholder="روز تولد"
          value={formData.birthDay}
          onChange={handleChange}
          className="input"
        />
        <input
        required
          type="text"
          name="birthMonth"
          placeholder="ماه تولد"
          value={formData.birthMonth}
          onChange={handleChange}
          className="input"
        />
        <input
        required
          type="text"
          name="brthday"
          placeholder="سال تولد"
          value={formData.brthday}
          onChange={handleChange}
          className="input"
        />
      </div>

      {/* جنسیت */}
      <div className="flex gap-8 items-center">
        <span className="text-gray-700">جنسیت:</span>
        <label className="flex items-center gap-1">
          <input
          required
            type="radio"
            name="gnder"
            value="مرد"
            checked={formData.gnder === "مرد"}
            onChange={handleChange}
          />
          مرد
        </label>
        <label className="flex items-center gap-1">
          <input
          required
            type="radio"
            name="gnder"
            value="زن"
            checked={formData.gnder === "زن"}
            onChange={handleChange}
          />
          زن
        </label>
      </div>

      {/* آپلود عکس کارت ملی */}
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2">
          آپلود عکس کارت ملی
        </label>

        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <label className="w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-gray-400 mb-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16V4m0 0L3 8m4-4l4 4M17 8v8m0 0l4-4m-4 4l-4-4"
              />
            </svg>
            <span className="text-sm text-gray-500">آپلود تصویر</span>
            <input
            required
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>

          {formData.cartmeliphoto && (
            <img
              src={formData.cartmeliphoto}
              alt="کارت ملی"
              className="w-32 h-32 object-cover rounded-lg shadow-md border"
            />
          )}
        </div>
      </div>

      {/* دکمه ارسال */}
      <button
  type="submit"
  className="w-full bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 transition-all flex justify-center items-center gap-2"
  disabled={loading}
>
  {loading ? (
    <>
      <svg
        className="animate-spin h-5 w-5 text-white"
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
          d="M4 12a8 8 0 018-8v8z"
        ></path>
      </svg>
      <span>در حال ارسال...</span>
    </>
  ) : (
    "ارسال اطلاعات"
  )}
</button>

    </form>
       <div className={`${okFaechdataa} justify-center items-center h-16 rounded-2xl w-60 bg-white shadow-xl`}>با موفقیت ارسال شد</div>
    </div>
  );
}
