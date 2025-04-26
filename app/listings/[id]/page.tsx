import { cookies } from 'next/headers';
import { db } from '@/utils/supabase/client';
import ListingsCard from "@/app/components/ListingsCard";

export default async function ParkingSpotDetail({ params }) {
  const { id } = await params;

  // Fetch parking spot details
  const { data: spot, error: spotError } = await db
    .from("parking_spots")
    .select("*")
    .eq("id", id)
    .single();

  if (spotError || !spot) {
    return <div className="p-4 text-red-500">Error fetching parking spot: {spotError?.message || 'Not found'}</div>;
  }

  // Fetch amenities (join through parking_spot_amenities)
  const { data: amenities } = await db
    .from("parking_spot_amenities")
    .select("amenities(name)")
    .eq("parking_spot_id", id);

  // Fetch images
  const { data: images } = await db
    .from("parking_spot_images")
    .select("image_url, is_primary")
    .eq("parking_spot_id", id);

  // Generate signed URLs for all images
  let signedImages = [];
  if (images && images.length > 0) {
    signedImages = await Promise.all(images.map(async (img) => {
      const { data } = await db.storage
        .from('parking-spot-images')
        .createSignedUrl(img.image_url.replace(/^.*parking-spot-images\//, ''), 60 * 60);
      return { signedUrl: data?.signedUrl || null, is_primary: img.is_primary };
    }));
  }

  return (
    <ListingsCard spot={spot} amenities={amenities} signedImages={signedImages} />
  );
}
