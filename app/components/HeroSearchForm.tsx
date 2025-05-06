"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Search } from "lucide-react";

export default function HeroSearchForm() {
  const [heroSearch, setHeroSearch] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (heroSearch.trim()) {
      router.push(`/listings?search=${encodeURIComponent(heroSearch)}`);
    }
  };

  return (
    <div className="max-w-xl w-full mx-auto">
      <div className="relative flex items-center">
        <input
          id="destination"
          placeholder="Address, city, state, or zip code"
          className="w-full p-4 pr-16 bg-white rounded-full border-2 border-gray-200 shadow-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          value={heroSearch}
          onChange={(e) => setHeroSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <Button
          className="absolute right-1 rounded-full p-2 h-10 w-10 flex items-center justify-center"
          onClick={handleSearch}
          aria-label="Search parking"
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
