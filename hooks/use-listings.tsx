import { useState, useEffect, useMemo } from "react";
import { db } from "@/utils/supabase/client";

// Module-level cache for amenities
let cachedAmenities: any[] | null = null;
let amenitiesCacheTime = 0;
const AMENITIES_CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export function useListings(initialSearch: string) {
  const [search, setSearch] = useState(initialSearch);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [location, setLocation] = useState<any>(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [amenities, setAmenities] = useState<any[]>([]);
  const [amenitiesLoading, setAmenitiesLoading] = useState(true);
  const [amenitiesError, setAmenitiesError] = useState<string | null>(null);
  const [spots, setSpots] = useState<any[]>([]);
  const [spotsLoading, setSpotsLoading] = useState(true);
  const [spotsError, setSpotsError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSpots() {
      setSpotsLoading(true);
      setSpotsError(null);
      try {
        const { data, error } = await db
          .from("parking_spots")
          .select(
            "*, parking_spot_images(image_url, is_primary), parking_spot_amenities(amenities(name, id))"
          )
          .order("created_at", { ascending: false })
          .eq("is_active", true)
          .limit(12);
        if (error) throw error;
        setSpots(data || []);
      } catch (err: any) {
        setSpotsError("Error loading parking spots");
      } finally {
        setSpotsLoading(false);
      }
    }
    fetchSpots();
  }, []);

  useEffect(() => {
    async function fetchAmenities() {
      setAmenitiesLoading(true);
      setAmenitiesError(null);
      try {
        // Use cache if available and not expired
        if (
          cachedAmenities &&
          Date.now() - amenitiesCacheTime < AMENITIES_CACHE_DURATION
        ) {
          setAmenities(cachedAmenities);
        } else {
          const { data, error } = await db.from("amenities").select("id, name");
          if (error) throw error;
          const formatted = data.map((a: any) => ({
            label: a.name,
            value: a.id,
          }));
          cachedAmenities = formatted;
          amenitiesCacheTime = Date.now();
          setAmenities(formatted);
        }
      } catch (err) {
        setAmenitiesError("Failed to load amenities");
      } finally {
        setAmenitiesLoading(false);
      }
    }
    fetchAmenities();
  }, []);

  const filteredSpots = useMemo(() => {
    const normalize = (str: string) =>
      str
        ? str
            .toLowerCase()
            .replace(/[^\w\s]/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .split(" ")
            .filter(Boolean)
        : [];
    const searchWords = normalize(search);
    return spots.filter((spot) => {
      const combined = [
        spot.address,
        spot.city,
        spot.state,
        spot.zip_code,
        spot.description,
        spot.title,
      ]
        .filter(Boolean)
        .join(" ");
      const combinedWords = normalize(combined);
      const matchesSearch = searchWords.every((word) =>
        combinedWords.includes(word)
      );
      const matchesType =
        selectedTypes.length === 0 || selectedTypes.includes(spot.type);
      const spotAmenityIds = Array.isArray(spot.parking_spot_amenities)
        ? spot.parking_spot_amenities.map(
            (a: any) => a.amenities?.id || a.amenities
          )
        : [];
      const matchesAmenities =
        selectedAmenities.length === 0 ||
        selectedAmenities.every((a) => spotAmenityIds.includes(a));
      return matchesSearch && matchesType && matchesAmenities;
    });
  }, [spots, search, selectedTypes, selectedAmenities]);

  return {
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
    spots: filteredSpots,
    spotsLoading,
    spotsError,
  };
}
