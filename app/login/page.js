'use client';
import { useEffect, useState } from "react";
export default function Login() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        setLoading(true);

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
            .finally(() => setLoading(false));
    }, []);
    if (!user) {
        return (
            <div>
                <div className="hidden lg:block">
                    <div className="flex h-screen bg-[#62B699]">
                        <div className="w-1/2 bg-[#62B699] flex flex-col items-center justify-center">
                            <img src="map.svg" alt="Logo" className="w-70 h-auto flex justify-center" />
                            <h1 className="text-white text-2xl font-mono">Toilet Check-In</h1>
                        </div>
                        <div className="w-1/2 bg-[#FAF4E7] rounded-l-3xl flex flex-col items-center justify-center">
                            <h2 className="text-3xl font-mono text-[#13494D] font-bold">Toilet Check-In</h2>
                            <hr className="w-2/4 border-t border-gray-300 my-8" />
                            <div className="space-y-4">
                                <button onClick={() => (window.location.href = process.env.NEXT_PUBLIC_BACK_END + `auth/google`)} className="w-full cursor-pointer flex items-center justify-center space-x-2 py-3 px-28 hover:bg-gray-200 bg-white rounded-xl shadow text-[#13494D]">
                                    <img src="google.svg" className="w-5 h-5" />
                                    <span className="text-xl text-black px-3">Sign in with Google</span>
                                </button>
                                <button onClick={() => (window.location.href = process.env.NEXT_PUBLIC_BACK_END + `auth/facebook`)} className="w-full cursor-pointer flex items-center justify-center space-x-2 py-3 px-28 hover:bg-gray-200 bg-white rounded-xl shadow text-[#13494D]">
                                    <img src="facebook.svg" className="w-5 h-5" />
                                    <span className="text-xl text-black px-3">Sign in with Facebook</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:hidden">
                    <div className="h-screen bg-[#62B699] flex flex-col justify-between">
                        <div className="flex flex-col items-center mt-10">
                            <img src="map.svg" alt="Logo" className="w-70 h-auto" />
                            <h1 className="text-white text-2xl font-mono">Toilet Check-In</h1>
                        </div>

                        <div className="w-full bg-[#FAF4E7] rounded-t-3xl h-1/3">
                            <h2 className="text-xl font-mono text-[#13494D] flex  justify-center font-bold mt-4">Login to continue</h2>
                            <hr className="w-full border-t border-gray-300 my-4" />
                            <div className="px-4">
                                <button onClick={() => (window.location.href = process.env.NEXT_PUBLIC_BACK_END + `auth/google`)} className=" w-full mb-4 cursor-pointer flex items-center justify-center py-3  hover:bg-gray-200 bg-white rounded-xl shadow text-[#13494D]">
                                    <img src="google.svg" className="w-5 h-5" />
                                    <span className="text-xl text-black px-3">Sign in with Google</span>
                                </button>
                                <button onClick={() => (window.location.href = process.env.NEXT_PUBLIC_BACK_END + `auth/facebook`)} className=" w-full cursor-pointer flex items-center justify-center py-3 hover:bg-gray-200 bg-white rounded-xl shadow text-[#13494D]">
                                    <img src="facebook.svg" className="w-5 h-5" />
                                    <span className="text-xl text-black px-3">Sign in with Facebook</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    else { window.location.href = process.env.NEXT_PUBLIC_URL; }
}