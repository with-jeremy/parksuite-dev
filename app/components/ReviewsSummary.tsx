import { db } from "@/lib/supabaseClient";

interface ReviewsSummaryProps {
  userId: string;
}

export default async function ReviewsSummary({ userId }: ReviewsSummaryProps) {
  // Fetch all reviews where user is either renter or host
  const { data: reviews, error } = await db
    .from("reviews")
    .select(`id, rating, booking:booking_id(id, user_id, parking_spot:parking_spot_id(id, owner_id))`);

  if (error) return null;
  if (!reviews) return null;

  // Only include reviews where user is renter or host
  const relevant = reviews.filter(
    (r: any) =>
      (r.booking && (r.booking.user_id === userId || r.booking.parking_spot?.owner_id === userId))
  );

  const count = relevant.length;
  const average = count ? relevant.reduce((sum: number, r: any) => sum + r.rating, 0) / count : 0;

  if (count === 0) return null;
  return (
    <div className="flex items-center gap-2 text-sm text-gray-700">
      <span>{count} review{count !== 1 ? "s" : ""}</span>
      <span>·</span>
      <span>Average: {average.toFixed(1)} ★</span>
    </div>
  );
}