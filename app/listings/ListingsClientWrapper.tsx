"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import ListingsFilter from "@/app/components/ListingsFilter";
import ListingsCard from "@/app/components/ListingsCard";
import { ParkingSpot } from "@/lib/db/repositories/parking-spots";

export default function ListingsClientWrapper({ 
  amenities, 
  initialSearch,
  spots
}) {
  // State management
  const [search, setSearch] = useState(initialSearch);
  const [selectedAmenities, setSelectedAmenities] = useState([]); 
  const [location, setLocation] = useState(null);
  const [view, setView] = useState("list");
  const [filteredSpots, setFilteredSpots] = useState([]);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    // Only update the search param if it's a string
    if (typeof search === "string" && search) params.set("search", search);
    else params.delete("search");

    // Replace URL without forcing navigation
    router.replace(`${pathname}?${params.toString()}`);
  }, [search, router, pathname, searchParams]);
  
  // Filter the spots based on search criteria and selected amenities
  useEffect(() => {
    const filtered = spots.filter(spot => {
      // Filter by search text
      if (search && typeof search === "string") {
        const searchLower = search.toLowerCase();
        const textMatch = 
          spot.title?.toLowerCase().includes(searchLower) ||
          spot.description?.toLowerCase().includes(searchLower) ||
          spot.city?.toLowerCase().includes(searchLower) ||
          spot.state?.toLowerCase().includes(searchLower) ||
          spot.zip_code?.toLowerCase().includes(searchLower);
          
        if (!textMatch) return false;
      }
      
      // Filter by selected amenities if any are selected
      if (selectedAmenities.length > 0) {
        // Get the amenity IDs for this spot
        const spotAmenityIds = (spot.parking_spot_amenities || [])
          .map(psa => psa.amenities?.id)
          .filter(id => id !== undefined);
          
        // Check if the spot has all selected amenities
        const hasAllSelectedAmenities = selectedAmenities.every(
          amenityId => spotAmenityIds.includes(amenityId)
        );
        
        if (!hasAllSelectedAmenities) return false;
      }
      
      // Location filtering could be added here if implemented
      
      return true;
    });

    setFilteredSpots(filtered);
  }, [spots, search, selectedAmenities]);

  return (
    <>
      <ListingsFilter
        search={search}
        setSearch={setSearch}
        selectedAmenities={selectedAmenities}
        setSelectedAmenities={setSelectedAmenities}
        location={location}
        setLocation={setLocation}
        view={view}
        setView={setView}
        amenities={amenities}
        setFilteredSpots={setFilteredSpots}
      />
      <div className="listings-container">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredSpots.map((spot) => (
          <ListingsCard key={spot.id} spot={spot} isList={true} />
        ))}
        </div>
      </div>
    </>
  );
}
