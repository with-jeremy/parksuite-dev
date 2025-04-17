import { db } from "@/lib/supabaseClient";
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/supabase';
import ListingsCard from "@/app/components/ListingsCard";

export default async function ParkingSpotDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Fetch parking spot details
  const { data: spot, error: spotError } = await db
    .from("parking_spots")
    .select("*")
    .eq("id", id)
    .single();

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
  const supabaseAdmin = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');
  let signedImages: { signedUrl: string | null, is_primary: boolean | null }[] = [];
  if (images && images.length > 0) {
    signedImages = await Promise.all(images.map(async (img: any) => {
      const { data } = await supabaseAdmin.storage
        .from('parking-spot-images')
        .createSignedUrl(img.image_url.replace(/^.*parking-spot-images\//, ''), 60 * 60);
      return { signedUrl: data?.signedUrl || null, is_primary: img.is_primary };
    }));
  }

  if (spotError) {
    return <div className="p-4 text-red-500">Error fetching parking spot: {spotError.message}</div>;
  }
  if (!spot) {
    return <div className="p-4">Loading parking spot...</div>;
  }

  return (
    <ListingsCard spot={spot} amenities={amenities} signedImages={signedImages} />
  );
}
