"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import ListingsFilter from "@/app/components/ListingsFilter";
import ListingsCard from "@/app/components/ListingsCard";
import MapsUi from "@/app/components/MapsUi";
import { getGeneralLocation } from "@/lib/maps/geolocation";
import { findNearestSpots } from "../actions/find-nearest-spots";

export default function ListingsClientWrapper({ 
  amenities, 
  spots
}) {
  // State management
  const [selectedAmenities, setSelectedAmenities] = useState([]); 
  const [location, setLocation] = useState(null);
  const [generalLocation, setGeneralLocation] = useState<{lat: number, lng: number} | null>(null); 
  const [view, setView] = useState("list");
  const [filteredSpots, setFilteredSpots] = useState([]);

  const searchParams = useSearchParams();

  // Get general location on component mount if no location exists
  useEffect(() => {
    async function setGeneralLocationIfNeeded() {
      if (!generalLocation) { // Check if generalLocation is null or undefined
        try {
          const fetchedGeneralLocation = await getGeneralLocation();
          if (fetchedGeneralLocation && typeof fetchedGeneralLocation.lat === 'number' && typeof fetchedGeneralLocation.lng === 'number') {
            setGeneralLocation({
              lat: fetchedGeneralLocation.lat,
              lng: fetchedGeneralLocation.lng
            });
          } else {
            // Fallback or default location if needed, e.g., city center
            // console.warn("General location could not be determined or was invalid.");
            // setGeneralLocation({ lat: 34.0522, lng: -118.2437 }); // Example: Los Angeles
          }
        } catch (error) {
          console.error("Error fetching general location:", error);
          // setGeneralLocation({ lat: 34.0522, lng: -118.2437 }); // Example fallback
        }
      }
    }
    
    setGeneralLocationIfNeeded();
  }, [generalLocation]);
  
  // Get location from URL params if available
  useEffect(() => {
    const latParam = searchParams.get('lat');
    const lngParam = searchParams.get('lng');
    
    if (latParam && lngParam) {
      const lat = parseFloat(latParam);
      const lng = parseFloat(lngParam);
      
      if (!isNaN(lat) && !isNaN(lng)) {
        setLocation({ lat, lng });
        // This will trigger the existing useEffect that watches location changes
      }
    }
  }, [searchParams]);

  // Filter the spots based on selected amenities
  useEffect(() => {
    const filtered = spots.filter(spot => {
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

      return true;
    });

    setFilteredSpots(filtered);
  }, [spots, selectedAmenities]);


  // Fetch nearest spots when location or generalLocation changes
  useEffect(() => {
    async function fetchNearestSpots() {
     
      if (location && location.lat && location.lng) {
        try {
          // Debug: log which location is being used
          console.log("Fetching nearest spots for:", location);
          const nearestSpots = await findNearestSpots(location.lat, location.lng);
          setFilteredSpots(nearestSpots);
        } catch (error) {
          console.error("Error fetching nearest spots:", error);
        }
      } else {
        // If neither location nor generalLocation is available, fallback to all spots
        setFilteredSpots(spots);
      }
    }
    fetchNearestSpots();
  }, [location, spots]);

  // Handle closing the map view
  const handleCloseMap = () => {
    setView("list");
  };

  return (
    <>
      <ListingsFilter
        selectedAmenities={selectedAmenities}
        setSelectedAmenities={setSelectedAmenities}
        location={location}
        setLocation={setLocation}
        view={view}
        setView={setView}
        amenities={amenities}
      />
      <div className="listings-container mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          
          {filteredSpots.map((spot) => (
            <ListingsCard key={spot.id} spot={spot} isList={true} />
          ))}
        </div>
      </div>
      
      {/* Map View Overlay */}
      {view === "map" && generalLocation && ( // Ensure generalLocation is available for MapsUi
        <MapsUi 
          spots={filteredSpots} 
          targetLocation={location}  
          generalLocation={generalLocation}
          onClose={handleCloseMap} 
        />
      )}
    </>
  );
}
