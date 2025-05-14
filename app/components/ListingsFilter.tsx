"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, X, Loader2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useAutocompleteSuggestions } from "@/hooks/useAutocompleteSuggestions";

export default function ListingsFilter({
  selectedAmenities,
  setSelectedAmenities,
  location,
  setLocation,
  view,
  setView,
  amenities,
}) {
  const [inputValue, setInputValue] = useState("");
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const places = useMapsLibrary("places");
  const {
    suggestions,
    isLoading: suggestionsLoading,
    resetSession,
  } = useAutocompleteSuggestions(inputValue);

  const handleUseDeviceLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    setLocationError(null);
    setShowSuggestions(false);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setInputValue(""); // Clear input value
        setLocating(false);
      },
      (err) => {
        setLocationError("Unable to retrieve your location.");
        setLocating(false);
      }
    );
  };

  const handleSuggestionClick = async (suggestion: google.maps.places.AutocompleteSuggestion) => {
    if (!places || !suggestion.placePrediction) return;

    setShowSuggestions(false);
    setInputValue(suggestion.placePrediction.text.text);

    try {
      const place = suggestion.placePrediction.toPlace();
      await place.fetchFields({ fields: ["location"] });

      if (place.location) {
        setLocation({
          lat: place.location.lat(),
          lng: place.location.lng(),
        });
      } else {
        setLocationError("Selected place has no location data.");
      }
    } catch (error) {
      setLocationError("Could not process selected place.");
    } finally {
      resetSession();
    }
  };

  const clearLocationFilter = () => {
    setLocation(null);
    setInputValue("");
    setLocationError(null);
    resetSession();
    setShowSuggestions(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setShowSuggestions(value.length > 0);
  };

  const isUsingLocation = location !== null;

  return (
    <div className="w-full max-w-9xl rounded shadow flex flex-col md:flex-row md:items-end gap-2 md:gap-4 px-2 py-2 sticky top-[72px] z-20 bg-transparent backdrop-blur-md">
      <div className="flex-1 min-w-[220px] md:pr-2">
        <div className="relative flex items-center">
          {isUsingLocation && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary">
              <MapPin className="h-5 w-5" />
            </div>
          )}
          <div
            role="combobox"
            aria-expanded={showSuggestions && suggestions.length > 0}
            aria-haspopup="listbox"
            aria-controls={showSuggestions && suggestions.length > 0 ? "suggestions-listbox" : undefined}
            className="relative w-full"
          >
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={() => inputValue && setShowSuggestions(true)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setShowSuggestions(false);
                }
              }}
              placeholder={
                isUsingLocation && inputValue === ""
                  ? "using your location"
                  : "Search by Address, City, or Zip"
              }
              className={`w-full p-4 ${
                isUsingLocation ? "pl-10" : ""
              } pr-15 bg-white rounded-full border-2 ${
                isUsingLocation ? "border-primary" : "border-gray-200"
              } shadow-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all`}
              aria-autocomplete="list"
            />
          </div>

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
              aria-label="Search parking"
              type="button"
              disabled={locating || suggestionsLoading}
              // No onClick, as we only allow suggestions
            >
              {locating || suggestionsLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </Button>
          )}
        </div>

          <ul
            id="suggestions-listbox"
            className="absolute z-30 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto"
            onMouseDown={(e) => e.preventDefault()}
          >
            {suggestions.map((suggestion, index) => (
              <li
                key={suggestion.placePrediction?.placeId || index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.placePrediction?.text.text}
              </li>
            ))}
          </ul>

        {showSuggestions && suggestionsLoading && !isUsingLocation && (
          <div className="absolute z-30 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg px-4 py-2 text-gray-500">
            Loading suggestions...
          </div>
        )}

        {locationError && <div className="text-xs text-red-500 mt-1">{locationError}</div>}
        {isUsingLocation && (
          <div className="text-xs text-green-600 mt-1 pl-4 flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {inputValue === ""
              ? "Using your current location"
              : `Showing spots near ${inputValue}`}
          </div>
        )}

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
                onClick={handleUseDeviceLocation}
                disabled={locating}
                type="button"
                className="text-xs underline text-primary flex items-center gap-1"
              >
                <MapPin className="h-3 w-3" />
                {locating && inputValue === ""
                  ? "Detecting..."
                  : "Use my Location"}
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

function AdvancedFilters({ selectedAmenities = [], setSelectedAmenities, amenities }) {
  const amenitiesList = Array.isArray(amenities) ? amenities : [];

  return (
    <div className="w-full md:w-auto flex flex-col md:flex-row gap-2 md:gap-4 mt-2 md:mt-0">
      <div className="flex-1 min-w-[180px] md:pl-2">
        <label className="block text-xs font-semibold mb-1">Amenities Required</label>
        <div className="flex flex-wrap gap-1">
          {amenitiesList.map((amenity) => (
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
