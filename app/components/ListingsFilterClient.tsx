"use client";

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Badge } from './ui/badge';
import { MapPin } from 'lucide-react';

const PARKING_TYPES = [
  { label: 'Driveway', value: 'driveway' },
  { label: 'Garage', value: 'garage' },
  { label: 'Lot', value: 'lot' },
  { label: 'Street', value: 'street' },
];

const AMENITIES = [
  { label: 'EV Charging', value: 'ev_charging' },
  { label: 'Covered', value: 'covered' },
  { label: 'Security', value: 'security' },
  { label: 'Accessible', value: 'accessible' },
  { label: 'Lighting', value: 'lighting' },
];

export default function ListingsFilterClient({ spots, filterOnly = false, gridOnly = false }) {
  const [search, setSearch] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  // Simulate amenities on each spot (since we don't have the join data here)
  // In production, replace with actual amenities from your DB
  const getSpotAmenities = spot => spot.amenities || [];

  const filteredSpots = useMemo(() => {
    return spots.filter(spot => {
      // Search by address, city, state, description, or title
      const searchText = search.toLowerCase();
      const matchesSearch =
        spot.address?.toLowerCase().includes(searchText) ||
        spot.city?.toLowerCase().includes(searchText) ||
        spot.state?.toLowerCase().includes(searchText) ||
        spot.description?.toLowerCase().includes(searchText) ||
        spot.title?.toLowerCase().includes(searchText);
      // Filter by type
      const matchesType =
        selectedTypes.length === 0 || selectedTypes.includes(spot.type);
      // Filter by amenities (simulate)
      const spotAmenities = getSpotAmenities(spot);
      const matchesAmenities =
        selectedAmenities.length === 0 ||
        selectedAmenities.every(a => spotAmenities.includes(a));
      return matchesSearch && matchesType && matchesAmenities;
    });
  }, [spots, search, selectedTypes, selectedAmenities]);

  // Filter UI
  const filterUI = (
    <div className="mb-8 p-4 bg-white rounded-lg shadow flex flex-col gap-4">
      <div className="flex-1">
        <label className="block text-sm font-medium mb-1">Search by address/city/state</label>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search for parking spots..."
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-primary"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Parking Type</label>
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
        <label className="block text-sm font-medium mb-1">Amenities</label>
        <div className="flex flex-wrap gap-2">
          {AMENITIES.map(amenity => (
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
          ))}
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
            <div className="aspect-video relative overflow-hidden">
              <Image
                src={spot.signedUrl || "/file.svg"}
                alt={spot.title}
                width={600}
                height={400}
                className="object-cover transition-transform group-hover:scale-105"
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
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );

  if (filterOnly) return filterUI;
  if (gridOnly) return gridUI;

  // Default: both (legacy usage)
  return (
    <div>
      {filterUI}
      {gridUI}
    </div>
  );
}
