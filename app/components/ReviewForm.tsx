"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';
import { Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/utils/supabase/client';
import { useUser } from '@clerk/nextjs';
import { Table, TableBody, TableCell, TableRow } from './ui/table';

// Add Indicator component for debug table
const Indicator = ({ ok }: { ok: boolean }) => (
  <span
    style={{
      display: 'inline-block',
      width: 10,
      height: 10,
      borderRadius: '50%',
      background: ok ? '#22c55e' : '#ef4444',
      marginRight: 6,
      verticalAlign: 'middle',
    }}
    title={ok ? 'OK' : 'Missing/Invalid'}
  />
);

interface ReviewFormProps {
  bookingId: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ bookingId }) => {
  const { user, isLoaded } = useUser();
  const [booking, setBooking] = useState<any>(null);
  const [role, setRole] = useState<'host' | 'renter' | null>(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      router.replace('/dashboard');
      return;
    }
    const fetchBooking = async () => {
      setLoading(true);
      const { data, error } = await db
        .from('bookings')
        .select('id, user_id, parking_spot_id')
        .eq('id', bookingId)
        .single();
      if (error || !data) {
        router.replace('/dashboard');
        return;
      }
      setBooking(data);
      if (data.user_id === user.id) setRole('renter');
      else if (data.parking_spot_id === user.id) setRole('host');
      else router.replace('/dashboard');
      setLoading(false);
    };
    fetchBooking();
  }, [bookingId, user, isLoaded, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!rating || Number(rating) < 1 || Number(rating) > 5) {
      setSubmitError('Please select a rating from 1 to 5 stars.');
      toast({ title: 'Rating required', description: 'Please select a rating from 1 to 5 stars.', variant: 'destructive' });
      return;
    }
    if (!canInsert) {
      setSubmitError('Missing required fields. Please complete all fields.');
      toast({ title: 'Missing fields', description: 'Please complete all fields before submitting.', variant: 'destructive' });
      return;
    }
    setFormLoading(true);
    const { error } = await db.from('reviews').insert({
      booking_id: bookingId,
      user_id: user?.id,
      rating: Number(rating),
      comment,
      created_at: new Date().toISOString(),
    });
    setFormLoading(false);
    if (error) {
      setSubmitError(error.message || 'Unknown error occurred.');
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Review submitted', description: 'Thank you for your feedback!' });
      setRating('');
      setComment('');
      setTimeout(() => {
        router.replace('/dashboard');
      }, 1200); // Delay redirect so user sees confirmation
    }
  };

  if (loading || !isLoaded) return <div className="p-8 text-center">1Loading...</div>;
  if (!role) return null;

  // Add debugRows and canInsert for debug table
  const debugRows = [
    { label: 'Booking ID', value: bookingId, ok: !!bookingId },
    { label: 'User ID', value: user?.id, ok: !!user?.id },
    { label: 'Role', value: role, ok: !!role },
    { label: 'Rating', value: rating, ok: !!rating && Number(rating) >= 1 && Number(rating) <= 5 },
    { label: 'Comment', value: comment, ok: !!comment },
    { label: 'Booking Loaded', value: booking ? 'Yes' : 'No', ok: !!booking },
  ];
  const canInsert = !!bookingId && !!user?.id && !!role && !!rating && !!comment && !!booking;

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">
          Leave a Review for your {role === 'host' ? 'Renter' : 'Host'}
        </h2>
        {/* Star (toggle group) rating only */}
        <div>
          <label className="block mb-1 font-medium">Rating (Stars, 1-5) <span className="text-red-500">*</span></label>
          <ToggleGroup
            type="single"
            value={rating}
            onValueChange={val => setRating(val)}
            className="flex gap-1"
          >
            {[1, 2, 3, 4, 5].map((val) => (
              <ToggleGroupItem
                key={val}
                value={val.toString()}
                aria-label={`Rate ${val}`}
                className={
                  'p-0 w-9 h-9 flex items-center justify-center border-none bg-transparent ' +
                  (Number(rating) >= val ? 'text-yellow-400' : 'text-gray-300')
                }
              >
                <Star fill={Number(rating) >= val ? '#facc15' : 'none'} className="w-7 h-7" />
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        <div>
          <label className="block mb-1 font-medium">Comment</label>
          <Textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            rows={4}
            required
          />
        </div>
        {submitError && (
          <div className="text-red-600 text-sm font-semibold border border-red-200 bg-red-50 rounded p-2 mb-2">{submitError}</div>
        )}
        <Button type="submit" disabled={formLoading} className="w-full">
          {formLoading ? 'Submitting...' : 'Submit Review'}
        </Button>
      </form>
      {/* TEMP DEBUG TABLE */}
      <div className="mt-8">
        <div className="mb-2 font-semibold text-gray-700">Review Insert Debug Table</div>
        <Table className="w-auto max-w-lg border text-xs">
          <TableBody>
            {debugRows.map((row, i) => (
              <TableRow key={row.label}>
                <TableCell className="font-medium whitespace-nowrap">{row.label}</TableCell>
                <TableCell>
                  <Indicator ok={row.ok} />
                  {typeof row.value === 'string' || typeof row.value === 'number' ? row.value : row.value}
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell className="font-semibold">Ready to Insert?</TableCell>
              <TableCell>
                <Indicator ok={canInsert} />
                {canInsert ? <span className="text-green-600 font-bold">Greenlight</span> : <span className="text-red-600 font-bold">Redlight</span>}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default ReviewForm;