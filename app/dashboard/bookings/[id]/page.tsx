"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { db } from "@/lib/supabaseClient";
import BookingsCard from "@/app/components/BookingsCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/app/components/ui/card";

export default function BookingDetailPage() {
  const { id } = useParams();
  const { isLoaded, isSignedIn, user } = useUser();
  const [booking, setBooking] = useState(null);
  const [signedImages, setSignedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user || !id) return;
    setLoading(true);
    setError(null);
    db.from("bookings")
      .select("id, booking_date, status, total_price, parking_spot:parking_spot_id(*), user_id")
      .eq("id", id)
      .single()
      .then(async ({ data, error }) => {
        if (error || !data) {
          setError("Booking does not exist.");
          setLoading(false);
          return;
        }
        setBooking(data);
        if (data.parking_spot?.id) {
          const { data: images = [] } = await db
            .from("parking_spot_images")
            .select("signedUrl:image_url, is_primary")
            .eq("parking_spot_id", data.parking_spot.id);
          setSignedImages(images);
        }
        setLoading(false);
      });
  }, [isLoaded, isSignedIn, user, id]);

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn || !user) return <div className="p-8 text-center">Please sign in to view this booking.</div>;
  if (loading) return <div className="p-8 text-center">Loading booking...</div>;
  if (error || !booking) return <div className="p-8 text-center">{error || "Booking does not exist."}</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Booking Details</CardTitle>
        </CardHeader>
        <CardContent>
          <BookingsCard
            booking={{
              ...booking,
              spot: booking.parking_spot
            }}
            signedImages={signedImages}
          />
        </CardContent>
      </Card>
    </div>
  );
}
