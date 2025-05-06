"use client";
import React, { useState } from "react";
import Image from "next/image";
import BookingForm from "./BookingForm";
import { Button } from "@/app/components/ui/button";
import { Dialog, DialogContent } from "./ui/dialog";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { MapPin } from "lucide-react";

interface ListingsCardProps {
  spot: any;
  isList?: boolean;
}

const ListingsCard: React.FC<ListingsCardProps> = ({ spot, isList }) => {
  const [showBooking, setShowBooking] = useState(false);
  const [uiMessage, setUiMessage] = useState<string | null>(null);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomIdx, setZoomIdx] = useState(0);
  const { isSignedIn, user } = useUser();
  const router = useRouter();

  // Use images from spot.parking_spot_images
  const images = Array.isArray(spot.parking_spot_images)
    ? spot.parking_spot_images
    : [];
  // Prefer primary image if it exists, otherwise show all (up to 3)
  // Refactor: if isList, only show primaryImage; else show up to 3 images
  const primaryImage = images.find((img) => img.is_primary);

  // --- Amenities extraction, step by step ---
  // Step 1: Get the array of parking_spot_amenities
  const spotAmenities = Array.isArray(spot.parking_spot_amenities)
    ? spot.parking_spot_amenities
    : [];
  // Step 2: For each, get the amenities object
  const amenitiesObjects = spotAmenities.map((a: any) => a.amenities);
  // Step 3: For each amenities object, get the name
  const amenities = amenitiesObjects
    .filter((a: any) => a && a.name)
    .map((a: any) => a.name);

  const handleBookNow = () => {
    console.log("Book Now clicked");

    // Check if user is signed in
    if (!isSignedIn) {
      setUiMessage("Please sign in to book this spot");
      setTimeout(() => {
        router.push("/sign-in");
      }, 1500);
      return;
    }

    setUiMessage("Opening booking modal...");
    setShowBooking(true);
    setTimeout(() => setUiMessage(null), 2000);
  };

  // Unified card content
  const cardContent = (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      {isList ? (
        <div className="aspect-video relative overflow-hidden flex items-center justify-center">
          <Image
            src={primaryImage?.image_url || "/file.svg"}
            alt={spot.title}
            width={600}
            height={400}
            className="object-contain transition-transform group-hover:scale-105"
            priority
          />
        </div>
      ) : (
        <div className="w-full flex flex-row md:flex-row gap-2">
          {[0, 1, 2].map((idx) => (
            <div
              key={idx}
              className="flex-1 relative overflow-hidden flex items-center justify-center"
            >
              <Image
                src={images[idx]?.image_url || "/file.svg"}
                alt={spot.title}
                width={300}
                height={200}
                className="object-contain transition-transform group-hover:scale-105"
                priority
              />
            </div>
          ))}
        </div>
      )}
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg truncate">{spot.title}</h3>
        </div>
        <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>
            {spot.city}, {spot.state}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <p className="font-semibold">
            ${spot.price_per_day}
            <span className="text-sm font-normal text-muted-foreground">
              {" "}
              / day
            </span>
          </p>
          <Badge variant={spot.spaces_available > 0 ? "default" : "secondary"}>
            {spot.spaces_available > 0 ? "Available" : "Unavailable"}
          </Badge>
        </div>
        {spot.description && (
          <div className="mt-2 text-sm text-gray-800">{spot.description}</div>
        )}

        {/* Amenities pill list */}
        <div className="mt-2 flex flex-wrap gap-2">
          {amenities.map((name: string, idx: number) => (
            <Badge key={idx} variant="outline" className="text-sm">
              {name}
            </Badge>
          ))}
        </div>
        {!isList && (
          <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-2 text-sm text-muted-foreground">
            <div className="flex w-full max-w-xs items-center gap-1">
              <Button className="w-full">
                <Link
                  href={`/dashboard/reviews/${spot.owner_id}`}
                  className="text-white font-bold w-full block text-center"
                >
                  See Host's Reviews
                </Link>
              </Button>
            </div>
            <div className="flex w-full max-w-xs items-center gap-1">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded shadow"
                onClick={handleBookNow}
              >
                Book Now
              </Button>
            </div>
          </div>
        )}
        {showBooking && (
          <BookingForm
            spot={spot}
            onClose={() => {
              console.log("Booking modal closed");
              setUiMessage("Closed booking modal.");
              setShowBooking(false);
              setTimeout(() => setUiMessage(null), 2000);
            }}
          />
        )}
        {uiMessage && (
          <div className="mt-4 p-2 bg-yellow-100 text-yellow-800 rounded text-center">
            {uiMessage}
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Only wrap in Link if isList, otherwise render card directly
  return isList ? (
    <Link href={`/listings/${spot.id}`} className="group block">
      {cardContent}
    </Link>
  ) : (
    cardContent
  );
};

export default ListingsCard;
