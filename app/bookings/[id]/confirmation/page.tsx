import { db } from "@/utils/supabase/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from '@/app/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';

export default async function ConfirmationPage({ params }) {
  const { id } = await params;

  // Fetch booking details
  const { data: booking, error } = await db
    .from("bookings")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !booking) {
    notFound();
  }

  // Fetch parking spot details
  const { data: spot } = await db
    .from("parking_spots")
    .select("title, address, city, state")
    .eq("id", booking.parking_spot_id)
    .single();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center' }}>
      <h1 className="text-2xl font-bold mb-2">Booking Confirmed!</h1>
      <p className="mb-4">Thank you for your booking. Here are your details:</p>
      <Card className="w-full max-w-md mb-4">
        <CardHeader>
          <CardTitle className="text-xl">{spot?.title || "N/A"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <span className="font-semibold">Address:</span> {spot?.address || `${spot?.city}, ${spot?.state}` || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Date:</span> {new Date(booking.booking_date).toLocaleDateString()}
          </div>
          <div>
            <span className="font-semibold">Price per Day:</span> ${booking.price_per_day?.toFixed(2)}
          </div>
          <div>
            <span className="font-semibold">Service Fee:</span> ${booking.service_fee?.toFixed(2)}
          </div>
          <div>
            <span className="font-semibold">Total Paid:</span> ${booking.total_price?.toFixed(2)}
          </div>
          <div>
            <span className="font-semibold">Status:</span> {booking.status}
          </div>
        </CardContent>
      </Card>
      <Button>
        <Link href="/listings">Back to Listings</Link>
      </Button>
      <Button asChild variant="secondary" className="mt-2">
        <Link href="/dashboard">
          Dashboard
        </Link>
      </Button>
    </div>
  );
}