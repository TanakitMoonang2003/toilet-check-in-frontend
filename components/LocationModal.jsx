
import React, { useEffect, useRef, useState } from 'react';
import Image from "next/image";
import ReportModal from "@/components/ReportModal";

export default function LocationModal({ isOpen, setIsOpen, data }) {
  const toggleModal = () => setIsOpen(false);
  const rate = data?.rate || 0;
  const [modalOpen, setModalOpen] = useState(false);


  function modal() {
    setModalOpen(true)
  }
  return (
    <>
      {modalOpen == true ?
        <>
          <ReportModal
            isOpen={modalOpen}
            setIsOpen={setModalOpen}
            data={data}
          />
        </>
        :
        <>
          {isOpen && (
            <div className="fixed inset-0 flex items-start justify-center top-20 mt-2 sm:mt-0 overflow-auto h-[70%] z-50">
              <div className="bg-white rounded-2xl p-6 text-center shadow-lg w-[95%] sm:w-[50%] md:w-[50%] lg:w-[25%]">
                <div className='flex justify-between'>
                  {data?.report && data.report.length > 1 ?
                    <button onClick={modal}>
                      <div className='cursor-pointer'>
                        <img src="Vector.png" alt="Vector" />
                      </div>
                    </button> :
                    <button onClick={modal}>
                      <div className='cursor-pointer'>
                        <p className='font-semibold underline text-[#F77888]'>REPORT!</p>
                      </div>
                    </button>}


                  <button onClick={toggleModal}>
                    <img src="X.png" className="cursor-pointer" alt="Close" />
                  </button>
                </div>

                <div className="w-full flex justify-center">
                  <img src="map.svg" className='w-20 h-20' alt="Map Icon" />
                </div>

                <h2 className="text-2xl font-semibold text-[#13494D] mb-4 mt-2 wrap-break-word">{data?.name}</h2>

                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-3xl transition-all mx-1 ${rate >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    {rate >= star ? '★' : '☆'}
                  </span>
                ))}
                <div className='flex justify-center mt-4'>
                  <img src={`${process.env.NEXT_PUBLIC_BACK_END}images/${data?.image}`} className='w-auto h-auto object-cover' alt="Image" />
                </div>

                <div className='h-24 overflow-auto'>
                  <p className='mt-2 break-words text-black'>{data?.description}</p>
                </div>
              </div>



            </div>
          )}</>
      }


    </>
  );
}
