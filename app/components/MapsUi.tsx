"use client";

import { AdvancedMarker, Map, APIProvider } from "@vis.gl/react-google-maps";
import Image from "next/image";

export default function MapsUi({ spots = [] }) {
  const API_KEY =
    (process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string) ??
    globalThis.GOOGLE_MAPS_API_KEY;

  // Center map on first spot or fallback to a default location
  const defaultCenter = spots[0]?.coords || {
    lat: 34.80032984893158,
    lng: -87.6751996507496,
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h2 className="text-xl font-bold mb-4">Parking Spots Map</h2>
      {/* Optionally render spot details here if needed */}
      {spots.length === 0 ? (
        <div>No spots found matching your criteria.</div>
      ) : (
        <APIProvider apiKey={API_KEY}>
          <Map
            style={{ width: "100vw", height: "100vh" }}
            defaultCenter={defaultCenter}
            defaultZoom={15}
            gestureHandling={"greedy"}
            disableDefaultUI={true}
            mapId="roadmap"
          />
          {spots.map((spot) => (
            <AdvancedMarker
              key={spot.id}
              position={{ lat: Number(spot.lat), lng: Number(spot.lng) }}
              title={spot.title}
            >
              <Image
                src="/images/parksuite-dropper-logo-web.png"
                alt="Marker"
                width={32}
                height={32}
              />
            </AdvancedMarker>
          ))}
        </APIProvider>
      )}
    </div>
  );
}
