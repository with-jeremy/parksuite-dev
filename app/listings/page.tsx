"use client";
import ListingsCard from "@/app/components/ListingsCard";
import ListingsFilterClient from "../components/ListingsFilterClient";
import { Suspense, useState } from "react";
import { useListings } from "@/hooks/use-listings";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import MapsUi from "../components/MapsUi";
import ListView from "../components/ListView";

function ListingsPageContent() {
  const searchParams = useSearchParams();
  const searchParamValue = searchParams.get("search") || "";

  const [view, setView] = useState("grid");

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
    <section id="how-it-works" className="w-full py-16 md:py-24 bg-slate-50">
      <div className="text-center">
        <div className="flex flex-col m-auto space-y-8 items-start">
          <div className="flex flex-col max-w-7xl m-auto space-y-4 text-left">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-gray-900 dark:text-white">
                Find Your Perfect Parking Spot
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl">
                Discover a variety of parking options tailored to your needs.
              </p>
            </div>
            <div className="block mb-4 sticky top-0 z-50 p-4">
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
                view={view}
                setView={setView}
              />
            </div>
          </div>
          {view === "map" ? (
            <MapsUi spots={spots} />
          ) : view === "list" ? (
            <ListView spots={spots} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl m-auto">
              {spots.map((spot) => (
                <ListingsCard isList={true} key={spot.id} spot={spot} />
              ))}
            </div>
          )}
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
