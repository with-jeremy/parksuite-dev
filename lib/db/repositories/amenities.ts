import { getServerDb } from "@/utils/supabase/server";
import { Database } from "@/types/supabase";

export type Amenity = Database["public"]["Tables"]["amenities"]["Row"];

// Cache for 1 day (in seconds)
const CACHE_TTL = 86400;
let cachedAmenities: Amenity[] | null = null;
let cacheTimestamp: number | null = null;

export async function getAmenities(): Promise<Amenity[]> {
  const now = Date.now();
  if (cachedAmenities && cacheTimestamp && now - cacheTimestamp < CACHE_TTL * 1000) {
    return cachedAmenities;
  }
  const db = await getServerDb();
  const { data, error } = await db
    .from("amenities")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw error;
  cachedAmenities = data || [];
  cacheTimestamp = now;
  return cachedAmenities;
}
