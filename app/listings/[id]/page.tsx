import { cookies } from "next/headers";
import { db } from "@/utils/supabase/client";
import ListingsCard from "@/app/components/ListingsCard";
import Link from "next/link";

export default async function ParkingSpotDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch parking spot details, images, and amenities in one query
  const { data: spot, error: spotError } = await db
    .from("parking_spots")
    .select(
      "*, parking_spot_images(image_url, is_primary), parking_spot_amenities(amenities(name))"
    )
    .eq("id", id)
    .single();

  if (spotError || !spot) {
    return (
      <div className="p-4 text-red-500">
        Error fetching parking spot: {spotError?.message || "Not found"}
      </div>
    );
  }

  // Standardized breadcrumb placement and styling
  return (
    <div className="flex flex-col max-w-xl mx-auto items-center justify-center my-4 px-6">
      <nav className="w-full text-sm mb-4" aria-label="Breadcrumb">
        <ol className="flex flex-wrap gap-1 text-gray-500">
          <li>
            <Link href="/" className="hover:underline text-gray-600">
              Home
            </Link>
            <span className="mx-1">/</span>
          </li>
          <li>
            <Link href="/listings" className="hover:underline text-gray-600">
              Listings
            </Link>
            <span className="mx-1">/</span>
          </li>
          <li
            className="text-gray-900 font-medium truncate max-w-[120px]"
            title={spot?.title || id}
          >
            {spot?.title || id}
          </li>
        </ol>
      </nav>
      <div className="m-auto w-full max-w-2xl mb-4">
        <ListingsCard spot={spot} isList={false} />
      </div>
    </div>
  );
}
