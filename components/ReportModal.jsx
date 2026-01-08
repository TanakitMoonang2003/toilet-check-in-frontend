'use client';
import React, { useEffect, useState } from "react";

export default function ReportModal({ isOpen, setIsOpen, data }) {
    const [user, setUser] = useState(null);
    const [description, setDescription] = useState('');
    const [localData, setLocalData] = useState(data);
    const [method, setMethod] = useState('POST');


    const handleSubmit = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_BACK_END + `report`, {
            method: method,
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                toilet_id: localData?.id,
                description: description,
            }),
        });
        const result = await response.json()
        setMethod('POST')
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

    function Edit() {
        setMethod('PUT'); // เปลี่ยนค่า method
        setLocalData(prevData => ({
            ...prevData,
            report: null,
        }));
        // อย่า console.log(method) ตรงนี้เพราะค่าจะยังไม่เปลี่ยน
    }

    // แทนด้วย useEffect ถ้าจะ debug
    useEffect(() => {
    }, [method]);


    const handleDelete = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_BACK_END + `report/${localData?.id}`, {
            method: 'DELETE',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {  // เช็คว่าการตอบกลับจากเซิร์ฟเวอร์เป็น OK หรือไม่
            const result = await response.json(); // ได้รับข้อมูล JSON
            window.location.reload(); // รีเฟรชหน้าจอ
        } else {
            const error = await response.text(); // ถ้าไม่ใช่ 200 OK
        }
    };

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 flex items-start justify-center top-20 z-50 ">
                    <div className="bg-white rounded-2xl p-6 text-center shadow-lg w-[95%] sm:w-[40%] md:w-[25%] ">
                        <div className='flex justify-end'>
                            <button onClick={setIsOpen}>
                                <img src="X.png" className="cursor-pointer" alt="Close" />
                            </button>
                        </div>
                        <div className='flex justify-center'>
                            <img src="report.png" alt="" />
                        </div>
                        <h2 className="text-2xl font-semibold text-[#13494D] mb-4 mt-2">{localData?.name}</h2>

                        {localData?.report && localData.report.length > 1 ?
                            <>

                                <p className='text-[#13494D] mt-4'> {localData?.report}</p>
                                {user ?
                                    <div className="flex space-x-4 mt-4">
                                        <button
                                            onClick={Edit}
                                            className="bg-[#E9BA06] hover:bg-[#C79804] text-white px-6 py-3 rounded-xl w-1/2 cursor-pointer"
                                        >
                                            EDIT
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            className="bg-[#F77888] hover:bg-[#F56F77] text-white px-6 py-3 rounded-xl w-1/2 cursor-pointer"
                                        >
                                            DELETE
                                        </button>
                                    </div>
                                    :
                                    <>
                                        <button
                                            onClick={() => (window.location.href = process.env.NEXT_PUBLIC_URL + `login`)}
                                            className="bg-[#F77888] hover:bg-rose-300 ms-2 text-white px-6 py-2 rounded-xl cursor-pointer"
                                        >
                                            Login
                                        </button>
                                    </>}

                            </>
                            :
                            <>
                                {user ?
                                    <>
                                        <textarea
                                            name=""
                                            id=""
                                            className="border rounded-xl ps-3 p-1 w-full mt-2 min-h-18 max-h-50 text-black"
                                            placeholder='Description...'
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        >
                                        </textarea>
                                        {description.length >= 1 ?
                                            <>
                                                <button
                                                    onClick={handleSubmit}
                                                    className="bg-[#F77888] hover:bg-rose-300 text-white px-6 py-2 rounded-xl cursor-pointer"
                                                >
                                                    Report
                                                </button>
                                            </>
                                            :
                                            <>
                                                <button
                                                    onClick={handleSubmit}
                                                    className="bg-gray-200 text-white px-6 py-2 rounded-xl cursor-pointer"
                                                    disabled
                                                >
                                                    Report
                                                </button>
                                            </>}
                                    </>
                                    :
                                    <>
                                        <button
                                            onClick={() => (window.location.href = process.env.NEXT_PUBLIC_URL + `login`)}
                                            className="bg-[#F77888] hover:bg-rose-300 ms-2 text-white px-6 py-2 rounded-xl cursor-pointer"
                                        >
                                            Login
                                        </button>
                                    </>
                                }


                            </>
                        }


                    </div>
                </div>
            )}
        </>
    );
}
