"use client";
import React, { useState } from "react";
import Image from "next/image";
import BookingForm from "./BookingForm";
import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogContent,
} from "./ui/dialog";
import Link from 'next/link';
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface ListingsCardProps {
  spot: any;
  amenities: { amenities: { name: string } }[];
  signedImages: { signedUrl: string | null; is_primary: boolean | null }[];
}

const ListingsCard: React.FC<ListingsCardProps> = ({ spot, amenities, signedImages }) => {
  const [showBooking, setShowBooking] = useState(false);
  const [uiMessage, setUiMessage] = useState<string | null>(null);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomIdx, setZoomIdx] = useState(0);
  const { isSignedIn, user } = useUser();
  const router = useRouter();

  const handleBookNow = () => {
    console.log('Book Now clicked');
    
    // Check if user is signed in
    if (!isSignedIn) {
      setUiMessage('Please sign in to book this spot');
      setTimeout(() => {
        router.push('/sign-in');
      }, 1500);
      return;
    }
    
    setUiMessage('Opening booking modal...');
    setShowBooking(true);
    setTimeout(() => setUiMessage(null), 2000);
  };

  React.useEffect(() => {
    if (!zoomOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setZoomIdx((prev) => (prev + 1) % (signedImages.length));
      } else if (e.key === "ArrowLeft") {
        setZoomIdx((prev) => (prev - 1 + signedImages.length) % signedImages.length);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [zoomOpen, signedImages.length]);

  return (
    <>
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-2">{spot.title}</h2>
        <p className="text-gray-600 mb-4">{spot.address + ", " + spot.city + ", " + spot.state}</p>
        <div className="mb-4 flex gap-2 overflow-x-auto">
          {signedImages && signedImages.length > 0 ? (
            signedImages.map((img, idx) =>
              img.signedUrl ? (
                <button
                  key={idx}
                  type="button"
                  aria-label={`View image ${idx + 1} of ${signedImages.length}`}
                  className="focus:outline-none"
                  onClick={() => {
                    setZoomIdx(idx);
                    setZoomOpen(true);
                  }}
                  style={{ background: "none", border: 0, padding: 0 }}
                >
                  <Image
                    src={img.signedUrl}
                    alt={spot.title + " image"}
                    className={`h-32 w-48 object-cover rounded ${img.is_primary ? 'border-4 border-blue-500' : ''}`}
                    width={192}
                    height={128}
                  />
                </button>
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
              <span className="font-medium">Price per day:</span>
              <span>${spot.price_per_day?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between w-56 mt-1">
              <span className="text-sm text-gray-900">Rental Fee (3%):</span>
              <span className="text-sm text-gray-900">${spot.price_per_day ? (spot.price_per_day * 0.03).toFixed(2) : '0.00'}</span>
            </div>
            <div className="flex justify-between w-56 mt-2 border-t pt-2 font-semibold">
              <span>Total:</span>
              <span>${spot.price_per_day ? (spot.price_per_day * 1.03).toFixed(2) : '0.00'}</span>
            </div>
          </div>
          <Button>
            <Link href={`/dashboard/reviews/${spot.owner_id}`} className="text-white font-bold">See Host's Reviews</Link>
          </Button>
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
      <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
        <DialogContent className="max-w-2xl flex flex-col items-center">
          {signedImages && signedImages.length > 0 && (
            <div className="relative w-full flex flex-col items-center">
              <Image
                src={signedImages[zoomIdx].signedUrl || ''}
                alt={spot.title + ` zoomed image ${zoomIdx + 1}`}
                width={600}
                height={400}
                className="object-contain rounded max-h-[70vh] bg-black"
                priority
              />
              {signedImages.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between pointer-events-none">
                  <button
                    type="button"
                    aria-label="Previous image"
                    className="pointer-events-auto bg-white/80 hover:bg-white text-black rounded-full p-2 m-2 focus:outline-none"
                    onClick={() => setZoomIdx((zoomIdx - 1 + signedImages.length) % signedImages.length)}
                  >
                    &#8592;
                  </button>
                  <button
                    type="button"
                    aria-label="Next image"
                    className="pointer-events-auto bg-white/80 hover:bg-white text-black rounded-full p-2 m-2 focus:outline-none"
                    onClick={() => setZoomIdx((zoomIdx + 1) % signedImages.length)}
                  >
                    &#8594;
                  </button>
                </div>
              )}
              <div className="mt-2 text-sm text-gray-700">
                Image {zoomIdx + 1} of {signedImages.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ListingsCard;
