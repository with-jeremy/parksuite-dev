"use server";

import { parkingSpotRepository } from "@/lib/db/repositories/parking-spots";

export async function findNearestSpots(lat: number, lng: number, maxDistanceMeters = 5000) {
  return await parkingSpotRepository.findNearest(lat, lng, maxDistanceMeters);
}
