import { db } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";

export default async function ConfirmationPage({ params }) {
  const { id } = params;

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
      <div className="bg-white rounded shadow p-6 mb-4">
        <div className="mb-2">
          <span className="font-semibold">Parking Spot:</span> {spot?.title || "N/A"}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Address:</span> {spot?.address || `${spot?.city}, ${spot?.state}` || "N/A"}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Date:</span> {new Date(booking.booking_date).toLocaleDateString()}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Price per Day:</span> ${booking.price_per_day?.toFixed(2)}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Service Fee:</span> ${booking.service_fee?.toFixed(2)}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Total Paid:</span> ${booking.total_price?.toFixed(2)}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Status:</span> {booking.status}
        </div>
      </div>
      <p className="text-gray-500">A confirmation email will be sent to you shortly.</p>
    </div>
  );
}