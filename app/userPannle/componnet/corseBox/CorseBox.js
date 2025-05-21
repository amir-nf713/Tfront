
import React from 'react'
import { Star, Users } from 'lucide-react'

export default function CorseBox(props) {
  return (
    <div className="w-96 flex flex-col justify-center items-center max-Wide-mobile-xs:w-60 rounded-xl bg-white shadow-lg border">
          <img
            src={props.image}
            alt={props.title}
            className=" object-cover"
          />
          <div className="p-4">
            <h3 className="font-bold max-Wide-mobile-xs:text-sm text-lg text-gray-800 mb-1">{props.title}</h3>
            <p className="text-sm max-Wide-mobile-xs:text-xs text-gray-600 leading-relaxed line-clamp-2">
              {props.description}
            </p>
    
            <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400" fill="#facc15" />
                <span className="text-yellow-600 font-bold">{props.rating}</span>
              </div>
              <span>{props.teacher}</span>
            </div>
    
            <div className="flex justify-between items-center mt-2">
              <span className="text-green-600 font-bold max-Wide-mobile-xs:text-sm text-lg">
                {(props.price * 1).toLocaleString('fa-IR')} تومان
              </span>
              <div className="flex items-center gap-1 text-gray-500 max-Wide-mobile-xsl:text-sm">
                <Users className="w-4 h-4" />
                <span>{"160"}</span>
              </div>
            </div>
          </div>
          <button className='mb-3 bg-sky-500 text-white font-thin w-[96%] h-10 rounded-2xl'>عضویت</button>
        </div>
  )
}

