import { getServerDb } from "@/utils/supabase/server";
import { Database } from "@/types/supabase";

export type ParkingSpot = Database["public"]["Tables"]["parking_spots"]["Row"] & {
  parking_spot_images?: { image_url: string; is_primary: boolean | null }[];
  parking_spot_amenities?: { amenities: { name: string } }[];
};

export const parkingSpotRepository = {

  async getActive(limit = 12): Promise<ParkingSpot[]> {
    const db = await getServerDb();
    const { data, error } = await db
      .from("parking_spots")
      .select(
        "*, parking_spot_images(image_url, is_primary), parking_spot_amenities(amenities(name, id))"
      )
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching parking spots:", error.message);
      return [];
    }

    return data as ParkingSpot[];
  },

  async getById(id: string): Promise<ParkingSpot | null> {
    const db = await getServerDb();
    const { data, error } = await db
      .from("parking_spots")
      .select(
        "*, parking_spot_images(image_url, is_primary), parking_spot_amenities(amenities(name))"
      )
      .eq("id", id)
      .single();

    if (error || !data) {
      console.error("Error fetching parking spot:", error?.message);
      return null;
    }

    return data as ParkingSpot;
  },

   async getByOwnerId(ownerId: string): Promise<ParkingSpot[]> {
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
  },

  async getFeatured(): Promise<ParkingSpot[]> {
    const db = await getServerDb();
    const { data, error } = await db
      .from("parking_spots")
      .select(
        "*, parking_spot_images(image_url, is_primary), parking_spot_amenities(amenities(name))"
      )
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(4);

    if (error) {
      console.error("Error fetching featured spots:", error);
      return [];
    }

    return data as ParkingSpot[];
  },

  async toggleFeatured(id: string, isFeatured: boolean): Promise<boolean> {
    const db = await getServerDb();
    const { error } = await db
      .from("parking_spots")
      .update({ is_featured: isFeatured })
      .eq("id", id);
    
    if (error) {
      console.error("Error updating featured status:", error.message);
      return false;
    }
    
    return true;
  },

  /**
   * Finds the nearest parking spots to a user's location using the Supabase RPC function.
   * Returns ParkingSpot objects, including images and amenities.
   * @param userLat Latitude of the user
   * @param userLng Longitude of the user
   * @param maxDistanceMeters Max search radius in meters (default 5000)
   */
  async findNearest(userLat: number, userLng: number, maxDistanceMeters = 5000): Promise<ParkingSpot[]> {
    const db = await getServerDb();
    
    // First, get the nearest spots with distance info
    const { data: nearestSpots, error } = await db.rpc("find_nearest_parking_spots", {
      user_lat: userLat,
      user_lng: userLng,
      max_results: 12,
      max_distance_meters: maxDistanceMeters,
    });
    
    if (error || !nearestSpots) {
      console.error("Error finding nearest parking spots:", error?.message);
      return [];
    }
    
    // Extract IDs of the nearest spots
    const spotIds = nearestSpots.map(spot => spot.id);
    
    if (spotIds.length === 0) return [];
    
    // Now fetch complete data for these spots including the relations
    const { data: completeSpots, error: fetchError } = await db
      .from("parking_spots")
      .select(
        "*, parking_spot_images(image_url, is_primary), parking_spot_amenities(amenities(name))"
      )
      .in("id", spotIds)
      .order("created_at", { ascending: false });
    
    if (fetchError) {
      console.error("Error fetching complete spot data:", fetchError.message);
      return [];
    }
    
    // Merge distance info from RPC call into the complete spot data
    const spotsWithDistance = completeSpots.map(spot => {
      const nearestInfo = nearestSpots.find(nearest => nearest.id === spot.id);
      return {
        ...spot,
        distance_meters: nearestInfo?.distance_meters
      };
    });
    
    return spotsWithDistance as ParkingSpot[];
  },
  
  // Add other methods as needed (create, update, delete, search, etc.)
};