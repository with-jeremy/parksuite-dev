"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { db } from '@/lib/supabaseClient';
import BookingsCard from "@/app/components/BookingsCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/app/components/ui/card";

export default function BookingsDashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;
    setLoading(true);
    db.from("bookings")
      .select("id, booking_date, status, total_price, parking_spot:parking_spot_id(*), user_id")
      .eq("user_id", user.id)
      .gte("booking_date", new Date().toISOString())
      .order("booking_date", { ascending: true })
      .limit(6)
      .then(async ({ data, error }) => {
        if (error) {
          setError(error.message);
          setLoading(false);
          return;
        }
        const bookingsWithImages = await Promise.all((data || []).map(async (booking) => {
          let signedImages = [];
          if (booking.parking_spot?.id) {
            const { data: images = [] } = await db
              .from("parking_spot_images")
              .select("signedUrl:image_url, is_primary")
              .eq("parking_spot_id", booking.parking_spot.id);
            signedImages = images;
          }
          return {
            ...booking,
            spot: booking.parking_spot,
            signedImages,
          };
        }));
        setBookings(bookingsWithImages);
        setLoading(false);
      });
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn || !user) return <div>Sign in to view your bookings.</div>;

  return (
    <div className="p-5 min-h-screen flex flex-col items-center">
      <div className="w-full flex justify-between mb-5 max-w-2xl">
        <h1 className="text-3xl font-bold ">Your Bookings</h1>
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading ? (
        <div className="text-white">Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="text-white">No bookings found.</div>
      ) : (
        <div className="w-full max-w-2xl space-y-4">
          {bookings.map((booking) => (
            <BookingsCard key={booking.id} booking={booking} signedImages={booking.signedImages} />
          ))}
        </div>
      )}
    </div>
  );
}
