'use client';
import { useEffect, useState } from "react";
import Image from "next/image";
import Layout from "@/components/Layout";
import Mapbox from "./map/page";
import BottomNavbar from "@/components/Navbar";
import AccountModal from "@/components/AccountModal";
import AddLocationModal from "@/components/AddLocationModal";
import LocationModal from "@/components/LocationModal";
export default function Home() {
  const [pin, setPin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // ✅
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#_=_') {
      window.history.replaceState(null, null, window.location.pathname);
    }
  }, []);

  return (
    <>

      <div>

        <Layout>
          <Mapbox
            pin={pin}
            setPin={setPin}
            setIsModalOpen={setIsModalOpen}
          />
        </Layout>
        {isModalOpen && (
          <AddLocationModal
            isOpen={isModalOpen}
            setIsOpen={setIsModalOpen}
          />
        )}
        <BottomNavbar
          pin={pin}
          setPin={setPin}
          onOpenAccount={() => setIsAccountOpen(true)}
        />


        <AccountModal
          isOpen={isAccountOpen}
          setIsOpen={setIsAccountOpen}
        />


        <LocationModal
          isOpen={isLocationOpen}
          setIsOpen={setIsLocationOpen}
        />
      </div>

    </>
  );
}




