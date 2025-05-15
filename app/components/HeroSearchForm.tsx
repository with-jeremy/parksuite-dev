"use client";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Search } from "lucide-react";
import { useAutocompleteSuggestions } from "@/hooks/useAutocompleteSuggestions";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

export default function HeroSearchForm() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIdx, setHighlightedIdx] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const places = useMapsLibrary("places");
  const { suggestions, isLoading: suggestionsLoading, resetSession } = useAutocompleteSuggestions(inputValue);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setShowSuggestions(value.length > 0);
    setHighlightedIdx(-1);
  };

  const handleSuggestionClick = async (suggestion: any) => {
    setInputValue(suggestion.placePrediction.text.text);
    setShowSuggestions(false);
    setHighlightedIdx(-1);
    resetSession();
    
    if (places && suggestion.placePrediction) {
      try {
        const place = suggestion.placePrediction.toPlace();
        await place.fetchFields({ fields: ["location"] });
        
        if (place.location) {
          const newLocation = { lat: place.location.lat(), lng: place.location.lng() };
          setLocation(newLocation);
          
          // Include location in URL when redirecting
          router.push(`/listings?search=${encodeURIComponent(suggestion.placePrediction.text.text)}&lat=${newLocation.lat}&lng=${newLocation.lng}`);
          return; // Exit early as we've already navigated
        }
      } catch (e) {
        // If location fetch fails, fall back to text-only search
        console.error("Error fetching place details:", e);
      }
    }
    
    // Fallback if location isn't available
    router.push(`/listings?search=${encodeURIComponent(suggestion.placePrediction.text.text)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      setHighlightedIdx((prev) => Math.min(prev + 1, suggestions.length - 1));
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      setHighlightedIdx((prev) => Math.max(prev - 1, 0));
      e.preventDefault();
    } else if (e.key === "Enter") {
      if (highlightedIdx >= 0) {
        handleSuggestionClick(suggestions[highlightedIdx]);
      } else if (suggestions.length > 0) {
        handleSuggestionClick(suggestions[0]);
      }
      e.preventDefault();
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleBlur = () => {
    setTimeout(() => setShowSuggestions(false), 100);
  };

  const handleButtonClick = () => {
    if (inputValue.trim()) {
      router.push(`/listings?search=${encodeURIComponent(inputValue.trim())}`);
    }
  };

  return (
    <div className="max-w-xl w-full mx-auto">
      <div className="relative flex items-center">
        <div
          role="combobox"
          aria-expanded={showSuggestions && suggestions.length > 0}
          aria-haspopup="listbox"
          aria-controls={showSuggestions && suggestions.length > 0 ? "hero-search-suggestions" : undefined}
          className="relative w-full"
        >
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => inputValue && setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            placeholder="Search by Address, City, or Zip"
            className="w-full p-4 pr-15 bg-white rounded-full border-2 border-gray-200 shadow-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            aria-autocomplete="list"
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul
              id="hero-search-suggestions"
              className="absolute z-30 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto"
              role="listbox"
            >
              {suggestions.map((suggestion, idx) => (
                <li
                  key={suggestion.placePrediction?.placeId || idx}
                  className={`px-4 py-2 cursor-pointer select-none ${highlightedIdx === idx ? "bg-blue-100" : ""}`}
                  onMouseDown={() => handleSuggestionClick(suggestion)}
                  onMouseEnter={() => setHighlightedIdx(idx)}
                  role="option"
                  aria-selected={highlightedIdx === idx}
                >
                  {suggestion.placePrediction?.text.text}
                </li>
              ))}
            </ul>
          )}
        </div>
        <Button
          className="absolute right-0 rounded-full p-2 h-[60px] w-[60px] flex items-center justify-center"
          aria-label="Search parking"
          type="button"
          onClick={handleButtonClick}
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
