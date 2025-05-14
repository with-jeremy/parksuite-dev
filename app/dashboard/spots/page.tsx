import { currentUser } from '@clerk/nextjs/server'
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { getServerDb } from "@/utils/supabase/server";
import { ParkingSpot, parkingSpotRepository } from "@/lib/db/repositories/parking-spots";
import ListingsCard from "@/app/components/ListingsCard";

// Get spots owned by current user
async function getSpotsByOwner(ownerId: string): Promise<ParkingSpot[]> {
  const db = await getServerDb();
  const { data, error } = await db
    .from("parking_spots")
    .select(
      "*, parking_spot_images(image_url, is_primary), parking_spot_amenities(amenities(name))"
    )
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching owner's parking spots:", error.message);
    return [];
  }

  return data as ParkingSpot[];
}

export default async function SpotsDashboard() {

  // Get the current user
  const user = await currentUser();
  
  if (!user) {
    return (
      <div className="p-5 flex flex-col items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Sign in to view your parking spots</h1>
          <Link href="/sign-in">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const spots = await getSpotsByOwner(user.id);

  return (
    <div className="p-5 min-h-screen flex flex-col items-center">
      <div className="w-full flex justify-between mb-5 max-w-7xl">
        <h1 className="text-3xl font-bold">Your Parking Spots</h1>
      </div>
      
      {spots.length === 0 ? (
        <div className="text-center p-8 bg-white rounded-lg shadow-md w-full max-w-4xl">
          <p className="text-lg mb-4">You haven't added any parking spots yet.</p>
          <Link href="/dashboard/spots/create">
            <Button className="bg-primary hover:bg-primary-dark">
              {spots.length === 0 ? "Add Your First Spot" : "Add a Spot"}
            </Button>
          </Link>
        </div>
      ) : (
        <div className="w-full max-w-7xl grid gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {spots.map((spot) => (
              // Card container: Added shadow, rounded-lg, overflow-hidden. Kept flex flex-col. Adjusted pb-14.
              <div key={spot.id} className="relative bg-white  overflow-hidden flex flex-col pb-14">
                {/* Active/Inactive indicator (no changes) */}
                <div 
                  className={`absolute top-2 right-2 z-10 px-2 py-1 rounded text-xs font-medium shadow-sm ${spot.is_active ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}
                >
                  {spot.is_active ? 'Active' : 'Inactive'}
                </div>
                
                {/* ListingsCard will align to top due to parent's flex flex-col */}
                <ListingsCard 
                  spot={spot} 
                  isList={true} 
                />
             
                {/* Container for the full-width button, positioned 10px up from card bottom */}
                <div className="relative bottom-[10px] left-0 right-0 z-10">
                  <Link href={`/dashboard/spots/${spot.id}`} className="block w-full">
                    <Button className="w-full rounded-t-none rounded-b-lg">
                      Edit
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
