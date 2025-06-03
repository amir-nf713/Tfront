"use client";
import React, { useCallback, useEffect, useState } from "react";
import CorseBox from "../componnet/corseBox/CorseBox";
import axios from "axios";
import apiKey from "@/app/API";
import Link from "next/link";
import Cookies from "js-cookie";

export default function Page() {
  const [allCourses, setAllCourses] = useState([]);
  const [userCourses, setUserCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const getCookie = useCallback((name) => Cookies.get(name) || null, []);
  const userId = getCookie("login");

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    axios
      .get(`${apiKey.userscourse}/${userId}`)
      .then((res) => {
        const boughtCourseIds = res.data.data.map((item) => item.courseid);
        setUserCourses(boughtCourseIds);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    axios
      .get(apiKey.course)
      .then((res) => setAllCourses(res.data.data))
      .catch(() => {});
  }, []);

  const filteredCourses = allCourses.filter((course) =>
    userCourses.includes(course._id)
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
    );
  

  if (!userId)
    return (
      <div className="w-full h-[70vh] flex justify-center items-center bg-red-50">
        <div className="bg-white p-6 rounded-lg shadow-md text-center text-red-600 text-lg font-semibold max-w-md">
          لطفا ابتدا وارد شوید تا دوره‌های خریداری شده خود را ببینید.
        </div>
      </div>
    );

  if (filteredCourses.length === 0)
    return (
      <div className="text-center mt-10 text-gray-700">
        شما هنوز در تدریس یار عضو نشده اید .
      </div>
    );

  return (
    <div className="w-full flex justify-center items-center mt-16">
      <div className="w-11/12 max-tablet-l:gap-1.5 flex justify-center items-center flex-wrap gap-4">
        {filteredCourses.map((course) => (
          <Link key={course._id} href={`/userPannle/course/page?id=${course._id}`}>
            <CorseBox
              title={course.title}
              description={course.explanation}
              image={course.photo}
              rating={5.0}
              price={course.price}
              teacher={course.teachersname}
              purchased={true}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
