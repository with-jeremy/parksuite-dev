import { NextRequest, NextResponse } from "next/server";
import { parkingSpotRepository } from "@/lib/db/repositories/parking-spots";

export async function POST(req: NextRequest) {
  try {
    const { lat, lng, maxDistanceMeters } = await req.json();
    const spots = await parkingSpotRepository.findNearest(lat, lng, maxDistanceMeters);
    return NextResponse.json(spots);
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch nearest spots." }, { status: 500 });
  }
}
