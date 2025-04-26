import { db } from "@/lib/supabaseClient";
import { currentUser } from "@clerk/nextjs/server";
import ReviewsSummary from "./ReviewsSummary";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Star } from "lucide-react";

interface ReviewsCardProps {
  userId: string;
}

export default async function ReviewsCard({ userId }: ReviewsCardProps) {
  const clerkUser = await currentUser();
  const supabase = db;

  // Fetch all reviews for this user (as host or renter)
  // Assumes review has: id, rating, comment, booking_id
  // booking has: id, user_id (renter), parking_spot_id
  // parking_spot has: id, owner_id (host)
  const { data: reviews, error } = await supabase
    .from("reviews")
    .select(`id, rating, comment, booking:booking_id(id, user_id, parking_spot:parking_spot_id(id, owner_id))`)
    .order("created_at", { ascending: false });

  if (error) return <div>Error loading reviews.</div>;
  if (!reviews || reviews.length === 0) return <div>No reviews exist for this user.</div>;

  // Split reviews into asHost and asRenter
  const asHost = [];
  const asRenter = [];
  for (const review of reviews) {
    if (!review.booking) continue;
    if (review.booking.user_id === userId) {
      asRenter.push(review);
    } else if (review.booking.parking_spot?.owner_id === userId) {
      asHost.push(review);
    }
  }

  // Helper to get count and average
  function getStats(arr: any[]) {
    const count = arr.length;
    const avg = count ? (arr.reduce((sum, r) => sum + r.rating, 0) / count) : 0;
    return { count, avg };
  }

  const hostStats = getStats(asHost);
  const renterStats = getStats(asRenter);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold mb-4">Reviews for {userId}</h2>
      {asHost.length > 0 && (
        <section>
          <h3 className="font-semibold text-lg mb-2">As Host</h3>
          <ReviewsSummary userId={userId} />
          <ul className="mt-4 space-y-4 bg-white/70 rounded-xs shadow-sm p-4 border border-neutral-300">
            {asHost.map((r) => (
              <>
                <li key={r.id + '-1'} className="flex flex-col gap-2 border border-neutral-100 rounded-xs p-5 bg-gradient-to-br from-white to-gray-50 shadow hover:shadow-md transition-shadow duration-200">
                  <ToggleGroup type="single" value={r.rating.toString()} className="flex w-full justify-between mb-2 pointer-events-none select-none">
                    {[1,2,3,4,5].map((val) => (
                      <ToggleGroupItem
                        key={val}
                        value={val.toString()}
                        aria-label={`Rated ${val}`}
                        className={`p-0 w-9 h-9 flex items-center justify-center border-none bg-transparent ${Number(r.rating) >= val ? 'text-yellow-400' : 'text-gray-300'}`}
                        tabIndex={-1}
                      >
                        <Star fill={Number(r.rating) >= val ? '#facc15' : 'none'} className="w-7 h-7" />
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                  <div className="text-base italic text-gray-700 text-center">“{r.comment}”</div>
                </li>
              </>
            ))}
          </ul>
        </section>
      )}
      {asRenter.length > 0 && (
        <section>
          <h3 className="font-semibold text-lg mb-2">As Renter</h3>
          <ReviewsSummary userId={userId} />
          <ul className="mt-4 space-y-4 bg-white/70 rounded-xs shadow-sm p-4 border border-neutral-300">
            {asRenter.map((r) => (
              <>
                <li key={r.id + '-1'} className="flex flex-col gap-2 border border-neutral-100 rounded-xs p-5 bg-gradient-to-br from-white to-gray-50 shadow hover:shadow-md transition-shadow duration-200">
                  <ToggleGroup type="single" value={r.rating.toString()} className="flex w-full justify-between mb-2 pointer-events-none select-none">
                    {[1,2,3,4,5].map((val) => (
                      <ToggleGroupItem
                        key={val}
                        value={val.toString()}
                        aria-label={`Rated ${val}`}
                        className={`p-0 w-9 h-9 flex items-center justify-center border-none bg-transparent ${Number(r.rating) >= val ? 'text-yellow-400' : 'text-gray-300'}`}
                        tabIndex={-1}
                      >
                        <Star fill={Number(r.rating) >= val ? '#facc15' : 'none'} className="w-7 h-7" />
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                  <div className="text-base italic text-gray-700 text-center">“{r.comment}”</div>
                </li>
              </>
            ))}
          </ul>
        </section>
      )}
      {asHost.length === 0 && asRenter.length === 0 && (
        <div>No reviews exist for this user.</div>
      )}
    </div>
  );
}
