'use client'
import apiKey from "@/app/API";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useCallback, useEffect, useState } from "react";

export default function WithdrawalPanel() {
  const [amount, setAmount] = useState("");
  const [sheba, setSheba] = useState("");
  const [code, setCode] = useState("");

  

 
  const getCookie = useCallback((name) => {
    return Cookies.get(name) || null;
  }, []);

  const loginCookieValue = getCookie("login");

  const [user, setUser] = useState([]);
  useEffect(() => {
    axios
      .get(`${apiKey.getuserbyid}/${loginCookieValue}`)
      .then((data) => {
        setUser(data.data.data);
      })
      .catch(() => {});
  }, []);


  const [sendmoney, setsendmoney] = useState([]);
  useEffect(() => {
    axios
      .get(`${apiKey.withdrawalMoney}/${loginCookieValue}`)
      .then((data) => {
        setsendmoney(data.data.data);
      })
      .catch(() => {});
  }, []);



  let randomCode = 0
  const sendCode = async () => {
    axios.post(`${apiKey.sendsms}/+${user.number}`)
  .then(data => {
    console.log(data);
    
  })
  .catch((errr) => {})
  }


  const handleWithdraw = () => {
    axios.post(apiKey.getcode,{
        number: user.number ,
        code: code,
    }).then(data => {
        console.log(data.data.massage, user.number);
        
        if (data.data.massage === `ok`) {
           const re = axios.post(apiKey.withdrawalMoney,{
            price : amount,
            userid : loginCookieValue,
            shaba : sheba 
        })}

    }).catch(ee => {})


    
    
    

    
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white w-full max-w-5xl rounded-xl shadow-xl flex flex-col md:flex-row overflow-hidden">
        {/* Left Side */}
        <div className="w-full md:w-1/2 p-6 bg-white">
          <div className="bg-sky-100 text-sky-600 font-bold text-3xl text-center py-6 rounded-lg">
            {(user.wallet * 1).toLocaleString()}
          </div>

          <input
            type="text"
            placeholder="مبلغ برداشت"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full mt-6 p-3 border rounded focus:outline-none"
          />
          <input
            type="text"
            placeholder="شماره شبا"
            value={sheba}
            onChange={(e) => setSheba(e.target.value)}
            className="w-full mt-4 p-3 border rounded focus:outline-none"
          />

          <div className="flex justify-center items-center gap-2 mt-4">
            <button onClick={sendCode} className="bg-blue-500 w-28 h-[50px] text-white rounded-l">ارسال کد</button>
            <input
              type="text"
              placeholder="کد را وارد کنید"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-3 border rounded-r focus:outline-none"
            />
          </div>

          <div className="mt-4 text-sm text-gray-600">
            <p className="mb-2">• مسئولیت اشتباه وارد کردن اطلاعات به عهده شخص هست.</p>
            <p>• شماره شبا را بدون IR وارد کنید.</p>
          </div>

          <button
            onClick={handleWithdraw}
            className="w-full bg-blue-500 text-white mt-6 py-3 rounded font-bold"
          >
            برداشت
          </button>
        </div>

        {/* Right Side */}
        <div className="w-full overflow-y-auto max-h-[700px] md:w-1/2 p-6 bg-white">
          {sendmoney.map((data, index) => (
            <div
              key={index}
              className="flex justify-between items-center border rounded-xl p-3 mb-3 shadow-sm"
            >
              <span className={`px-3 py-1 text-sm rounded-full font-medium ${data.status === "درحال بررسی" ? 'bg-orange-200 text-orange-800' : 'bg-green-200 text-green-800'}`}>
                {data.status}
              </span>
              <span className="text-gray-500 text-sm">{data.date.split("T")[0]}</span>
              <span className="text-sky-500 font-bold">{data.price}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
