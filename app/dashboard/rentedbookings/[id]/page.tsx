import { db } from "@/lib/supabaseClient";
import BookingsCard from "@/app/components/BookingsCard";
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/supabase';

export default async function RentedBookingsDetail({ params }) {
  const { id } = await params;

  // Fetch parking spot details
  const { data: booking, error: bookingError } = await db
    .from("bookings")
    .select('id, booking_date, parking_spots (id, title, city, state, description, price_per_day, owner_id)')
    .eq("id", id)
    .single();

  if (bookingError || !booking) {
    return <div className="p-4 text-red-500">Error fetching booking: {bookingError?.message || 'Not found'}</div>;
  }

  // Normalize booking data to match BookingsCard expectations
  const normalizedBooking = {
    ...booking,
    spot: booking.parking_spots ? {
      id: booking.parking_spots.id,
      title: booking.parking_spots.title,
      city: booking.parking_spots.city,
      state: booking.parking_spots.state,
      // address is optional and may not exist in this query
      address: booking.parking_spots.address || '',
      description: booking.parking_spots.description || '',
      price_per_day: booking.parking_spots.price_per_day || 0,
      owner_id: booking.parking_spots.owner_id,
    } : undefined,
  };

  // Fetch images for the correct parking spot
  const { data: images } = await db
    .from("parking_spot_images")
    .select("image_url, is_primary")
    .eq("parking_spot_id", booking.parking_spots.id);

  // Generate signed URLs for all images
  const supabaseAdmin = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');
  let signedImages = [];
  if (images && images.length > 0) {
    signedImages = await Promise.all(images.map(async (img) => {
      const { data } = await supabaseAdmin.storage
        .from('parking-spot-images')
        .createSignedUrl(img.image_url.replace(/^.*parking-spot-images\//, ''), 60 * 60);
      return { signedUrl: data?.signedUrl || null, is_primary: img.is_primary };
    }));
  }

  return (
    <BookingsCard booking={normalizedBooking} signedImages={signedImages} detailView={true} />
  );
}
