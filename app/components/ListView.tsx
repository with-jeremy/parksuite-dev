import React from "react";

interface ListViewProps {
  spots: Array<{
    id: string;
    title: string;
    address?: string;
    city?: string;
    state?: string;
    lat?: number;
    lng?: number;
  }>;
}

export default function ListView({ spots }: ListViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl m-auto">
      {spots.map((spot) => (
        <div key={spot.id}>
          <div className="font-xl">
            {spot.id} - {spot.title}
          </div>
          <div className="text-sm text-gray-500">{spot.address}</div>
          <div className="text-sm text-gray-500">
            {spot.city}, {spot.state}
          </div>
          <div>
            fullAddress:{" "}
            {[spot.address, spot.city, spot.state].filter(Boolean).join(", ")}
          </div>
          <div className="text-xs text-blue-700">
            lat: {spot.lat}, lng: {spot.lng}
          </div>
          {/* Add more details about the spot here */}
        </div>
      ))}
    </div>
  );
}
