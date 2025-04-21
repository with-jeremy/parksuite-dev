"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/app/components/ui/button";

export default function HeroSearchForm() {
  const [heroSearch, setHeroSearch] = useState("");
  const router = useRouter();

  return (
    <div className="border-none shadow-xl rounded-lg bg-white/90">
      <div className="p-6">
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">Find your spot</h3>
          <div className="space-y-4 pt-4">
            <div className="grid gap-2">
              <label htmlFor="destination" className="text-sm font-medium leading-none">
                Address, City, State, or Zip Code
              </label>
              <input
                id="destination"
                placeholder="e.g. 123 Main St, Florence, AL, or 35630"
                className="w-full p-2 border rounded"
                value={heroSearch}
                onChange={e => setHeroSearch(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="date" className="text-sm font-medium leading-none">Date</label>
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 opacity-50 inline-block bg-gray-300 rounded" />
                <input id="date" type="date" className="w-full p-2 border rounded" />
              </div>
            </div>
            <Button
              size="wfull"
              className="w-full"
              onClick={() => {
                router.push(`/listings?search=${encodeURIComponent(heroSearch)}`);
              }}
            >
              Search Parking
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
