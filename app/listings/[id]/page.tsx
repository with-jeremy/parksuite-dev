import { parkingSpotRepository } from "@/lib/db";
import ListingsCard from "@/app/components/ListingsCard";
import Link from "next/link";

export default async function ParkingSpotDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const spot = await parkingSpotRepository.getById(id);

  if (!spot) {
    return (
      <div className="p-4 text-red-500">
        Error fetching parking spot: Not found
      </div>
    );
  }

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
