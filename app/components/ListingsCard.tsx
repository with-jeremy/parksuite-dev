"use client";
import React, { useState } from "react";
import Image from "next/image";
import BookingForm from "./BookingForm";

interface ListingsCardProps {
  spot: any;
  amenities: { amenities: { name: string } }[];
  signedImages: { signedUrl: string | null; is_primary: boolean | null }[];
}

const ListingsCard: React.FC<ListingsCardProps> = ({ spot, amenities, signedImages }) => {
  const [showBooking, setShowBooking] = useState(false);
  const [uiMessage, setUiMessage] = useState<string | null>(null);

  const handleBookNow = () => {
    console.log('Book Now clicked');
    setUiMessage('Opening booking modal...');
    setShowBooking(true);
    setTimeout(() => setUiMessage(null), 2000);
  };

  return (
    <>
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-2">{spot.title}</h2>
        <p className="text-gray-600 mb-4">{spot.address || spot.city + ", " + spot.state}</p>
        <div className="mb-4 flex gap-2 overflow-x-auto">
          {signedImages && signedImages.length > 0 ? (
            signedImages.map((img, idx) =>
              img.signedUrl ? (
                <Image
                  key={idx}
                  src={img.signedUrl}
                  alt={spot.title + " image"}
                  className={`h-32 w-48 object-cover rounded ${img.is_primary ? 'border-4 border-blue-500' : ''}`}
                  width={192}
                  height={128}
                />
              ) : null
            )
          ) : (
            <div className="text-gray-400">No images available</div>
          )}
        </div>
        <div className="mb-4">
          <h3 className="font-semibold">Amenities:</h3>
          <ul className="flex flex-wrap gap-2 mt-1">
            {amenities && amenities.length > 0 ? (
              amenities.map((a, idx) => (
                <li key={idx} className="bg-gray-100 px-2 py-1 rounded text-sm">
                  {a.amenities?.name}
                </li>
              ))
            ) : (
              <li className="text-gray-400">No amenities listed</li>
            )}
          </ul>
        </div>
        <div className="text-gray-700">
          <p><span className="font-semibold">Description:</span> {spot.description || 'No description provided.'}</p>
        </div>
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex justify-between w-56">
              <span className="font-medium">Price</span>
              <span>${spot.price_per_day?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between w-56 mt-1">
              <span className="text-sm text-gray-500">Rental Fee (3%)</span>
              <span className="text-sm text-gray-500">${spot.price_per_day ? (spot.price_per_day * 0.03).toFixed(2) : '0.00'}</span>
            </div>
            <div className="flex justify-between w-56 mt-2 border-t pt-2 font-semibold">
              <span>Total</span>
              <span>${spot.price_per_day ? (spot.price_per_day * 1.03).toFixed(2) : '0.00'}</span>
            </div>
          </div>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded shadow mt-4 md:mt-0"
            onClick={handleBookNow}
          >
            Book Now
          </button>
        </div>
        {uiMessage && (
          <div className="mt-4 p-2 bg-yellow-100 text-yellow-800 rounded text-center">{uiMessage}</div>
        )}
      </div>
      {showBooking && (
        <BookingForm spot={spot} onClose={() => {
          console.log('Booking modal closed');
          setUiMessage('Closed booking modal.');
          setShowBooking(false);
          setTimeout(() => setUiMessage(null), 2000);
        }} />
      )}
    </>
  );
};

export default ListingsCard;
