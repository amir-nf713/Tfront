'use client'
import React, { useState } from 'react'
import { Star, Users } from 'lucide-react'
import apiKey from '@/app/API';
import axios from 'axios';

export default function CorseBoxx(props) {

    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [videoData, setVideoData] = useState({
      title: '',
      file: '',
    });
    const [uploading, setUploading] = useState(false);  // برای وضعیت بارگذاری
    const [progress, setProgress] = useState(0);  // برای نمایش نوار پیشرفت

    // تغییرات برای مدیریت حجم ویدیو
    const handleVideoChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const maxSize = 3 * 1024 * 1024 * 1024; // حداکثر حجم ۳ گیگ
        if (file.size > maxSize) {
          alert("ویدیو نباید بیشتر از ۳ گیگابایت باشد.");
          return;
        }
    
        const reader = new FileReader();
        reader.onloadend = () => {
          setVideoData(prev => ({
            ...prev,
            file: reader.result // این همون base64 هست
          }));
        };
        reader.readAsDataURL(file); // تبدیل به base64
      }
    };
    

    const handleVideoSubmit = async (e) => {
      e.preventDefault();
      setUploading(true);
      setProgress(0);
    
      try {
        const res = await axios.post(apiKey.video, {
          courseid: props.id,
          videotitle: videoData.title,
          base64data: videoData.file,
        }, {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
            }
          }
        });
    
        if (res.data?.massage === "ok") {
          alert("ویدیو با موفقیت ارسال شد.");
          setVideoData({ title: '', file: '' });
          setIsVideoModalOpen(false);
        } else {
          alert("خطا: " + res.data?.massage);
        }
      } catch (error) {
        console.error("Video upload error:", error);
        alert("خطا در ارسال ویدیو: " + error.message);
      } finally {
        setUploading(false);
      }
    };
    
      
    // حذف دوره
    const del = () => {
        axios.delete(`${apiKey.course}/${props.id}`);
    }

  return (
    <div className="max-w-60 flex justify-around items-center flex-col max-tablet-l:max-w-[165px] rounded-xl overflow-hidden bg-white shadow-lg border">
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

<div className="w-11/12 p-1 flex justify-center items-center flex-col">

<button
  onClick={() => setIsVideoModalOpen(true)}
  className='w-full py-2 mt-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-md transition-colors duration-300'>
  اضافه کردن ویدیو
</button>

          <button onClick={del} className='w-full py-2 mt-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md transition-colors duration-300'>
            حذف دوره
          </button>
</div>

{/* پاپ آپ برای ارسال ویدیو */}
{isVideoModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
      <h3 className="text-xl font-semibold mb-4">افزودن ویدیو</h3>
      <form onSubmit={handleVideoSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-700">عنوان ویدیو:</label>
          <input
            type="text"
            value={videoData.title}
            onChange={(e) => setVideoData({ ...videoData, title: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700">انتخاب فایل ویدیو:</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>

        {/* نوار پیشرفت */}
        {uploading && (
          <div className="w-full bg-gray-300 rounded-full h-2.5 mt-4">
            <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        )}

        <button 
          type="submit" 
          className="w-full py-2 mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md"
          disabled={uploading}>
          {uploading ? 'در حال بارگذاری...' : 'ارسال ویدیو'}
        </button>
        <button
          type="button"
          onClick={() => setIsVideoModalOpen(false)}
          className="w-full py-2 mt-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-md"
        >
          بستن
        </button>
      </form>
    </div>
  </div>
)}

        </div>
  )
}
