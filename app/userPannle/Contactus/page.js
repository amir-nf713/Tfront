import React from 'react';

const ContactComponent = () => {
  const phoneNumber = '9216069232'; // شماره تلفن خود را وارد کنید
  const whatsappLink = `https://wa.me/+98${phoneNumber}`;
  const telegramLink = `https://t.me/+98${phoneNumber}`;

  return (
    <div className="h-[100vh] flex justify-center items-center w-full">

    <div className="bg-white p-6 sm:p-8 lg:p-12 rounded-3xl shadow-xl w-md  mx-10">
      <h2 className="text-3xl font-semibold text-center text-gray-900 mb-6">راه‌های ارتباطی</h2>

      <div className="flex flex-col space-y-6">
        {/* شماره تلفن */}
        <a
          href={`tel:+98${phoneNumber}`}
          className="flex items-center justify-center space-x-3 text-gray-800 hover:text-blue-500 transition duration-300 py-3 px-6 rounded-full bg-gray-100 hover:bg-blue-100"
        >
          <span className="text-2xl">📞</span>
          <span className="font-medium text-lg">0{phoneNumber}</span>
        </a>

        {/* لینک واتس‌اپ */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center space-x-3 text-green-500 hover:text-green-700 transition duration-300 py-3 px-6 rounded-full bg-green-100 hover:bg-green-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-7 h-7"
          >
            <path
              fillRule="evenodd"
              d="M12 2.25C6.748 2.25 2.25 6.748 2.25 12s4.498 9.75 9.75 9.75 9.75-4.498 9.75-9.75S17.252 2.25 12 2.25zm0 17.25c-4.125 0-7.5-3.375-7.5-7.5 0-1.5 1.125-3 2.625-4.125-.75-1.125-.375-2.25.375-3 .75-.75 1.875-.75 2.625.375.75 1.125 1.875 2.25 3 3.375-.375.75-.75 1.5-1.125 2.25.75.75 1.5 1.5 2.25 2.25-1.875.75-3.75 1.5-5.625 1.5z"
            />
          </svg>
          <span className="font-medium text-lg">واتس‌اپ</span>
        </a>

        {/* لینک تلگرام */}
        <a
          href={telegramLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center space-x-3 text-blue-500 hover:text-blue-700 transition duration-300 py-3 px-6 rounded-full bg-blue-100 hover:bg-blue-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-7 h-7"
          >
            <path
              fillRule="evenodd"
              d="M12 2.25C6.748 2.25 2.25 6.748 2.25 12s4.498 9.75 9.75 9.75 9.75-4.498 9.75-9.75S17.252 2.25 12 2.25zm0 17.25c-4.125 0-7.5-3.375-7.5-7.5 0-1.5 1.125-3 2.625-4.125-.75-1.125-.375-2.25.375-3 .75-.75 1.875-.75 2.625.375.75 1.125 1.875 2.25 3 3.375-.375.75-.75 1.5-1.125 2.25.75.75 1.5 1.5 2.25 2.25-1.875.75-3.75 1.5-5.625 1.5z"
            />
          </svg>
          <span className="font-medium text-lg">تلگرام</span>
        </a>
      </div>
    </div>
    </div>
  );
};

export default ContactComponent;
