'use client';

import { useEffect, useState } from 'react';

export default function AddLocationModal({ onCancel, lat, long }) {
    const [isOpen, setIsOpen] = useState(true);
    const [fileName, setFileName] = useState('');
    const [rating, setRating] = useState(0); // <-- ⭐ เก็บคะแนนที่เลือก
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // เพิ่ม state

    useEffect(() => {
        setLoading(true); // เริ่มโหลด

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
            .finally(() => {
                setLoading(false); // เสร็จแล้วหยุดโหลด
            });
    }, []);



    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);       // ⬅️ เก็บตัวไฟล์ไว้
            setFileName(file.name);      // แสดงชื่อไฟล์
        }
    };

    const handleSubmit = async () => {
        if (!selectedFile) return alert('Please select an image');
        if (!title || !description) return alert('Please fill in title and description');

        const formData = new FormData();
        formData.append('image', selectedFile);      // ⬅️ รูปภาพ
        formData.append('title', title);             // ⬅️ ข้อความ Title
        formData.append('description', description); // ⬅️ ข้อความ Description
        formData.append('rate', rating); // ⬅️ ข้อความ Description
        formData.append('latitude', lat); // ⬅️ ข้อความ Description
        formData.append('longitude', long); // ⬅️ ข้อความ Description

        try {
            const response = await fetch(process.env.NEXT_PUBLIC_BACK_END + 'toilet', {
                credentials: "include",
                method: 'POST',
                body: formData,
            });

            const contentType = response.headers.get("content-type");

            if (!response.ok) {
                const errorText = await response.text(); // เก็บ error เป็น text
                throw new Error(`Server responded with ${response.status}: ${errorText}`);
            }

            if (contentType && contentType.includes("application/json")) {
                const result = await response.json();
            } else {
                const text = await response.text();
            }

        } catch (error) {
            console.error('Upload failed:', error.message);
        }

        setIsOpen(!isOpen)
        window.location.reload();
    };

    return (
        <>

            {isOpen && (

                <div className="fixed inset-0 flex items-start justify-center z-80">
                    <div className="bg-white rounded-2xl p-6 text-center shadow-lg  w-[95%] sm:w-[50%] mt-20 md:w-[40%]">
                        <h2 className="text-2xl font-semibold text-[#13494D] mb-4">
                            ADD LOCATION
                        </h2>
                        {loading ? (
                            <div className="animate-pulse space-y-3">
                                <div>
                                    <div className="h-10 bg-gray-200 rounded-xl w-full" />
                                </div>
                                <div>
                                    <div className="h-16 bg-gray-200 rounded-xl w-full mt-2" />
                                </div>
                                <div className="flex border rounded-xl border-[#DCE2E3]">
                                    <div className="w-[50%] h-10 bg-gray-200 rounded-l-xl" />
                                    <div className="flex-1 ms-5 py-1">
                                        <div className="h-6 w-32 bg-gray-200 rounded" />
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <p className='flex justify-start text-gray-400'>Rate this location:</p>
                                    <div className="flex justify-center space-x-2 mt-1">
                                        {[1, 2, 3, 4, 5].map((_, i) => (
                                            <div key={i} className="h-8 w-8 bg-gray-200 rounded-full" />
                                        ))}
                                    </div>
                                </div>
                                <div className="flex justify-center gap-4 ">
                                    <div className="h-5 w-24 bg-gray-200 rounded-xl" />
                                    <div className="h-5 w-24 bg-gray-200 rounded-xl" />
                                </div>
                            </div>
                        ) : user ? (
                            <>
                                <div>
                                    <input
                                        type="text"
                                        className="border rounded-xl ps-3 p-1 w-full text-black"
                                        placeholder="Title..."
                                        value={title}                         
                                        onChange={(e) => setTitle(e.target.value)} 
                                    />
                                </div>
                                <div>
                                    <textarea name="" id="" className="border rounded-xl ps-3 p-1 w-full mt-2 max-h-50 text-black" placeholder='Description...' value={description} onChange={(e) => setDescription(e.target.value)}>

                                    </textarea>
                                </div>
                                <div className='flex border rounded-xl border-[#DCE2E3]'>
                                    <label className="w-[50%] flex items-center justify-center cursor-pointer bg-[#DCE2E3] hover:bg-[#c6cdce] text-[#13494D] hover:text-[#13494dbc] font-bold py-2 px-4 rounded-l-xl">
                                        + Add image
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden text-black"
                                            onChange={handleFileChange}
                                        />
                                    </label>

                                    {fileName && (
                                        <div className="text-[#13494D] flex items-center ms-5 py-1">
                                            File: {fileName}
                                        </div>
                                    )}
                                </div>
                                <div className='mt-2'>
                                    <p className='flex justify-start text-black'>Rate this location:</p>
                                    <div className="flex justify-center space-x-1 ">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onClick={() => setRating(star)}
                                                className={`text-3xl transition-all mx-1 ${rating >= star ? 'text-yellow-400' : 'text-gray-300'
                                                    }`}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-center gap-4 mt-4">
                                    <button
                                        onClick={onCancel}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-2 rounded-xl transition duration-200 cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        className="bg-[#62B699] hover:bg-[#7ac3a9] text-white font-semibold px-6 py-2 rounded-xl transition duration-200 cursor-pointer"
                                    >
                                        Save
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className='mt-28'>
                                    <span className="text-[#13494D] ">
                                        กรุณา Login
                                    </span>
                                </div>
                                <div className='mt-28'>
                                    <button
                                        onClick={onCancel}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-2 rounded-xl transition duration-200 cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button onClick={() => (window.location.href = process.env.NEXT_PUBLIC_URL + `login`)}
                                        className="bg-[#F77888] hover:bg-rose-300 ms-2 text-white font-semibold px-6 py-2 rounded-xl transition duration-200 cursor-pointer"
                                    >
                                        Login
                                    </button>
                                </div>

                            </>
                        )}





                    </div>
                </div>

            )}
        </>
    );
}