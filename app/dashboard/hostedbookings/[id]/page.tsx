import { db } from "@/utils/supabase/client";
import BookingsCard from "@/app/components/BookingsCard";
import { Database } from "@/types/supabase";
import Link from "next/link";

export default async function HostedBookingsDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch parking spot details
  const { data: booking, error: bookingError } = await db
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
        parking_spot_images(image_url,is_primary),
        parking_spot_amenities(amenities(name))
      )
    `
    )
    .eq("id", id)
    .single();

  if (bookingError || !booking) {
    return (
      <div className="p-4 text-red-500">
        Error fetching booking: {bookingError?.message || "Not found"}
      </div>
    );
  }

  const spot = booking.parking_spot;
  const images = Array.isArray(spot.parking_spot_images)
    ? spot.parking_spot_images
    : [];
  const primaryImage =
    images.find((img: any) => img.is_primary) || images[0] || null;
  // Defensive: ensure amenities and parking_spot_amenities are arrays
  const parkingSpotAmenities = Array.isArray(spot.parking_spot_amenities)
    ? spot.parking_spot_amenities
    : [];
  const amenities = parkingSpotAmenities
    .map((a: any) => a.amenities?.name ?? "")
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
              href="/dashboard/hostedbookings"
              className="hover:underline text-gray-600"
            >
              Hosted Bookings
            </Link>
            <span className="mx-1">/</span>
          </li>
          <li
            className="text-gray-900 font-medium truncate max-w-[120px]"
            title={spot?.title || id}
          >
            {spot?.title || id}
          </li>
        </ol>
      </nav>
      <BookingsCard booking={normalizedBooking} isList={false} isHost={true} />
    </div>
  );
}
