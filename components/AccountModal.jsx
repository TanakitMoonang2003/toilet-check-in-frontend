'use client';
import React from 'react';
import { useEffect, useState } from "react";

export default function AccountModal({ isOpen, setIsOpen }) {
  const toggleModal = () => setIsOpen(!isOpen);
  const [user, setUser] = useState(null);

  const handleSubmit = async () => {
    const response = await fetch(process.env.NEXT_PUBLIC_BACK_END + `logout`, {
      credentials: "include",
      method: 'POST',
    });
    const data = await response.json();
    window.location.reload();

  };

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_BACK_END + `api/user`, {
      credentials: "include",
    })
      .then(async (res) => {
        if (res.status === 401) {
          setUser(null);
          return;
        }

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Status ${res.status}: ${text}`);
        }

        return res.json();
      })
      .then((data) => {
        if (data) setUser(data);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      })
  }, []);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-start justify-center top-20 z-50 ">
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg w-[95%] sm:w-[40%] md:w-[25%] ">
            <h2 className="text-2xl font-semibold text-[#13494D] mb-4">ACCOUNT</h2>
            <div className="flex items-center space-x-2 border rounded-xl px-4 py-2 mb-6 justify-center">
              {user ?
                <>
                  {user.platform === 'google' ?
                    <img src="google.svg" alt="Google" className="w-5 h-5 " />
                    :
                    <img src="facebook.svg" alt="Google" className="w-5 h-5 " />
                  }

                  <span className="text-[#13494D]">{user.name}</span>
                </> :
                <>
                  <span className="text-[#13494D]">กรุณา Login</span>

                </>}
            </div>
            {user ?
              <>
                <button
                  onClick={toggleModal}
                  className="bg-gray-300 hover:bg-gray-400  text-gray-800 font-semibold px-6 py-2 rounded-xl transition duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-[#F77888] hover:bg-rose-300 ms-2 text-white px-6 py-2 rounded-xl cursor-pointer"
                >
                  Logout
                </button>
              </> :
              <>
                <button
                  onClick={toggleModal}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-2 rounded-xl transition duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => (window.location.href = process.env.NEXT_PUBLIC_URL + `login`)}
                  className="bg-[#F77888] hover:bg-rose-300 ms-2 text-white px-6 py-2 rounded-xl cursor-pointer"
                >
                  Login
                </button>

              </>}

          </div>
        </div>
      )}
    </>
  );
}
