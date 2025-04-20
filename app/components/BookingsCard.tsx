"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "./ui/card";
import { Calendar, MapPin, CreditCard } from "lucide-react";

export type BookingsCardProps = {
  booking: {
    id: string;
    booking_date: string;
    status?: string;
    total_price?: number;
    spot: {
      title: string;
      address?: string;
      city?: string;
      state?: string;
      price_per_day?: number;
      zip_code?: string;
      type?: string;
      spaces_available?: number | null;
      description?: string | null;
    };
  };
  signedImages?: { signedUrl: string | null; is_primary: boolean | null }[];
  onViewDetails?: () => void;
  onCancel?: () => void;
};

const BookingsCard: React.FC<BookingsCardProps> = ({
  booking,
  signedImages = [],
  onViewDetails,
  onCancel,
}) => {
  const { spot } = booking;

  return (
    <Link href={`/dashboard/bookings/${booking.id}`} className="block group">
      <Card className="mb-4 group-hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center gap-4">
          {signedImages && signedImages.length > 0 && signedImages[0].signedUrl ? (
            <Image
              src={
                signedImages.find((img) => img.is_primary)?.signedUrl || signedImages[0].signedUrl!
              }
              alt={spot.title}
              width={80}
              height={80}
              className="rounded object-cover"
            />
          ) : (
            <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-gray-400">
              <MapPin className="w-8 h-8" />
            </div>
          )}
          <div>
            <CardTitle className="text-lg">{spot.title}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {spot.address || `${spot.city}, ${spot.state}`}
            </CardDescription>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {new Date(booking.booking_date).toLocaleDateString()}
              <CreditCard className="w-4 h-4 ml-4" />
              ${spot.price_per_day?.toFixed(2) || "0.00"}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground mb-1">
            <span className="font-medium">Address:</span> {spot.address}, {spot.city}, {spot.state} {spot.zip_code}
          </div>
          <div className="text-sm text-muted-foreground mb-1">
            <span className="font-medium">Type:</span> {spot.type} | <span className="font-medium">Spaces:</span> {spot.spaces_available ?? 'N/A'}
          </div>
          {spot.description && (
            <div className="text-xs text-gray-500 mb-1">
              <span className="font-medium">Description:</span> {spot.description}
            </div>
          )}
          {booking.status && (
            <div className="mt-2 text-xs text-gray-500">
              Status: <span className="font-semibold">{booking.status}</span>
            </div>
          )}
          {booking.total_price !== undefined && (
            <div className="mt-2 text-xs text-gray-500">
              Total Paid: <span className="font-semibold">${booking.total_price?.toFixed(2)}</span>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex gap-2">
          {onViewDetails && (
            <button className="px-3 py-1 border rounded text-sm" onClick={onViewDetails} onClickCapture={e => e.stopPropagation()}>
              View Details
            </button>
          )}
          {onCancel && (
            <button className="px-3 py-1 border rounded text-sm text-red-600 border-red-400" onClick={onCancel} onClickCapture={e => e.stopPropagation()}>
              Cancel
            </button>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
};

export default BookingsCard;
