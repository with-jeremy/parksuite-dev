"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { db } from '@/lib/supabaseClient';
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";

export default function SpotsDashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [spots, setSpots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;
    setLoading(true);
    db.from("parking_spots")
      .select("*")
      .eq("owner_id", user.id)
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setSpots(data || []);
        setLoading(false);
      });
  }, [isLoaded, isSignedIn, user]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this spot?")) return;
    setDeletingId(id);
    const { error } = await db.from("parking_spots").delete().eq("id", id);
    if (error) {
      setError(error.message);
    } else {
      setSpots((prev) => prev.filter((s) => s.id !== id));
    }
    setDeletingId(null);
  };

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn || !user) return <div>Sign in to view your parking spots.</div>;

  return (
    <div className="p-5 min-h-screen flex flex-col items-center">
      <div className="w-full flex justify-between mb-5 max-w-2xl">
        <h1 className="text-3xl font-bold ">Your Parking Spots</h1>
        <Link href="/dashboard/spots/create">
          <button className="p-3 bg-blue-500 text-white rounded-lg">Add Spot</button>
        </Link>
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading ? (
        <div className="text-white">Loading spots...</div>
      ) : spots.length === 0 ? (
        <div className="text-white">No spots found.</div>
      ) : (
        <div className="w-full max-w-2xl space-y-4">
          {spots.map((spot) => (
            <Card key={spot.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold">{spot.title}</CardTitle>
                <span className={`text-xs font-medium px-2 py-1 rounded ${spot.is_active ? 'bg-green-200 text-green-800' : 'bg-gray-300 text-gray-600'}`}>{spot.is_active ? 'Active' : 'Inactive'}</span>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-1">{spot.address}, {spot.city}, {spot.state} {spot.zip_code}</div>
                <div className="text-sm text-muted-foreground mb-1">Type: {spot.type} | ${spot.price_per_day}/day | Spaces: {spot.spaces_available ?? 'N/A'}</div>
              </CardContent>
              <CardFooter className="flex gap-2 justify-end">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/dashboard/spots/${spot.id}`}>Edit</Link>
                </Button>
                
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
