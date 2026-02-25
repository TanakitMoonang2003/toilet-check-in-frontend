"use client";
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import AddLocationModal from '@/components/AddLocationModal';
import LocationModal from '@/components/LocationModal';

const Mapbox = ({ pin, setPin }) => {
  const mapContainerRef = useRef();
  const mapRef = useRef();
  const geocoderContainerRef = useRef();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastPlacedPin, setLastPlacedPin] = useState(null);

  const [features, setFeatures] = useState(null);
  const [selectedLat, setSelectedLat] = useState(null);
  const [selectedLong, setSelectedLong] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleCancelPin = () => {
    const map = mapRef.current;
    const source = map.getSource('points');
    if (source && lastPlacedPin) {
      const currentData = source._data;
      const filtered = currentData.features.filter(
        f =>
          f.geometry.coordinates[0] !== lastPlacedPin.geometry.coordinates[0] ||
          f.geometry.coordinates[1] !== lastPlacedPin.geometry.coordinates[1]
      );
      source.setData({
        ...currentData,
        features: filtered,
      });
      setLastPlacedPin(null);
    }

    setIsModalOpen(false);
  };

  useEffect(() => {
    // สร้างฟังก์ชัน async ภายใน useEffect
    const fetchData = async () => {
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_BACK_END + `toilet`);
        const data = await response.json();
        setFeatures(data); // ตั้งค่าข้อมูลที่ได้รับจาก API
      } catch (error) {
        console.error("Error fetching data:", error); // จัดการกับข้อผิดพลาด
      }
    };

    fetchData(); // เรียกใช้งานฟังก์ชัน
  }, []); // ไม่มี dependencies จะทำงานแค่ครั้งเดียวเมื่อ component mount





  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [100.423186, 13.736717],
      zoom: 12,
      minZoom: 10,
      maxZoom: 20,
      preserveDrawingBuffer: true,
    });
  
    mapRef.current = map;
    map.dragRotate.disable();
  
    map.getCanvas().addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl,
      marker: false,
      placeholder: 'ค้นหาสถานที่...',
    });
  
    if (geocoderContainerRef.current) {
      geocoderContainerRef.current.innerHTML = '';
      geocoderContainerRef.current.appendChild(geocoder.onAdd(map));
    }
  
    map.on('load', () => {
      map.dragRotate.disable();
      map.addControl(new MapboxLanguage({ defaultLanguage: 'th' }));
  
      if (features && features.length > 0) {
        // โหลดภาพไอคอนเพียงครั้งเดียวเท่านั้น
        const loadIcons = async () => {
          const [normalImage, reportImage] = await Promise.all([
            new Promise((resolve, reject) => {
              map.loadImage('https://cdn-icons-png.flaticon.com/512/684/684908.png', (error, image) => {
                if (error) reject(error);
                else resolve(image);
              });
            }),
            new Promise((resolve, reject) => {
              map.loadImage('https://i.postimg.cc/ZK6bhm2h/placeholder-1.png', (error, image) => {
                if (error) reject(error);
                else resolve(image);
              });
            })
          ]);
  
          if (!map.hasImage('marker-normal')) {
            map.addImage('marker-normal', normalImage);
          }
          if (!map.hasImage('marker-report')) {
            map.addImage('marker-report', reportImage);
          }
  
          // เพิ่มข้อมูลลงในแผนที่
          map.addSource('points', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: features.map((feature) => ({
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: feature.geometry.coordinates,
                },
                properties: {
                  ...feature.properties,
                  icon: feature.properties.report ? 'marker-report' : 'marker-normal',
                },
              })),
            },
          });
  
          // เพิ่ม layer
          map.addLayer({
            id: 'points',
            type: 'symbol',
            source: 'points',
            layout: {
              'icon-image': ['get', 'icon'],
              'icon-size': 0.07,
              'icon-allow-overlap': true,
            },
            interactive: true,
          });
  
          // ตั้งค่า event click
          map.on('click', 'points', (e) => {
            const feature = e.features[0];
            if (feature) {
              const coords = feature.geometry.coordinates;
              const { name, description, rate, report, image, id } = feature.properties;
  
              setSelectedLocation({
                id,
                name,
                description,
                rate,
                report,
                image,
                coords,
              });
  
              setModalOpen(true);
            }
          });
  
          // เปลี่ยน cursor เมื่อ hover
          map.on('mouseenter', 'points', () => {
            map.getCanvas().style.cursor = 'pointer';
          });
          map.on('mouseleave', 'points', () => {
            map.getCanvas().style.cursor = '';
          });
        };
  
        loadIcons().catch((error) => {
          console.error('Error loading images:', error);
        });
      }
    });
  
    return () => map.remove();
  }, [features]); // เพิ่ม features เป็น dependency เพื่อให้แผนที่อัพเดทตามข้อมูลใหม่


  useEffect(() => {
    const map = mapRef.current;
    if (!map || !pin) return;

    const handleClick = (e) => {
      const { lng, lat } = e.lngLat;
      setSelectedLat(lat); // 👉 ส่งค่าไปเก็บไว้
      setSelectedLong(lng);

      const newFeature = {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [lng, lat] },
        properties: { name: 'ตำแหน่งใหม่' },
      };

      const source = map.getSource('points');
      if (source) {
        const currentData = source._data;
        const updatedData = {
          ...currentData,
          features: [...currentData.features, newFeature],
        };
        source.setData(updatedData);
        setLastPlacedPin(newFeature);
      }

      setPin(false);
      setIsModalOpen(false);
      setTimeout(() => {
        setIsModalOpen(true);
      }, 0);
    };


    map.on('click', handleClick);
    return () => map.off('click', handleClick);
  }, [pin]);



  return (
    <div className=" top-0 left-0 h-screen z-0 overflow-y-hidden">
      {isModalOpen && (
        <AddLocationModal onCancel={handleCancelPin} lat={selectedLat} long={selectedLong} />
      )}
      <LocationModal isOpen={modalOpen} setIsOpen={setModalOpen} data={selectedLocation} />



      {/* Header logo bar */}
      <div className="absolute top-0 left-0 w-full z-10 bg-white/90 backdrop-blur-sm shadow-sm flex items-center px-4 py-1">
        <img src="/e4d32d27-0cc2-49f4-95f3-01ce83d2c07f.jpg" alt="IT Chiangmai Technical College" className="h-10 w-auto object-contain" />
      </div>

      {/* ช่องค้นหาเต็มความกว้าง มี padding ซ้ายขวา */}
      <div
        ref={geocoderContainerRef}
        className="absolute top-14 px-4 z-10 w-full "
      />

      {/* แผนที่ */}

      <div ref={mapContainerRef} id="map" className="w-auto h-full select-none" onContextMenu={(e) => e.preventDefault()} />
    </div>
  );

};

export default Mapbox;
