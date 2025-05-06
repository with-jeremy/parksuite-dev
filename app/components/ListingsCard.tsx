"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import BookingForm from "./BookingForm";
import { Button } from "@/app/components/ui/button";
import { Dialog, DialogContent } from "./ui/dialog";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { MapPin } from "lucide-react";

interface ListingsCardProps {
  spot: any;
  isList?: boolean;
}

const ListingsCard: React.FC<ListingsCardProps> = ({ spot, isList }) => {
  const [showBooking, setShowBooking] = useState(false);
  const [uiMessage, setUiMessage] = useState<string | null>(null);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomIdx, setZoomIdx] = useState(0);
  const { isSignedIn, user } = useUser();
  const router = useRouter();

  // Use images from spot.parking_spot_images
  const images = Array.isArray(spot.parking_spot_images)
    ? spot.parking_spot_images
    : [];
  // Prefer primary image if it exists, otherwise show all (up to 3)
  // Refactor: if isList, only show primaryImage; else show up to 3 images
  const primaryImage = images.find((img) => img.is_primary);

  // --- Amenities extraction, step by step ---
  // Step 1: Get the array of parking_spot_amenities
  const spotAmenities = Array.isArray(spot.parking_spot_amenities)
    ? spot.parking_spot_amenities
    : [];
  // Step 2: For each, get the amenities object
  const amenitiesObjects = spotAmenities.map((a: any) => a.amenities);
  // Step 3: For each amenities object, get the name
  const amenities = amenitiesObjects
    .filter((a: any) => a && a.name)
    .map((a: any) => a.name);

  // --- Image zoom keyboard navigation ---
  useEffect(() => {
    if (!zoomOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setZoomIdx((prev) => (prev + 1) % (images.length || 1));
      } else if (e.key === "ArrowLeft") {
        setZoomIdx(
          (prev) => (prev - 1 + (images.length || 1)) % (images.length || 1)
        );
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [zoomOpen, images.length]);

  const handleBookNow = () => {
    console.log("Book Now clicked");

    // Check if user is signed in
    if (!isSignedIn) {
      setUiMessage("Please sign in to book this spot");
      setTimeout(() => {
        router.push("/sign-in");
      }, 1500);
      return;
    }

    setUiMessage("Opening booking modal...");
    setShowBooking(true);
    setTimeout(() => setUiMessage(null), 2000);
  };

  // Unified card content
  const cardContent = (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      {isList ? (
        <div className="aspect-video relative overflow-hidden flex items-center justify-center">
          <Image
            src={primaryImage?.image_url || "/file.svg"}
            alt={spot.title}
            width={600}
            height={400}
            className="object-contain transition-transform group-hover:scale-105"
            priority
          />
        </div>
      ) : (
        <div className="w-full flex flex-row md:flex-row gap-2">
          {images.slice(0, 3).map(
            (img, idx) =>
              img?.image_url && (
                <button
                  key={idx}
                  type="button"
                  aria-label={`View image ${idx + 1} of ${images.length}`}
                  className="focus:outline-none transition-transform hover:scale-[1.02] flex-1 relative overflow-hidden flex items-center justify-center"
                  onClick={() => {
                    setZoomIdx(idx);
                    setZoomOpen(true);
                  }}
                  style={{ background: "none", border: 0, padding: 0 }}
                >
                  <Image
                    src={img.image_url}
                    alt={spot.title}
                    width={300}
                    height={200}
                    className="object-contain transition-transform group-hover:scale-105"
                    priority
                  />
                </button>
              )
          )}
        </div>
      )}
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg truncate">{spot.title}</h3>
        </div>
        <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>
            {spot.city}, {spot.state}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <p className="font-semibold">
            ${spot.price_per_day}
            <span className="text-sm font-normal text-muted-foreground">
              {" "}
              / day
            </span>
          </p>
          <Badge variant={spot.spaces_available > 0 ? "default" : "secondary"}>
            {spot.spaces_available > 0 ? "Available" : "Unavailable"}
          </Badge>
        </div>
        {spot.description && (
          <div className="mt-2 text-sm text-gray-800">{spot.description}</div>
        )}

        {/* Amenities pill list */}
        <div className="mt-2 flex flex-wrap gap-2">
          {amenities.map((name: string, idx: number) => (
            <Badge key={idx} variant="outline" className="text-sm">
              {name}
            </Badge>
          ))}
        </div>
        {!isList && (
          <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-2 text-sm text-muted-foreground">
            <div className="flex w-full max-w-xs items-center gap-1">
              <Button className="w-full">
                <Link
                  href={`/dashboard/reviews/${spot.owner_id}`}
                  className="text-white font-bold w-full block text-center"
                >
                  See Host's Reviews
                </Link>
              </Button>
            </div>
            <div className="flex w-full max-w-xs items-center gap-1">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded shadow"
                onClick={handleBookNow}
              >
                Book Now
              </Button>
            </div>
          </div>
        )}
        {showBooking && (
          <BookingForm
            spot={spot}
            onClose={() => {
              console.log("Booking modal closed");
              setUiMessage("Closed booking modal.");
              setShowBooking(false);
              setTimeout(() => setUiMessage(null), 2000);
            }}
          />
        )}
        {uiMessage && (
          <div className="mt-4 p-2 bg-yellow-100 text-yellow-800 rounded text-center">
            {uiMessage}
          </div>
        )}
      </CardContent>
      {/* Image zoom dialog */}
      {images && images.length > 0 && !isList && (
        <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
          <DialogContent className="max-w-3xl flex flex-col items-center p-1 sm:p-4">
            <div className="relative w-full flex flex-col items-center">
              <Image
                src={images[zoomIdx]?.image_url || ""}
                alt={spot.title + ` zoomed image ${zoomIdx + 1}`}
                width={800}
                height={600}
                className="object-contain rounded max-h-[70vh] bg-black"
                priority
              />
              {images.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between pointer-events-none">
                  <button
                    type="button"
                    aria-label="Previous image"
                    className="pointer-events-auto bg-white/80 hover:bg-white text-black rounded-full p-2 m-2 focus:outline-none shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      setZoomIdx((zoomIdx - 1 + images.length) % images.length);
                    }}
                  >
                    &#8592;
                  </button>
                  <button
                    type="button"
                    aria-label="Next image"
                    className="pointer-events-auto bg-white/80 hover:bg-white text-black rounded-full p-2 m-2 focus:outline-none shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      setZoomIdx((zoomIdx + 1) % images.length);
                    }}
                  >
                    &#8594;
                  </button>
                </div>
              )}
              <div className="mt-2 text-sm text-gray-700 bg-white/80 px-3 py-1 rounded-full">
                Image {zoomIdx + 1} of {images.length}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );

  // Only wrap in Link if isList, otherwise render card directly
  return isList ? (
    <Link href={`/listings/${spot.id}`} className="group block">
      {cardContent}
    </Link>
  ) : (
    cardContent
  );
};

export default ListingsCard;
