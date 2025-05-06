// --- Server component for fetching and passing spots ---
import { db } from "@/utils/supabase/client";
import ListingsCard from "@/app/components/ListingsCard";
import ListingsFilterClient from "../components/ListingsFilterClient";
import { cookies } from "next/headers";

export default async function ListingsPage() {
  // Get search param from URL
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get("next-url")?.value || "";
  const queryString = cookieValue.split("?")[1] || "";
  const searchParams = new URLSearchParams(queryString);
  const initialSearch = searchParams.get("search") || "";

  // Fetch spots with their images (if any)
  const { data: spots, error } = await db
    .from("parking_spots")
    .select(
      "*, parking_spot_images(image_url, is_primary), parking_spot_amenities(amenities(name))"
    )
    .order("created_at", { ascending: false })
    .eq("is_active", true)
    .limit(12);

  if (error) {
    return (
      <div className="p-8">Error loading parking spots: {error.message}</div>
    );
  }

  if (!spots) {
    return <div className="p-8">Loading...</div>;
  }

  // No signedUrl logic, just pass through images and amenities
  return (
    <div className="flex flex-col max-w-7xl m-auto px-8 md:px-6 space-y-8 items-start">
      <div className="flex flex-col space-y-4 text-left">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-gray-900 dark:text-white">
            Find Your Perfect Parking Spot
          </h1>
          <p className="max-w-[600px] text-gray-500 md:text-xl">
            Discover a variety of parking options tailored to your needs.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {spots.map((spot: any) => (
            <ListingsCard key={spot.id} spot={spot} isList={true} />
          ))}
        </div>
      </div>
    </div>
  );
}
