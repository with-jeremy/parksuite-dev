"use client";
import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Calendar, MapPin } from "lucide-react";

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
    };
  };
};

const BookingsCard: React.FC<BookingsCardProps> = ({ booking }) => {
  const { spot } = booking;
  return (
    <Card className="mb-4 overflow-hidden">
      <CardHeader className="pt-4 pb-2 px-4">
        <CardTitle className="text-lg">
          <Link
            href={`/listings/${booking.spot.id}`}
            className="text-blue-600 underline hover:text-blue-800"
          >
            {spot.title}
          </Link>
        </CardTitle>
        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          {new Date(booking.booking_date).toLocaleDateString()}
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-2">
        {(spot.address || spot.city || spot.state) && (
          <div className="mb-2 text-sm text-gray-700">
            {[spot.address, spot.city, spot.state].filter(Boolean).join(", ")}
          </div>
        )}
        <div className="flex gap-2 mt-2">
          <Link
            href={`/listings/${booking.spot.id}`}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            See Listing Details
          </Link>
          <button
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            onClick={() => {
              const address = [booking.spot.address, booking.spot.city, booking.spot.state].filter(Boolean).join(", ");
              if (address) {
                const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
                window.open(url, '_blank');
              } else {
                alert('No address available for directions.');
              }
            }}
            type="button"
          >
            Get Directions
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingsCard;
