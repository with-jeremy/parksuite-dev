"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { db } from '@/lib/supabaseClient';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/supabase';
import BookingsCard from "@/app/components/BookingsCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/app/components/ui/card";

export default function BookingsDashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [bookings, setBookings] = useState<any[]>([]);
  const [bookingsWithImages, setBookingsWithImages] = useState<any[]>([]);
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
        const bookingsWithSpotInfo = (data || []).map((booking) => ({
          ...booking,
          spot: booking.parking_spot,
        }));
        setBookings(bookingsWithSpotInfo);
        
        // Fetch images for each booking's parking spot
        const supabaseAdmin = createClient<Database>(
          process.env.NEXT_PUBLIC_SUPABASE_URL || '', 
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
        );
        
        const bookingsWithImagesPromises = bookingsWithSpotInfo.map(async (booking) => {
          const { data: images } = await db
            .from("parking_spot_images")
            .select("image_url, is_primary")
            .eq("parking_spot_id", booking.spot.id);
          
          let signedImages = [];
          if (images && images.length > 0) {
            signedImages = await Promise.all(images.map(async (img) => {
              const { data } = await supabaseAdmin.storage
                .from('parking-spot-images')
                .createSignedUrl(img.image_url.replace(/^.*parking-spot-images\//, ''), 60 * 60);
              return { signedUrl: data?.signedUrl || null, is_primary: img.is_primary };
            }));
          }
          
          return {
            ...booking,
            signedImages,
          };
        });
        
        const resolvedBookingsWithImages = await Promise.all(bookingsWithImagesPromises);
        setBookingsWithImages(resolvedBookingsWithImages);
        setLoading(false);
      });
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn || !user) return <div>Sign in to view your bookings.</div>;

  return (
    <div className="p-5 min-h-screen flex flex-col items-center">
      <div className="w-full flex justify-between mb-5 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold ">Your Bookings</h1>
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading ? (
        <div className="text-white">Loading bookings...</div>
      ) : bookingsWithImages.length === 0 ? (
        <div className="text-white">No bookings found.</div>
      ) : (
        <div className="w-full max-w-7xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {bookingsWithImages.map((booking) => (
            <BookingsCard 
              key={booking.id} 
              booking={booking} 
              signedImages={booking.signedImages}
            />
          ))}
        </div>
      )}
    </div>
  );
}
