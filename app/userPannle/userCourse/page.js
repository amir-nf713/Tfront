"use client";
import React, { useCallback, useEffect, useState } from "react";
import CorseBox from "../componnet/corseBox/CorseBox";
import axios from "axios";
import apiKey from "@/app/API";
import Link from "next/link";
import Cookies from "js-cookie";

export default function Page() {
  const [allCourses, setAllCourses] = useState([]);      // همه دوره‌ها
  const [userCourses, setUserCourses] = useState([]);    // دوره‌های خریداری شده توسط کاربر
  const [loading, setLoading] = useState(true);

  // گرفتن کوکی ورود کاربر
  const getCookie = useCallback((name) => {
    return Cookies.get(name) || null;
  }, []);

  const userId = getCookie("login");

  useEffect(() => {
    if (!userId) {
      setLoading(false);  // اگر لاگین نیستیم، نیازی به لودینگ نیست
      return;
    }

    // گرفتن دوره‌هایی که کاربر خریداری کرده
    axios
      .get(`${apiKey.userscourse}/${userId}`)
      .then((res) => {
        // فقط شناسه دوره‌ها رو نگه می‌داریم
        const boughtCourseIds = res.data.data.map((item) => item.courseid);
        setUserCourses(boughtCourseIds);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    // گرفتن همه دوره‌ها
    axios
      .get(apiKey.course)
      .then((res) => {
        setAllCourses(res.data.data);
      })
      .catch(() => {});
  }, []);

  // فیلتر کردن دوره‌ها که فقط دوره‌های خریداری شده نمایش داده شوند
  const filteredCourses = allCourses.filter((course) =>
    userCourses.includes(course._id)
  );

  if (loading)
    return <div className="text-center mt-10">در حال بارگذاری...</div>;

  if (!userId)
    return (
      <div className="text-center mt-10 text-red-500">
        لطفا ابتدا وارد شوید تا دوره‌های خریداری شده خود را ببینید.
      </div>
    );

  if (filteredCourses.length === 0)
    return (
      <div className="text-center mt-10 text-gray-700">
        شما هنوز هیچ دوره‌ای خریداری نکرده‌اید.
      </div>
    );

  return (
    <div className="w-full flex justify-center items-center mt-16">
      <div className="w-11/12 max-tablet-l:gap-1.5 flex justify-center items-center flex-wrap gap-4">
        {filteredCourses.map((course, index) => (
          <Link key={course._id} href={`/userPannle/course/page?id=${course._id}`}>
            <CorseBox
              title={course.title}
              description={course.explanation}
              image={course.photo}
              rating={5.0}
              price={course.price}
              teacher={course.teachersname}
              purchased={true} // چون خریداری شده‌اند
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
