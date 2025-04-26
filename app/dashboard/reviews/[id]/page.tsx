import ReviewsCard from "@/app/components/ReviewsCard";
import { Suspense } from "react";

export default async function Page({ params }) {
  // id is the user_id whose reviews/profile we are showing
  const { id } = await params;
  return (
    <main className="max-w-3xl mx-auto py-8 px-4">
      <Suspense fallback={<div>Loading reviews...</div>}>
        <ReviewsCard userId={id} />
      </Suspense>
    </main>
  );
}
