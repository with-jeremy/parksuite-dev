"use client";
import { useEffect, useState } from "react";
import ListingsCard from "../components/ListingsCard";

export default function NearestSpotsClient() {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const res = await fetch("/api/nearest", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            }),
          });
          if (!res.ok) throw new Error("Failed to fetch spots");
          const data = await res.json();
          setSpots(data);
        } catch (e) {
          setError("Failed to fetch nearest spots.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Unable to retrieve your location.");
        setLoading(false);
      }
    );
  }, []);

  if (loading) return <div>Loading nearest parking spots...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!spots.length) return <div>No nearby parking spots found.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {spots.map((spot: any) => (
        <ListingsCard key={spot.id} spot={spot} />
      ))}
    </div>
  );
}
