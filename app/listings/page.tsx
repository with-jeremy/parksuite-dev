import { Suspense } from 'react';
import ListingsClientWrapper from '@/app/listings/ListingsClientWrapper';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { getAmenities } from '@/lib/db/repositories/amenities';
import { parkingSpotRepository } from "@/lib/db/repositories/parking-spots";
import GoogleMapsProvider from "@/app/components/GoogleMapsProvider";

// Revalidate amenities once per day
export const revalidate = 86400;

export default async function ListingsPage() {
  
  // Fetch amenities (cached)
  const amenities = await getAmenities();

  // Fetch active parking spots
  const spots = await parkingSpotRepository.getActive();

  return (
    <GoogleMapsProvider>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Available Parking Spots</h1>

        <Suspense fallback={<LoadingSpinner />}>
          <ListingsClientWrapper 
            amenities={amenities} 
            spots={spots} 
          />
        </Suspense>
        
      </main>
    </GoogleMapsProvider>
  );
}
