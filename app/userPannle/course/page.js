'use client'
import React, { useEffect, useState } from "react";
import CorseBox from "../componnet/corseBox/CorseBox";
import axios from "axios";
import apiKey from "@/app/API";
import Link from "next/link";
// import { useSearchParams } from "next/navigation";

export default function page() {
  
    const [course, setcourse] = useState([])



    useEffect(() => {
      axios.get(apiKey.course)
      .then(data => {
         setcourse(data.data.data)
      }).catch(() => {})
    }, [])

  return (
    <div className="w-full flex justify-center items-center mt-16">
      <div className="w-11/12 max-tablet-l:gap-1.5 flex justify-center items-center flex-wrap gap-4">
      {
        course.map((data, index) => (
            <Link href={`/userPannle/course/page?id=${data._id}`}>
                <CorseBox
                  title={data.title}
                  description={data.explanation}
                  image={data.photo}
                  rating={5.0}
                  price={data.price}
                  teacher={data.teachersname}
                ></CorseBox>
            </Link>
        ))
    }
      </div>
    </div>
  );
}
