import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import ReviewForm from '@/app/components/ReviewForm';



export default async function CreateReviewPage({ params }) {
  const user = await currentUser();
  const bookingId = await params.id; // FIX: get id from params
  if (!user) return redirect('/dashboard');

  return (
    <div className="max-w-xl mx-auto py-8">
      <ReviewForm bookingId={bookingId} />
    </div>
  );
}