"use client";

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Badge } from './ui/badge';
import { MapPin } from 'lucide-react';
import { db } from '@/utils/supabase/client';
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from '@/app/components/ui/sidebar';
import { useSearchParams } from 'next/navigation';

const PARKING_TYPES = [
  { label: 'Driveway', value: 'driveway' },
  { label: 'Garage', value: 'garage' },
  { label: 'Lot', value: 'lot' },
  { label: 'Street', value: 'street' },
];

export default function ListingsFilterClient({ spots, filterOnly = false, gridOnly = false, initialSearch = '' }) {
  const searchParams = useSearchParams();
  const urlSearch = searchParams?.get('search') || initialSearch;
  const [search, setSearch] = useState(urlSearch);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [amenitiesLoading, setAmenitiesLoading] = useState(true);
  const [amenitiesError, setAmenitiesError] = useState(null);
  const [location, setLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    setSearch(urlSearch);
  }, [urlSearch]);

  // Helper: is search ready (either address or location)
  const isSearchReady = search.trim().length > 0 || location;

  // Handler for geolocation
  const handleUseLocation = () => {
    setLocating(true);
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
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
        setLocationError('Unable to retrieve your location.');
        setLocating(false);
      }
    );
  };

  useEffect(() => {
    async function fetchAmenities() {
      setAmenitiesLoading(true);
      setAmenitiesError(null);
      try {
        const { data, error } = await db.from('amenities').select('id, name');
        if (error) throw error;
        setAmenities(data.map(a => ({ label: a.name, value: a.id })));
      } catch (err) {
        setAmenitiesError('Failed to load amenities');
      } finally {
        setAmenitiesLoading(false);
      }
    }
    fetchAmenities();
  }, []);

  const getSpotAmenities = spot => spot.amenities || [];

  const filteredSpots = useMemo(() => {
    // Helper to normalize and split text into words (remove punctuation, lowercase)
    const normalize = (str) =>
      str
        ? str
            .toLowerCase()
            .replace(/[^\w\s]/g, ' ') // remove punctuation
            .replace(/\s+/g, ' ') // collapse whitespace
            .trim()
            .split(' ')
            .filter(Boolean)
        : [];
    const searchWords = normalize(search);
    return spots.filter(spot => {
      // Concatenate all searchable fields and normalize
      const combined = [
        spot.address,
        spot.city,
        spot.state,
        spot.zip_code,
        spot.description,
        spot.title
      ]
        .filter(Boolean)
        .join(' ');
      const combinedWords = normalize(combined);
      // Check if every search word is present in the combined words
      const matchesSearch = searchWords.every(word =>
        combinedWords.includes(word)
      );
      const matchesType =
        selectedTypes.length === 0 || selectedTypes.includes(spot.type);
      const spotAmenityIds = getSpotAmenities(spot).map(a => a.id || a);
      const matchesAmenities =
        selectedAmenities.length === 0 ||
        selectedAmenities.every(a => spotAmenityIds.includes(a));
      return matchesSearch && matchesType && matchesAmenities;
    });
  }, [spots, search, selectedTypes, selectedAmenities]);

  // Filter UI (now just the filter controls, not the container)
  const filterControls = (
    <div className="flex flex-col gap-4 p-4 bg-white rounded shadow-md w-full max-w-sm">
      <h2 className="text-lg font-semibold mb-4">Find Your Parking Spot</h2>
      <div className="flex-1">
        <label className="block text-sm font-medium mb-1">Search by address/city/state</label>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search for parking spots..."
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-primary"
        />
        {/* Use my Location/Search Now button */}
        <div className="mt-2">
          {isSearchReady ? (
            <button
              className="w-full bg-primary text-white py-2 rounded disabled:opacity-50"
              disabled={!isSearchReady}
              onClick={() => { /* Add search logic here later */ }}
            >
              Search Now
            </button>
          ) : (
            <button
              className="w-full bg-gray-200 text-gray-800 py-2 rounded flex items-center justify-center gap-2 disabled:opacity-50"
              onClick={handleUseLocation}
              disabled={locating}
              type="button"
            >
              {locating ? 'Detecting location...' : 'Use my Location'}
            </button>
          )}
          {locationError && (
            <div className="text-xs text-red-500 mt-1">{locationError}</div>
          )}
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Filter by Parking Type</label>
        <div className="flex flex-wrap gap-2">
          {PARKING_TYPES.map(type => (
            <label key={type.value} className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={selectedTypes.includes(type.value)}
                onChange={e => {
                  setSelectedTypes(prev =>
                    e.target.checked
                      ? [...prev, type.value]
                      : prev.filter(t => t !== type.value)
                  );
                }}
              />
              {type.label}
            </label>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Filter by Amenities</label>
        <div className="flex flex-wrap gap-2">
          {amenitiesLoading ? (
            <span className="text-gray-400">Loading amenities...</span>
          ) : amenitiesError ? (
            <span className="text-red-500">{amenitiesError}</span>
          ) : amenities.length === 0 ? (
            <span className="text-gray-400">No amenities found</span>
          ) : (
            amenities.map(amenity => (
              <label key={amenity.value} className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={selectedAmenities.includes(amenity.value)}
                  onChange={e => {
                    setSelectedAmenities(prev =>
                      e.target.checked
                        ? [...prev, amenity.value]
                        : prev.filter(a => a !== amenity.value)
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
  );

  // Listings grid UI
  const gridUI = (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {filteredSpots.length === 0 && (
        <div className="col-span-full text-center text-muted-foreground py-12">No spots found matching your criteria.</div>
      )}
      {filteredSpots.map(spot => (
        <Link key={spot.id} href={`/listings/${spot.id}`} className="group">
          <Card className="overflow-hidden transition-all hover:shadow-md">
            <div className="aspect-video relative overflow-hidden flex items-center justify-center">
              <Image
              src={spot.signedUrl || "/file.svg"}
              alt={spot.title}
              width={600}
              height={400}
              className="object-contain transition-transform group-hover:scale-105"
              />
              {spot.featured && (
              <Badge className="absolute top-2 left-2" variant="secondary">
                Featured
              </Badge>
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{spot.title}</h3>
              </div>
              <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>
                  {spot.city}, {spot.state}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <p className="font-semibold">
                  ${spot.price_per_day} <span className="text-sm font-normal text-muted-foreground">/ day</span>
                </p>
                <Badge variant={spot.spaces_available > 0 ? 'default' : 'secondary'}>
                  {spot.spaces_available > 0 ? 'Available' : 'Unavailable'}
                </Badge>
              </div>
              {spot.description && (
                <div className="mt-2 text-sm text-gray-800 line-clamp-2">{spot.description}</div>
              )}
              {/* Amenities pill list */}
              {getSpotAmenities(spot).length > 0 && (
                <ul className="flex flex-wrap gap-2 mt-2">
                  {getSpotAmenities(spot).map((a, idx) => (
                    <li key={a.id || a} className="bg-gray-100 px-2 py-1 rounded-full text-xs text-gray-700">
                      {a.name || a}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );

  if (filterOnly) {
    // Show only the sidebar with filter controls
    return (
      <SidebarProvider>
        <div className="fixed top-4 left-4 z-30">
          <SidebarTrigger />
        </div>
        <Sidebar variant="sidebar" collapsible="offcanvas">
          <SidebarContent>
            {filterControls}
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    );
  }
  if (gridOnly) return gridUI;

  // Default: both (sidebar + grid)
  return (
    <SidebarProvider>
      <div className="flex w-full min-h-svh">
        {/* SidebarTrigger always visible, not just on mobile */}
        <div className="fixed top-12 left-4 z-30">
          <SidebarTrigger />
        </div>
        <Sidebar variant="floating" collapsible="offcanvas">
          <SidebarContent>
          <div className="pt-28">
            {filterControls}
          </div>
          </SidebarContent>
        </Sidebar>
        {/* Main content (grid) */}
        <main className="flex-1 p-4">
          {gridUI}
        </main>
      </div>
    </SidebarProvider>
  );
}
