"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, MapPin, X } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { findNearestSpots } from "@/app/actions/find-nearest-spots";

export default function ListingsFilter({
  search,
  setSearch,
  selectedAmenities,
  setSelectedAmenities,
  location,
  setLocation,
  view,
  setView,
  amenities,
  setFilteredSpots, // Add this prop to receive the filtered spots setter
}) {
  const [inputValue, setInputValue] = useState("");
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Keep input in sync with search prop
  useEffect(() => {
    // Only set inputValue if search is a string
    setInputValue(typeof search === "string" ? search : "");
  }, [search]);

  const handleUseLocation = async () => {
    setLocating(true);
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      setLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const newLocation = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        setLocation(newLocation);

        try {
          // Call the server action to find nearby spots
          const nearbySpots = await findNearestSpots(newLocation.lat, newLocation.lng);
          setFilteredSpots(nearbySpots);
        } catch (error) {
          console.error("Failed to fetch nearby spots:", error);
          setLocationError("Failed to find nearby parking spots.");
        }

        setLocating(false);
      },
      (err) => {
        setLocationError("Unable to retrieve your location.");
        setLocating(false);
      }
    );
  };

  // New function to clear location filter
  const clearLocationFilter = () => {
    setLocation(null);
    setSearch("");
    setInputValue("");
    setFilteredSpots([]); // Clear the filtered spots when location is cleared
  };

  const handleSearchSubmit = () => {
    if (typeof inputValue === "string" && inputValue.trim()) {
      setSearch(inputValue.trim());
    } else {
      setSearch("");
    }
  };

  // Check if we're using location-based search
  const isUsingLocation = location !== null;

  return (
    <div className="w-full max-w-9xl rounded shadow flex flex-col md:flex-row md:items-end gap-2 md:gap-4 px-2 py-2 sticky top-0 z-20 bg-transparent backdrop-blur-md">
      {/* Search Column */}
      <div className="flex-1 min-w-[220px] md:pr-2">
        <div className="relative flex items-center">
          {isUsingLocation && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary">
              <MapPin className="h-5 w-5" />
            </div>
          )}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearchSubmit();
            }}
            placeholder={isUsingLocation ? "Using your current location" : "Search by Address, City, or State"}
            className={`w-full p-4 ${isUsingLocation ? 'pl-10' : ''} pr-15 bg-white rounded-full border-2 ${isUsingLocation ? 'border-primary' : 'border-gray-200'} shadow-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all`}
            readOnly={isUsingLocation}
          />

          {isUsingLocation ? (
            <Button
              className="absolute right-0 rounded-full p-2 h-[58px] w-[59px] flex items-center justify-center mr-[2px]"
              onClick={clearLocationFilter}
              aria-label="Clear location"
              type="button"
              variant="outline"
            >
              <X className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              className="absolute right-0 rounded-full p-2 h-[58px] w-[59px] flex items-center justify-center mr-[2px]"
              onClick={handleSearchSubmit}
              aria-label="Search parking"
              type="button"
            >
              <Search className="h-5 w-5" />
            </Button>
          )}
        </div>

        {locationError && (
          <div className="text-xs text-red-500 mt-1">{locationError}</div>
        )}

        {/* Location success message */}
        {isUsingLocation && (
          <div className="text-xs text-green-600 mt-1 pl-4 flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            Using your current location for nearby parking spots
          </div>
        )}

        {/* Advanced Toggle + View Selection */}
        <div className="mt-2 pl-4 flex flex-col gap-1">
          <div className="flex flex-row items-center justify-between gap-2">
            <button
              className="text-xs underline text-primary"
              type="button"
              onClick={() => setShowAdvanced((prev) => !prev)}
            >
              {showAdvanced ? "Hide Advanced Search" : "Show Advanced Search"}
            </button>

            {!isUsingLocation && (
              <button
                onClick={handleUseLocation}
                disabled={locating}
                type="button"
                className="text-xs underline text-primary flex items-center gap-1"
              >
                <MapPin className="h-3 w-3" />
                {locating ? "Detecting location..." : "Use my Location"}
              </button>
            )}

            <ViewSelector view={view} setView={setView} />
          </div>
          {showAdvanced && (
            <div className="mt-2">
              <AdvancedFilters
                selectedAmenities={selectedAmenities}
                setSelectedAmenities={setSelectedAmenities}
                amenities={amenities}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Sub-components for better organization
function ViewSelector({ view, setView }) {
  return (
    <div className="flex items-center gap-2 ml-auto">
      <span className="text-xs font-medium text-gray-700">View as:</span>
      <div className="flex border rounded overflow-hidden">
        {["list", "map"].map((viewType) => (
          <button
            key={viewType}
            type="button"
            className={`px-3 py-1.5 flex items-center gap-1.5 text-sm transition-colors ${
              view === viewType
                ? "bg-primary text-white"
                : "bg-white hover:bg-gray-50 text-gray-700"
            }`}
            aria-label={`${viewType} view`}
            onClick={() => setView(viewType)}
          >
            <span role="img" aria-label={viewType}>
              {viewType === "list" ? "📋" : "🗺️"}
            </span>
            <span>{viewType === "list" ? "List" : "Map"}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function AdvancedFilters({
  selectedAmenities = [],
  setSelectedAmenities,
  amenities,
}) {
  return (
    <div className="w-full md:w-auto flex flex-col md:flex-row gap-2 md:gap-4 mt-2 md:mt-0">
      {/* Amenities */}
      <div className="flex-1 min-w-[180px] md:pl-2">
        <label className="block text-xs font-semibold mb-1">
          Amenities Required
        </label>
        <div className="flex flex-wrap gap-1">
          {amenities.map((amenity) => (
            <label
              key={amenity.id}
              className="flex items-center gap-1 text-xs font-normal bg-gray-100 rounded px-2 py-1"
            >
              <input
                type="checkbox"
                checked={selectedAmenities.includes(amenity.id)}
                onChange={(e) => {
                  setSelectedAmenities((prev = []) =>
                    e.target.checked
                      ? [...prev, amenity.id]
                      : prev.filter((a) => a !== amenity.id)
                  );
                }}
              />
              {amenity.name}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
