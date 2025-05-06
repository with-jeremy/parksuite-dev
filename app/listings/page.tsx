"use client";
import ListingsCard from "@/app/components/ListingsCard";
import ListingsFilterClient from "../components/ListingsFilterClient";
import { Suspense } from "react";

import { useListings } from "@/hooks/use-listings";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

function ListingsPageContent() {
  const searchParams = useSearchParams();
  const searchParamValue = searchParams.get("search") || "";

  const {
    search,
    setSearch,
    selectedTypes,
    setSelectedTypes,
    selectedAmenities,
    setSelectedAmenities,
    location,
    setLocation,
    locating,
    setLocating,
    locationError,
    setLocationError,
    amenities,
    amenitiesLoading,
    amenitiesError,
    spots,
    spotsLoading,
    spotsError,
  } = useListings(searchParamValue);

  useEffect(() => {
    if (search !== searchParamValue) {
      setSearch(searchParamValue);
    }
  }, [searchParamValue, search, setSearch]);

  if (spotsError) {
    return <div className="p-8">Error loading parking spots.</div>;
  }
  if (spotsLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <section
      id="how-it-works"
      className="w-full py-16 md:py-24 px-4 bg-slate-50"
    >
      <div className="container mx-auto max-w-7xl text-center">
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
            <div className="block mb-4 sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md rounded-lg p-4">
              <ListingsFilterClient
                search={search}
                setSearch={setSearch}
                selectedTypes={selectedTypes}
                setSelectedTypes={setSelectedTypes}
                selectedAmenities={selectedAmenities}
                setSelectedAmenities={setSelectedAmenities}
                location={location}
                setLocation={setLocation}
                locating={locating}
                setLocating={setLocating}
                locationError={locationError}
                setLocationError={setLocationError}
                amenities={amenities}
                amenitiesLoading={amenitiesLoading}
                amenitiesError={amenitiesError}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {spots.length === 0 && (
                <div className="col-span-full text-center text-muted-foreground py-12">
                  No spots found matching your criteria.
                </div>
              )}
              {spots.map((spot) => (
                <ListingsCard key={spot.id} spot={spot} isList={true} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ListingsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ListingsPageContent />
    </Suspense>
  );
}
