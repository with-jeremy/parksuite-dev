// --- Server component for fetching and passing spots ---
import { db } from '@/utils/supabase/client';

import ListingsFilterClient from '../components/ListingsFilterClient';
import { cookies } from 'next/headers';

export default async function ListingsPage() {

  // Get search param from URL
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get('next-url')?.value || '';
  const queryString = cookieValue.split('?')[1] || '';
  const searchParams = new URLSearchParams(queryString);
  const initialSearch = searchParams.get('search') || '';

  // Fetch spots with their images (if any) and amenities
  const { data: spots, error } = await db
    .from('parking_spots')
    .select('*, parking_spot_images(image_url, is_primary), parking_spot_amenities(amenities(id, name))')
    .eq('is_active', true);

  if (error) {
    return <div className="p-8">Error loading parking spots: {error.message}</div>;
  }

  if (!spots) {
    return <div className="p-8">Loading...</div>;
  }

  // Generate signed URLs for the first image of each spot
  const spotsWithSignedUrls = await Promise.all(
    spots.map(async spot => {
      let signedUrl = null;
      if (Array.isArray(spot.parking_spot_images) && spot.parking_spot_images.length > 0) {
        const imagePath = spot.parking_spot_images[0].image_url;
        const { data } = await db.storage
          .from('parking-spot-images')
          .createSignedUrl(imagePath.replace(/^.*parking-spot-images\//, ''), 60 * 60); // 1 hour expiry
        signedUrl = data?.signedUrl || null;
      }
      // Extract amenities as array of { id, name }
      const amenities = (spot.parking_spot_amenities || [])
        .map((a: any) => a.amenities)
        .filter(Boolean);
      return { ...spot, signedUrl, amenities };
    })
  );

  return (
    <ListingsFilterClient spots={spotsWithSignedUrls} initialSearch={initialSearch} />
  );
}