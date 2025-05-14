"use client";

import { useState, useRef } from "react";
import { AdvancedMarker, Map, APIProvider } from "@vis.gl/react-google-maps";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import ListingsCard from "@/app/components/ListingsCard";

export default function MapsUi({ spots = [], targetLocation = null, generalLocation = null, onClose }) {
  const API_KEY =
    (process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string) ??
    globalThis.GOOGLE_MAPS_API_KEY;

  const [selectedSpot, setSelectedSpot] = useState(null);

  const defaultCenter = targetLocation 
    ? targetLocation 
    : generalLocation
      ? generalLocation
      : spots[0]?.lat && spots[0]?.lng
        ? { lat: Number(spots[0].lat), lng: Number(spots[0].lng) }
        : { lat: 39.8283, lng: -98.5795 };

  const defaultZoom = targetLocation ? 14 : spots.length > 0 ? 12 : 8;

  const handleMarkerClick = (spot) => {
    setSelectedSpot(spot);
  };

  const handleDismissCard = () => {
    setSelectedSpot(null);
  };

  return (
    <div className="fixed top-[72px] left-0 right-0 bottom-0 z-30 flex flex-col bg-white">
      <div className="p-4 flex items-center justify-between border-b bg-white">
        <h2 className="text-xl font-semibold">Parking Spots Map</h2>
        <Button
          variant="ghost" 
          size="icon"
          onClick={onClose}
          className="rounded-full h-10 w-10"
          aria-label="Close map view"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="flex-1 relative">
        {spots.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-lg text-gray-500">No spots found matching your criteria.</p>
          </div>
        ) : (
          <APIProvider apiKey={API_KEY}>
            <Map
              style={{ width: "100%", height: "100%" }}
              defaultCenter={defaultCenter}
              defaultZoom={defaultZoom}
              gestureHandling={"greedy"}
              disableDefaultUI={false}
              mapId="roadmap"
              onClick={handleDismissCard}
            >
              {targetLocation && (
                <AdvancedMarker
                  position={targetLocation}
                  title="Your Location"
                >
                  <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg pulse-animation" />
                </AdvancedMarker>
              )}
              
              {spots.map((spot) => (
                <AdvancedMarker
                  key={spot.id}
                  position={{ 
                    lat: Number(spot.lat), 
                    lng: Number(spot.lng) 
                  }}
                  title={spot.title}
                  onClick={() => {
                    handleMarkerClick(spot);
                  }}
                >
                  <div className={`transition-all duration-300 ${selectedSpot?.id === spot.id ? 'scale-125' : ''}`}>
                    <Image
                      src="/images/parksuite-dropper-logo-web.png"
                      alt={spot.title}
                      width={32}
                      height={32}
                    />
                  </div>
                </AdvancedMarker>
              ))}
            </Map>
            
            {selectedSpot && (
              <div 
                className="absolute bottom-6 left-0 right-0 z-10 flex justify-center items-center transform transition-transform duration-300 animate-slide-up px-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative max-w-md w-full mx-auto rounded-lg overflow-hidden">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleDismissCard}
                    className="absolute right-2 top-2 z-20 rounded-full h-8 w-8 bg-white/90 backdrop-blur-sm shadow-sm"
                    aria-label="Close details"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                  
                  <div className="shadow-xl rounded-lg">
                    <ListingsCard spot={selectedSpot} isList={true} />
                  </div>
                </div>
              </div>
            )}
          </APIProvider>
        )}
      </div>
    </div>
  );
}
