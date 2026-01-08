// components/BottomNavbar.jsx
'use client';
import React from 'react';
import Link from 'next/link';

export default function BottomNavbar({ pin, setPin, onOpenAccount }) {
    return (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2  ">
            <div className="bg-white shadow-lg rounded-xl w-[200px] h-[64px] flex relative overflow-hidden ">
                {/* ปุ่มซ้าย */}
                <button
                    className={`w-1/2 flex justify-center items-center transition ${pin ? 'bg-[#62B699]' : 'hover:bg-gray-100'
                        }`}
                    onClick={() => setPin(prev => !prev)}
                >
                    <img src="/map.svg" className="w-[43px] h-[43px]" alt="map" />
                </button>

                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-px bg-gray-300" />

                {/* ปุ่มขวา */}
                <div
                    className="w-1/2 flex justify-center items-center cursor-pointer hover:bg-gray-100 transition"
                    onClick={onOpenAccount}    // เรียก callback ที่ส่งมาจาก parent
                >
                    <img src="/user.svg" className="w-10 h-10" alt="User" />
                </div>
            </div>
        </div>
    );
}
