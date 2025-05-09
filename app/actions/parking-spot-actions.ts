"use server";

import { parkingSpotRepository } from "@/lib/db/repositories/parking-spots";

export async function toggleFeaturedSpot(id: string, isFeatured: boolean) {
  return await parkingSpotRepository.toggleFeatured(id, isFeatured);
}