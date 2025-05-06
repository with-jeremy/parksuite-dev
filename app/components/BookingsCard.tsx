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
    };
  };
  signedImages?: { signedUrl: string | null; is_primary: boolean | null }[];
  detailView?: boolean;
  isHost?: boolean;
};

const BookingsCard: React.FC<BookingsCardProps> = ({
  booking,
  signedImages,
  detailView,
  isHost,
}) => {
  const { spot } = booking;
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomIdx, setZoomIdx] = useState(0);

  React.useEffect(() => {
    if (!zoomOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setZoomIdx((prev) => (prev + 1) % (signedImages?.length || 1));
      } else if (e.key === "ArrowLeft") {
        setZoomIdx(
          (prev) =>
            (prev - 1 + (signedImages?.length || 1)) %
            (signedImages?.length || 1)
        );
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [zoomOpen, signedImages?.length]);

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

  return (
    <>
      <Card className="w-full m-auto md:max-w-7xl mb-6 overflow-hidden border-2 shadow-md">
        <CardHeader className="pt-4 pb-3 px-6 bg-gradient-to-r from-blue-50 to-white">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-bold text-blue-800">
                {detailView ? (
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
            <Badge
              variant="outline"
              className="bg-blue-100 text-blue-800 border-blue-200 font-medium"
            >
              Parking Spot
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="px-6 py-4">
          {/* Display images with improved carousel */}
          {signedImages && signedImages.length > 0 ? (
            <div className="mb-5 overflow-hidden">
              <div className="flex gap-2 pb-2 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300">
                {signedImages.map((img, idx) =>
                  img.signedUrl ? (
                    <button
                      key={idx}
                      type="button"
                      aria-label={`View image ${idx + 1} of ${
                        signedImages.length
                      }`}
                      className="focus:outline-none transition-transform hover:scale-[1.02]"
                      onClick={() => {
                        setZoomIdx(idx);
                        setZoomOpen(true);
                      }}
                      style={{ background: "none", border: 0, padding: 0 }}
                    >
                      <Image
                        src={img.signedUrl}
                        alt={spot.title + " image"}
                        className={`h-40 w-56 object-cover rounded-lg shadow-sm ${
                          img.is_primary ? "border-4 border-blue-500" : ""
                        }`}
                        width={224}
                        height={160}
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
            <div className="mb-4 flex items-start">
              <MapPin className="h-5 w-5 text-slate-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-slate-700">{address}</span>
            </div>
          )}

          {/* Parking instructions/description - Important for renters */}
          {spot.description && spot.description.trim() !== "" && (
            <Alert className="mb-4 bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <span className="font-medium block mb-1">
                  Parking Instructions:
                </span>
                {spot.description}
              </AlertDescription>
            </Alert>
          )}

          {/* Price information if available */}
          {spot.price_per_day && (
            <div className="mb-4 p-3 bg-slate-50 rounded-md">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-slate-700">Price:</span>
                <span className="font-bold text-slate-900">
                  ${spot.price_per_day.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Service fee (3%):</span>
                <span className="text-slate-600">
                  ${(spot.price_per_day * 0.03).toFixed(2)}
                </span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between items-center font-medium">
                <span>Total:</span>
                <span>${(spot.price_per_day * 1.03).toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div
            className={`flex ${
              detailView ? "flex-col md:flex-row" : "flex-col"
            } gap-3 mt-4`}
          >
            {detailView ? (
              <Button
                variant="default"
                asChild
                className={`w-full ${detailView ? "md:w-1/4" : ""}`}
              >
                <Link href={`/dashboard/reviews/create/${booking.id}`}>
                  <Info className="h-4 w-4 mr-2" />
                  Leave a Review
                </Link>
              </Button>
            ) : (
              <Button variant="default" asChild className="w-full">
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
                className={`w-full ${
                  detailView ? "md:w-3/4" : ""
                } bg-green-600 hover:bg-green-700 text-white`}
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
      {signedImages && signedImages.length > 0 && (
        <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
          <DialogContent className="max-w-3xl flex flex-col items-center p-1 sm:p-4">
            <div className="relative w-full flex flex-col items-center">
              <Image
                src={signedImages[zoomIdx]?.signedUrl || ""}
                alt={spot.title + ` zoomed image ${zoomIdx + 1}`}
                width={800}
                height={600}
                className="object-contain rounded max-h-[70vh] bg-black"
                priority
              />
              {signedImages.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between pointer-events-none">
                  <button
                    type="button"
                    aria-label="Previous image"
                    className="pointer-events-auto bg-white/80 hover:bg-white text-black rounded-full p-2 m-2 focus:outline-none shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      setZoomIdx(
                        (zoomIdx - 1 + signedImages.length) %
                          signedImages.length
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
                      setZoomIdx((zoomIdx + 1) % signedImages.length);
                    }}
                  >
                    &#8594;
                  </button>
                </div>
              )}
              <div className="mt-2 text-sm text-gray-700 bg-white/80 px-3 py-1 rounded-full">
                Image {zoomIdx + 1} of {signedImages.length}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default BookingsCard;
