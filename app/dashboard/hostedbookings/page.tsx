import { db } from "@/utils/supabase/client";
import BookingsCard from "@/app/components/BookingsCard";
import { currentUser } from "@clerk/nextjs/server";

export default async function HostedBookingsPage() {
  const user = await currentUser();
  if (!user) return <div>Sign in to view your bookings.</div>;

  // Fetch bookings for spots owned by the current user, with spot, primary image, and amenities
  const { data: bookings, error } = await db
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
    .gte("booking_date", new Date().toISOString())
    .order("booking_date", { ascending: true })
    .limit(6);

  if (error) return <div className="text-red-500 mb-4">{error.message}</div>;
  if (!bookings || bookings.length === 0) {
    return (
      <div className="p-5 min-h-screen flex flex-col items-center text-white">
        No bookings found.
      </div>
    );
  }

  // Only include bookings where the spot is owned by the current user
  const mappedBookings = bookings
    .filter((b: any) => b.parking_spot && b.parking_spot.owner_id === user.id)
    .map((b: any) => {
      const spot = b.parking_spot;
      const images = Array.isArray(spot.parking_spot_images)
        ? spot.parking_spot_images
        : [];
      const primaryImage =
        images.find((img: any) => img.is_primary) || images[0] || null;
      const amenities = (spot.parking_spot_amenities || [])
        .map((a: any) => a.amenities?.name)
        .filter(Boolean);
      return {
        ...b,
        spot: {
          ...spot,
          primaryImage,
          amenities,
        },
      };
    });

  return (
    <div className="p-5 min-h-screen flex flex-col items-center">
      <div className="w-full flex justify-between mb-5 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold ">Your Bookings</h1>
      </div>
      <div className="w-full max-w-7xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-start ">
        {mappedBookings.map((booking: any) => (
          <BookingsCard
            key={booking.id}
            booking={booking}
            isHost={true}
            isList={true}
          />
        ))}
      </div>
    </div>
  );
}
