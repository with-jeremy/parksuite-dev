import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/utils/supabase/client";
import BookingsCard from "@/app/components/BookingsCard";

export default async function RentedBookingsPage() {
  const user = await currentUser();
  if (!user) return <div>Sign in to view your bookings.</div>;

  // Fetch bookings for the current user, with spot, primary image, and amenities
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
        parking_spot_images(image_url,is_primary),
        parking_spot_amenities(amenities(name))
      )
    `
    )
    .eq("user_id", user.id)
    .gte("booking_date", new Date().toISOString())
    .order("booking_date", { ascending: true })
    .limit(6);

  if (error) return <div className="text-red-500 mb-4">{error.message}</div>;
  if (!bookings || bookings.length === 0) {
    return (
      <div className="p-5 min-h-screen flex flex-col items-start text-white">
        No bookings found.
      </div>
    );
  }

  // Map bookings to include only the primary image and amenities names
  const mappedBookings = bookings
    .filter((b: any) => b.parking_spot)
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
      <div className="w-full flex flex-row flex-wrap gap-4 max-w-7xl mx-auto items-start justify-center sm:justify-between @container/isListWrap">
        {mappedBookings.map((booking: any) => (
          <BookingsCard
            key={booking.id}
            booking={booking}
            isHost={false}
            isList={true}
          />
        ))}
      </div>
    </div>
  );
}
