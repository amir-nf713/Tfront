"use client";
import apiKey from "@/app/API";
import { Suspense } from 'react';
import axios from "axios";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import { Star, Users } from "lucide-react";
import Cookies from "js-cookie";
import { MdKeyboardArrowLeft } from "react-icons/md";

function page() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleVideo = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  const [course, setcourse] = useState([]);
  const [video, setvideo] = useState([]);
  const [usercours, setusercours] = useState([]);

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const getCookie = useCallback((name) => {
    return Cookies.get(name) || null;
  }, []);

  const loginCookieValue = getCookie("login");

  useEffect(() => {
    axios
      .get(`${apiKey.course}/${id}`)
      .then((data) => {
        setcourse(data.data.data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    axios
      .get(`${apiKey.video}`)
      .then((data) => {
        setvideo(data.data.data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    axios
      .get(`${apiKey.userscourse}/${loginCookieValue}`)
      .then((data) => {
        setusercours(data.data.data);
      })
      .catch(() => {});
  }, []);

  const hasBoughtCourse = usercours.some(
    (item) => item.courseid == id && item.userid == loginCookieValue
  );

  return (
    <div className="w-full h-[98.7vh] mt-3 flex justify-center items-center">
      <div className="w-[80%] max-Wide-mobile-4xl:flex-col flex-row-reverse rounded-2xl flex h-[800px] bg-white shadow-xl">
        <div className="max-w-[600px] flex flex-col justify-between pb-3.5 items-center overflow-hidden bg-white  border-r">
          <div className="flex justify-center items-center flex-col max-w-[600px] overflow-hidden bg-white">
            <img
              src="/images.png" //course.photo
              alt={course.title}
              className="w-11/12 rounded-3xl mt-5 max-Wide-mobile-4xl:h-64 max-tablet-l:h-44 h-60 object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold max-tablet-l:text-sm text-lg text-gray-800 mb-1">
                {course.title}
              </h3>
              <p className="text-sm max-tablet-l:text-xs text-gray-600 leading-relaxed line-clamp-2">
                {course.explanation}
              </p>

              <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400" fill="#facc15" />
                  <span className="text-yellow-600 font-bold">{5.0}</span>
                </div>
                <span>{course.teachersname}</span>
              </div>

              <div className="flex justify-between items-center mt-2">
                <span className="text-green-600 font-bold max-tablet-l:text-sm text-lg">
                  {(course.price * 1).toLocaleString("fa-IR")} تومان
                </span>
                <div className="flex items-center gap-1 text-gray-500 max-tablet-l:text-sm">
                  <Users className="w-4 h-4" />
                  <span>{""}</span>
                </div>
              </div>
            </div>
          </div>
          {hasBoughtCourse ? (
            <button
              disabled
              className="rounded-xl h-16 text-lg font-dorna w-[90%] disabled:bg-neutral-400 bg-gray-400 text-white  font-bold mt-2 py-2 "
            >
              خریداری شده
            </button>
          ) : (
            <button className="rounded-xl h-16 text-lg font-dorna w-[90%] bg-sky-500 text-white  font-bold mt-2 py-2">
              خرید
            </button>
          )}
        </div>

        <div className="w-full">
          {video
            .filter((videoItem) => videoItem.courseid == id && hasBoughtCourse)
            .map((data, index) => (
              <div key={index} className="w-full">
                <div
                  onClick={() => toggleVideo(index)}
                  className="flex justify-between items-center px-4 py-3 mb-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-sky-500 text-white flex items-center justify-center rounded-full font-bold">
                      {index + 1}
                    </div>
                    <div className="text-gray-800 font-medium text-base">
                      {data.videotitle}
                    </div>
                  </div>
                  <div className="text-sky-500 hover:text-sky-700 text-2xl transition-colors duration-200">
                    <MdKeyboardArrowLeft />
                  </div>
                </div>

                {openIndex === index && (
                  <div className="mb-4 px-4">
                    <video
                      src={data.video}
                      controls
                      className="w-full -z-10 max-h-[400px] rounded-xl shadow-md"
                    />
                  </div>
                )}
              </div>
            ))}
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