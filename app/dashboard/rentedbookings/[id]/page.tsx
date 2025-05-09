import Link from "next/link";
import { db } from "@/utils/supabase/client";
import BookingsCard from "@/app/components/BookingsCard";
import { Database } from "@/types/supabase";

export default async function RentedBookingsDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch booking details by id with nested parking_spot and related fields
  const { data: booking, error } = await db
    .from("bookings")
    .select(
      `
      id,
      booking_date,
      status,
      total_price,
      user_id,
      parking_spot:parking_spot_id(
        id,
        title,
        address,
        city,
        state,
        description,
        price_per_day,
        spaces_available,
        owner_id,
        parking_spot_images(image_url,is_primary),
        parking_spot_amenities(amenities(name))
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    return <div className="text-red-500 mb-4">{error.message}</div>;
  }
  if (!booking || !booking.parking_spot) {
    return (
      <div className="p-5 min-h-screen flex flex-col items-center text-white">
        No booking found.
      </div>
    );
  }

  // Normalize booking data for BookingsCard
  const spot = booking.parking_spot;
  const images = Array.isArray(spot.parking_spot_images)
    ? spot.parking_spot_images
    : [];
  const primaryImage =
    images.find((img) => img.is_primary) || images[0] || null;
  const parkingSpotAmenities = Array.isArray(spot.parking_spot_amenities)
    ? spot.parking_spot_amenities
    : [];
  const amenities = parkingSpotAmenities
    .map((a) => a.amenities?.name)
    .filter(Boolean);

  const normalizedBooking = {
    ...booking,
    spot: {
      ...spot,
      images,
      amenities,
      parking_spot_amenities: parkingSpotAmenities,
    },
  };

  return (
    <div className="flex flex-col max-w-xl mx-auto items-center justify-center my-4">
      <nav className="w-full text-sm mb-4" aria-label="Breadcrumb">
        <ol className="flex flex-wrap gap-1 text-gray-500">
          <li>
            <Link href="/" className="hover:underline text-gray-600">
              Home
            </Link>
            <span className="mx-1">/</span>
          </li>
          <li>
            <Link
              href="/dashboard/rentedbookings"
              className="hover:underline text-gray-600"
            >
              Rented Bookings
            </Link>
            <span className="mx-1">/</span>
          </li>
          <li
            className="text-gray-900 font-medium truncate max-w-[120px]"
            title={normalizedBooking?.spot?.title || id}
          >
            {normalizedBooking?.spot?.title || id}
          </li>
        </ol>
      </nav>
      <BookingsCard booking={normalizedBooking} isList={false} isHost={false} />
    </div>
  );
}
