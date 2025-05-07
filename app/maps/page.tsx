"use client";

import { AdvancedMarker, APIProvider, Map } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home({ spots = [] }) {
  const API_KEY =
    (process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string) ??
    globalThis.GOOGLE_MAPS_API_KEY;

  const [displaySpots, setDisplaySpots] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Helper to geocode an address
  const geocodeAddress = async (address: string) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.status === "OK" && data.results[0]) {
      return data.results[0].geometry.location;
    }
    return null;
  };

  useEffect(() => {
    async function geocodeSpots() {
      setLoading(true);
      const spotsWithCoords = await Promise.all(
        spots.map(async (spot) => {
          const address = [spot.address, spot.city, spot.state]
            .filter(Boolean)
            .join(", ");
          const coords = await geocodeAddress(address);
          return coords ? { ...spot, coords } : null;
        })
      );
      setDisplaySpots(spotsWithCoords.filter(Boolean));
      setLoading(false);
    }
    if (spots && spots.length > 0) {
      geocodeSpots();
    } else {
      setDisplaySpots([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spots]);

  return (
    <div className="w-full h-screen bg-gray-100 flex flex-col items-center justify-center">
      {/* TEMP: List spots and displaySpots arrays */}
      <section className="w-full max-w-3xl bg-white rounded shadow p-4 mb-4">
        <h2 className="font-bold mb-2">Original Spots</h2>
        <ul className="mb-4 text-xs">
          {spots.map((spot, idx) => (
            <li key={spot.id || idx} className="mb-1">
              {Object.entries(spot).map(([k, v]) => (
                <span key={k} className="mr-2">
                  <b>{k}:</b> {JSON.stringify(v)}
                </span>
              ))}
            </li>
          ))}
        </ul>
        <h2 className="font-bold mb-2">Display Spots (with coords)</h2>
        <ul className="text-xs">
          {displaySpots.map((spot, idx) => (
            <li key={spot.id || idx} className="mb-1">
              {Object.entries(spot).map(([k, v]) => (
                <span key={k} className="mr-2">
                  <b>{k}:</b> {JSON.stringify(v)}
                </span>
              ))}
            </li>
          ))}
        </ul>
      </section>
      <APIProvider apiKey={API_KEY}>
        <Map
          mapId="parksuitemap"
          defaultZoom={5}
          defaultCenter={{ lat: 34.80053912524385, lng: -87.67498730542637 }}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
          className="w-full h-full"
        >
          <AdvancedMarker
            position={{ lat: 34.80053912524385, lng: -87.67498730542637 }}
            onClick={() => {
              console.log("Marker clicked!");
            }}
          >
            <Image
              src="https://park-suite.netlify.app/images/parksuite-dropper-logo-web.png"
              alt="ParkSuite Marker"
              width={50}
              height={50}
            />
          </AdvancedMarker>
          {/* Render displaySpots as markers */}
          {!loading &&
            displaySpots.map((spot) => (
              <AdvancedMarker
                key={spot.id}
                position={spot.coords}
                onClick={() => console.log("Clicked spot:", spot.title)}
              >
                <Image
                  src="https://park-suite.netlify.app/images/parksuite-dropper-logo-web.png"
                  alt="ParkSuite Marker"
                  width={50}
                  height={50}
                />
              </AdvancedMarker>
            ))}
        </Map>
      </APIProvider>
    </div>
  );
}
