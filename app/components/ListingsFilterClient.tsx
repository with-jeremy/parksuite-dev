"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const PARKING_TYPES = [
  { label: "Driveway", value: "driveway" },
  { label: "Garage", value: "garage" },
  { label: "Lot", value: "lot" },
  { label: "Street", value: "street" },
];

export default function ListingsFilterClient({
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
  view, // receive view from parent
  setView, // receive setView from parent
}) {
  // Local state for search input
  const [inputValue, setInputValue] = useState(search || "");
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Keep inputValue in sync with search prop (from URL or parent)
  useEffect(() => {
    setInputValue(search || "");
  }, [search]);

  // Ensure all types are included by default
  useEffect(() => {
    if (!selectedTypes || selectedTypes.length === 0) {
      setSelectedTypes(PARKING_TYPES.map((t) => t.value));
    }
  }, [selectedTypes, setSelectedTypes]);

  const router = useRouter();
  const pathname = usePathname();
  const urlSearchParams = useSearchParams();

  const isSearchReady = inputValue.trim().length > 0 || location;

  const handleUseLocation = () => {
    setLocating(true);
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocating(false);
      },
      (err) => {
        setLocationError("Unable to retrieve your location.");
        setLocating(false);
      }
    );
  };

  // Only update search when user clicks Search Now or input loses focus
  const handleSearchSubmit = () => {
    setSearch(inputValue);
    // Update the URL param for search
    const params = new URLSearchParams(urlSearchParams.toString());
    if (inputValue.trim()) {
      params.set("search", inputValue.trim());
    } else {
      params.delete("search");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  // Slim, horizontal, 3-column layout
  return (
    <div className="w-full max-w-7xl rounded shadow flex flex-col md:flex-row md:items-end gap-2 md:gap-4 px-2 py-2 sticky top-0 z-20 bg-transparent backdrop-blur-md">
      {/* Search Column */}
      <div className="flex-1 min-w-[220px] md:pr-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleSearchSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearchSubmit();
            }
          }}
          placeholder="Address, city, or state"
          className="w-full border rounded px-2 py-1 text-sm focus:outline-none focus:ring focus:border-primary"
        />
        <div className="mt-2 flex flex-row gap-2">
          <button
            className="flex-1 bg-gray-200 text-gray-800 py-1 rounded text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            onClick={handleUseLocation}
            disabled={locating}
            type="button"
          >
            {locating ? "Detecting location..." : "Use my Location"}
          </button>
          <button
            className="flex-1 bg-primary text-white py-1 rounded text-sm disabled:opacity-50"
            disabled={!isSearchReady}
            onClick={handleSearchSubmit}
            type="button"
          >
            Search Now
          </button>
        </div>
        {locationError && (
          <div className="text-xs text-red-500 mt-1">{locationError}</div>
        )}
        <div className="mt-2 flex flex-row items-center justify-between">
          <button
            className="text-xs underline text-primary"
            type="button"
            onClick={() => setShowAdvanced((prev) => !prev)}
          >
            {showAdvanced ? "Hide Advanced Search" : "Show Advanced Search"}
          </button>
          {/* View Selector */}
          <div className="flex flex-row gap-1 items-center ml-auto">
            <button
              type="button"
              className={`p-1 rounded ${
                view === "grid"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              aria-label="Grid view"
              onClick={() => setView("grid")}
            >
              <span role="img" aria-label="Grid">
                🔲
              </span>
            </button>
            <button
              type="button"
              className={`p-1 rounded ${
                view === "list"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              aria-label="List view"
              onClick={() => setView("list")}
            >
              <span role="img" aria-label="List">
                📋
              </span>
            </button>
            <button
              type="button"
              className={`p-1 rounded ${
                view === "map"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              aria-label="Map view"
              onClick={() => setView("map")}
            >
              <span role="img" aria-label="Map">
                🗺️
              </span>
            </button>
          </div>
        </div>
      </div>
      {/* Advanced Search (Collapsible) */}
      {showAdvanced && (
        <div className="w-full md:w-auto flex flex-col md:flex-row gap-2 md:gap-4 mt-2 md:mt-0">
          {/* Parking Type Column */}
          <div className="flex-1 min-w-[180px] md:px-2">
            <label className="block text-xs font-semibold mb-1">
              Parking Types Allowed
            </label>
            <div className="flex flex-wrap gap-1">
              {PARKING_TYPES.map((type) => (
                <label
                  key={type.value}
                  className="flex items-center gap-1 text-xs font-normal bg-gray-100 rounded px-2 py-1"
                >
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type.value)}
                    onChange={(e) => {
                      setSelectedTypes((prev) =>
                        e.target.checked
                          ? [...prev, type.value]
                          : prev.filter((t) => t !== type.value)
                      );
                    }}
                  />
                  {type.label}
                </label>
              ))}
            </div>
          </div>
          {/* Amenities Column */}
          <div className="flex-1 min-w-[180px] md:pl-2">
            <label className="block text-xs font-semibold mb-1">
              Amenities Required
            </label>
            <div className="flex flex-wrap gap-1">
              {amenitiesLoading ? (
                <span className="text-gray-400 text-xs">
                  Loading amenities...
                </span>
              ) : amenitiesError ? (
                <span className="text-red-500 text-xs">{amenitiesError}</span>
              ) : amenities.length === 0 ? (
                <span className="text-gray-400 text-xs">
                  No amenities found
                </span>
              ) : (
                amenities.map((amenity) => (
                  <label
                    key={amenity.value}
                    className="flex items-center gap-1 text-xs font-normal bg-gray-100 rounded px-2 py-1"
                  >
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity.value)}
                      onChange={(e) => {
                        setSelectedAmenities((prev) =>
                          e.target.checked
                            ? [...prev, amenity.value]
                            : prev.filter((a) => a !== amenity.value)
                        );
                      }}
                    />
                    {amenity.label}
                  </label>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
