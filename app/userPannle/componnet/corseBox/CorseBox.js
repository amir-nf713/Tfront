
import React from 'react'
import { Star, Users } from 'lucide-react'

export default function CorseBox(props) {
  return (
    <div className="max-w-60 max-tablet-l:max-w-[165px] rounded-xl overflow-hidden bg-white shadow-lg border">
          <img
            src={props.image}
            alt={props.title}
            className="w-full max-tablet-l:h-32 h-40 object-cover"
          />
          <div className="p-4">
            <h3 className="font-bold max-tablet-l:text-sm text-lg text-gray-800 mb-1">{props.title}</h3>
            <p className="text-sm max-tablet-l:text-xs text-gray-600 leading-relaxed line-clamp-2">
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
              <span className="text-green-600 font-bold max-tablet-l:text-sm text-lg">
                {(props.price * 1).toLocaleString('fa-IR')} تومان
              </span>
              <div className="flex items-center gap-1 text-gray-500 max-tablet-l:text-sm">
                <Users className="w-4 h-4" />
                <span>{props.students}</span>
              </div>
            </div>
          </div>
        </div>
  )
}

