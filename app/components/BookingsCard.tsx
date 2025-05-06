"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Calendar, MapPin, ImageOff, Info, Navigation } from "lucide-react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

export type BookingsCardProps = {
  booking: {
    id: string;
    booking_date: string;
    spot: {
      id: string;
      title: string;
      address?: string;
      city?: string;
      state?: string;
      description?: string;
      price_per_day?: number;
      primaryImage?: { image_url: string; is_primary?: boolean } | null;
      images?: { image_url: string; is_primary?: boolean }[];
      amenities?: string[];
      parking_spot_amenities?: { amenities: { name: string } }[];
    };
  };
  isList?: boolean;
  isHost?: boolean;
};

const BookingsCard: React.FC<BookingsCardProps> = ({
  booking,
  isList,
  isHost,
}) => {
  const { spot } = booking;
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
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomIdx, setZoomIdx] = useState(0);

  // Determine which images to show
  let displayImages: { image_url: string; is_primary?: boolean }[] = [];
  if (isList) {
    if (spot.primaryImage) {
      displayImages = [spot.primaryImage];
    }
  } else if (Array.isArray(spot.images)) {
    displayImages = spot.images;
  }

  React.useEffect(() => {
    if (!zoomOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setZoomIdx((prev) => (prev + 1) % (displayImages?.length || 1));
      } else if (e.key === "ArrowLeft") {
        setZoomIdx(
          (prev) =>
            (prev - 1 + (displayImages?.length || 1)) %
            (displayImages?.length || 1)
        );
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [zoomOpen, displayImages?.length]);

  const formattedDate = new Date(booking.booking_date).toLocaleDateString(
    undefined,
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const address = [spot.address, spot.city, spot.state]
    .filter(Boolean)
    .join(", ");

  const cardClassName = isList
    ? "flex-col flex w-72 mb-6 border-2 shrink shadow-md"
    : "flex-col flex mb-6 border-2 shrink shadow-md";

  return (
    <>
      <Card className={cardClassName}>
        <CardHeader className="pt-4 pb-3 px-4 bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-blue-800">
                {!isList ? (
                  spot.title
                ) : (
                  <Link
                    href={
                      isHost
                        ? `/dashboard/hostedbookings/${booking.id}`
                        : `/dashboard/rentedbookings/${booking.id}`
                    }
                    className="hover:text-blue-600 transition-colors"
                  >
                    {spot.title}
                  </Link>
                )}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1 text-sm text-slate-600">
                <Calendar className="w-4 h-4" />
                {formattedDate}
              </div>
            </div>
            {isHost ? (
              <Badge
                variant="outline"
                className="bg-blue-100 text-blue-800 border-blue-200 font-medium text-center"
              >
                Hosted
                <br />
                Booking
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="bg-green-100 text-green-800 border-green-200 font-medium text-center"
              >
                Rented
                <br />
                Booking
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="py-0 px-0">
          {/* Display images with improved carousel */}
          {displayImages && displayImages.length > 0 ? (
            <div className="mb-5 overflow-hidden">
              <div className="flex gap-2 pb-2 overflow-x-auto">
                {displayImages.map((img, idx) =>
                  img.image_url ? (
                    <button
                      key={idx}
                      type="button"
                      aria-label={`View image ${idx + 1} of ${
                        displayImages.length
                      }`}
                      className="focus:outline-none transition-transform hover:scale-[1.02]"
                      onClick={() => {
                        setZoomIdx(idx);
                        setZoomOpen(true);
                      }}
                      style={{ background: "none", border: 0, padding: 0 }}
                    >
                      <Image
                        src={img.image_url}
                        alt={spot.title + " image"}
                        className="h-64 w-80 object-cover shadow-sm"
                        width={320}
                        height={240}
                      />
                    </button>
                  ) : null
                )}
              </div>
            </div>
          ) : (
            <div className="mb-5 h-40 w-full flex items-center justify-center bg-gray-100 rounded-lg text-gray-500">
              <div className="flex flex-col items-center">
                <ImageOff className="h-10 w-10 mb-2" />
                <span className="text-sm font-medium">No Images Available</span>
              </div>
            </div>
          )}

          {/* Location information */}
          {address && (
            <div className="mb-0 px-4 pb-6 flex items-start">
              <MapPin className="h-5 w-5 text-slate-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-slate-700">{address}</span>
            </div>
          )}

          {/* Parking instructions/description - Important for renters */}
          {spot.description && spot.description.trim() !== "" && (
            <div className="mb-0 flex items-start">
              <Alert className="mb-0 bg-amber-50 rounded-none border-amber-200">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  <span className="font-medium block mb-0">
                    Parking Instructions:
                  </span>
                  {spot.description}
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Price information if available */}
          {spot.price_per_day && (
            <div className="mb-0 px-2 py-4 border-t border-slate-200">
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-0 sm:justify-between sm:items-stretch bg-slate-50 rounded-lg overflow-hidden shadow-sm">
                <div className="flex-1 flex flex-col items-center justify-center px-4 py-2 border-b sm:border-b-0 sm:border-r border-slate-200">
                  <span className="text-xs uppercase tracking-wide text-slate-500 mb-1">
                    Price per day
                  </span>
                  <span className="text-lg font-semibold text-blue-800">
                    ${spot.price_per_day.toFixed(2)}
                  </span>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center px-4 py-2 border-b sm:border-b-0 sm:border-r border-slate-200">
                  <span className="text-xs uppercase tracking-wide text-slate-500 mb-1">
                    Service fee
                  </span>
                  <span className="text-lg font-medium text-slate-700">
                    ${(spot.price_per_day * 0.03).toFixed(2)}
                  </span>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center px-4 py-2 bg-gradient-to-r from-green-50 to-white">
                  <span className="text-xs uppercase tracking-wide text-green-700 mb-1 font-bold">
                    Total
                  </span>
                  <span className="text-xl font-bold text-green-800">
                    ${(spot.price_per_day * 1.03).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Amenities pill list */}
          {!isList && (
            <div className="mt-0 mb-3 px-4 flex flex-wrap gap-2">
              {amenities.map((name: string, idx: number) => (
                <Badge key={idx} variant="outline" className="text-sm">
                  {name}
                </Badge>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex bg-slate-100 px-4 py-6 flex-col gap-2">
            {!isList ? (
              <Button variant="default" asChild className="w-full">
                <Link href={`/dashboard/reviews/create/${booking.id}`}>
                  <Info className="h-4 w-4 mr-2" />
                  Leave a Review
                </Link>
              </Button>
            ) : (
              <Button variant="default" asChild className="flex w-full">
                <Link
                  href={
                    isHost
                      ? `/dashboard/hostedbookings/${booking.id}`
                      : `/dashboard/rentedbookings/${booking.id}`
                  }
                >
                  <Info className="h-4 w-4 mr-2" />
                  See Booking Details
                </Link>
              </Button>
            )}

            {!isHost && (
              <Button
                variant="secondary"
                className="w-full flex bg-green-600 hover:bg-green-700 text-white"
                onClick={() => {
                  if (address) {
                    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                      address
                    )}`;
                    window.open(url, "_blank");
                  } else {
                    alert("No address available for directions.");
                  }
                }}
              >
                <Navigation className="h-4 w-4 mr-2" />
                Get Directions
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Image zoom dialog */}
      {displayImages && displayImages.length > 0 && (
        <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
          <DialogContent className="max-w-3xl flex flex-col items-center p-1 sm:p-4">
            <div className="relative w-full flex flex-col items-center">
              <Image
                src={displayImages[zoomIdx]?.image_url || ""}
                alt={spot.title + ` zoomed image ${zoomIdx + 1}`}
                width={800}
                height={600}
                className="object-contain rounded max-h-[70vh] bg-black"
                priority
              />
              {displayImages.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between pointer-events-none">
                  <button
                    type="button"
                    aria-label="Previous image"
                    className="pointer-events-auto bg-white/80 hover:bg-white text-black rounded-full p-2 m-2 focus:outline-none shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      setZoomIdx(
                        (zoomIdx - 1 + displayImages.length) %
                          displayImages.length
                      );
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
                      setZoomIdx((zoomIdx + 1) % displayImages.length);
                    }}
                  >
                    &#8594;
                  </button>
                </div>
              )}
              <div className="mt-2 text-sm text-gray-700 bg-white/80 px-3 py-1 rounded-full">
                Image {zoomIdx + 1} of {displayImages.length}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default BookingsCard;
