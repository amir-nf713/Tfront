"use client";
import apiKey from "@/app/API";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import { Star, Users } from "lucide-react";
import Cookies from "js-cookie";
import { MdKeyboardArrowLeft } from "react-icons/md";

function Page() {
  const [openIndex, setOpenIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [userCourses, setUserCourses] = useState([]);

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const getCookie = useCallback((name) => {
    return Cookies.get(name) || null;
  }, []);

  const loginCookieValue = getCookie("login");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [courseRes, videosRes, userCoursesRes] = await Promise.all([
          axios.get(`${apiKey.course}/${id}`),
          axios.get(`${apiKey.video}`),
          axios.get(`${apiKey.userscourse}/${loginCookieValue}`),
        ]);

        setCourse(courseRes.data.data);
        setVideos(videosRes.data.data);
        setUserCourses(userCoursesRes.data.data);
      } catch (err) {
        setError("خطا در دریافت اطلاعات. لطفاً دوباره تلاش کنید.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id && loginCookieValue) fetchData();
  }, [id, loginCookieValue]);

  const hasBoughtCourse = userCourses.some(
    (item) => item.courseid == id && item.userid == loginCookieValue
  );

  const buyCourse = async () => {
    try {
      const response = await axios.post(apiKey.pay, {
        courseId: id,
        title: course.title,
        userId: loginCookieValue,
      });
  
      if (response.data.url) {
        // کاربر به درگاه زرین‌پال منتقل شود
        window.location.href = response.data.url;
      } else {
        setError("مشکلی در ارسال درخواست پرداخت پیش آمده است.");
      }
    } catch (error) {
      console.error("خطا در درخواست پرداخت:", error);
      setError("خطا در درخواست پرداخت. لطفاً مجدداً تلاش کنید.");
    }
  };
  

  const toggleVideo = (index) => {
    if (hasBoughtCourse || index === 0) {
      setOpenIndex(openIndex === index ? null : index);
    }
  };

  if (loading)
    return <div className="text-center py-8">در حال بارگذاری...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!course) return <div className="text-center py-8">دوره یافت نشد</div>;

  return (
    <div className="w-full min-h-[98.7vh] py-8 flex justify-center items-start">
      <div className="w-[80%] max-w-6xl flex flex-col lg:flex-row-reverse rounded-2xl bg-white shadow-xl">
        {/* Course Info Section */}
        <div className="lg:max-w-[400px] w-full flex flex-col justify-between p-4 border-b lg:border-b-0 lg:border-r">
          <div>
            <img
              src={course.photo}
              alt={course.title}
              className="size-auto rounded-2xl  object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-800 mb-2">
                {course.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {course.explanation}
              </p>

              <div className="flex justify-between items-center mb-2 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400" fill="#facc15" />
                  <span className="text-yellow-600 font-bold">5.0</span>
                </div>
                <span className="text-gray-500">{course.teachersname}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-green-600 font-bold text-lg">
                  {(course.price * 1).toLocaleString("fa-IR")} تومان
                </span>
                <div className="flex items-center gap-1 text-gray-500">
                  <Users className="w-4 h-4" />
                  <span>160</span>
                </div>
              </div>
            </div>
          </div>

          {hasBoughtCourse ? (
            <button
              disabled
              className="rounded-xl h-12 w-full disabled:bg-gray-400 bg-gray-400 text-white font-bold py-2"
            >
              خریداری شده
            </button>
          ) : (
            <button
              onClick={buyCourse}
              className="rounded-xl h-12 w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 transition-colors"
            >
              خرید دوره
            </button>
          )}
        </div>

        {/* Videos Section */}
        <div className="flex-1 p-4 overflow-y-auto max-h-[800px]">
          {videos
            .filter((video) => video.courseid == id)
            .map((video, index) => {
              return (
                <div key={video.id || index} className="mb-4">
                  <div
                    onClick={() => toggleVideo(index)}
                    className={`flex justify-between items-center px-4 py-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ${
                      hasBoughtCourse || index === 0 ? "cursor-pointer" : "cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-sky-500 text-white flex items-center justify-center rounded-full font-bold">
                        {index + 1}
                      </div>
                      <div className="text-gray-800 font-medium">
                        {course.title} قسمت {index + 1}
                      </div>
                    </div>
                    <div className="flex flex-row">

                    <div className={`${hasBoughtCourse || index === 0 ? "text-green-500" : "text-gray-400"}`}>{index === 0 ? " رایگان" : ""}</div>
                    <MdKeyboardArrowLeft
                      className={`text-2xl transition-transform ${
                        openIndex === index ? "rotate-90" : ""
                      } ${hasBoughtCourse || index === 0 ? "text-green-500" : "text-gray-400"}`}
                    />
                    
                    </div>
                  </div>

                  {openIndex === index && (hasBoughtCourse || index === 0) && (
                    <div className="mt-2 px-4">
                      <video
                        src={`${video.video}`}
                        controls
                        className="w-full max-h-[400px] rounded-xl shadow-md"
                      />
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default function CoursePage() {
  return (
    <Suspense
      fallback={<div className="text-center py-8">در حال بارگذاری...</div>}
    >
      <Page />
    </Suspense>
  );
}
