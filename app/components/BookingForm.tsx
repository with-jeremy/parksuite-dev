"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";
import { db } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useUser } from "@clerk/nextjs";

interface BookingFormProps {
  spot: any;
  onClose: () => void;
}

const BookingForm: React.FC<Omit<BookingFormProps, 'open'>> = ({ spot, onClose }) => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uiMessage, setUiMessage] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    // Fetch existing bookings for this spot
    setUiMessage('Checking availability...');
    db.from("bookings")
      .select("booking_date")
      .eq("parking_spot_id", spot.id)
      .eq("status", "confirmed")
      .then(({ data, error }) => {
        if (error) {
          setUiMessage('Failed to fetch bookings.');
        } else if (data) {
          setBookedDates(data.map((b: any) => new Date(b.booking_date)));
          setUiMessage('Availability loaded.');
        }
        setTimeout(() => setUiMessage(null), 2000);
      });
  }, [spot.id]);

  const handlePayNow = async () => {
    if (!selectedDates.length || !user) {
      setUiMessage('Please select at least one date.');
      return;
    }
    setLoading(true);
    setError(null);
    setUiMessage('Processing booking...');
    try {
      // TODO: Integrate Stripe payment confirmation here before creating booking
      const price = spot.price_per_day;
      const serviceFee = +(price * 0.03 * selectedDates.length).toFixed(2);
      const total = +(price * selectedDates.length + serviceFee).toFixed(2);
      // Create a booking for each selected date
      const inserts = selectedDates.map(date => ({
        booking_date: date.toISOString().slice(0, 10),
        parking_spot_id: spot.id,
        price_per_day: price,
        service_fee: +(price * 0.03).toFixed(2),
        total_price: +(price * 1.03).toFixed(2),
        status: "confirmed",
        user_id: user.id,
      }));
      const { data, error } = await db.from("bookings").insert(inserts).select("id");
      if (error) {
        throw new Error(error.message || "An unexpected error occurred while booking.");
      }
      if (!data || !data.length) {
        throw new Error("Booking failed. No data returned.");
      }
      setUiMessage('Booking successful! Redirecting...');
      setTimeout(() => setUiMessage(null), 2000);
      onClose();
      router.push(`/bookings/${data[0].id}/confirmation`);
    } catch (err: any) {
      setError(err.message || "Booking failed");
      setUiMessage('Booking failed.');
    } finally {
      setLoading(false);
    }
  };

  // Disable already booked dates
  const disabledDays = bookedDates;
  const quantity = selectedDates.length;
  const price = spot.price_per_day;
  const serviceFee = +(price * 0.03 * quantity).toFixed(2);
  const total = +(price * quantity + serviceFee).toFixed(2);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Book {spot.title}</h2>
          </div>
          <DayPicker
            mode="multiple"
            selected={selectedDates}
            onSelect={setSelectedDates}
            disabled={disabledDays}
            fromDate={new Date()}
          />
          <div className="flex flex-col gap-1 text-sm">
            <div className="flex justify-between"><span>Price per Day</span><span>${price.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Quantity</span><span>{quantity}</span></div>
            <div className="flex justify-between"><span>Rental Fee (3%)</span><span>${serviceFee.toFixed(2)}</span></div>
            <div className="flex justify-between font-semibold border-t pt-2"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>
          {uiMessage && <div className="p-2 bg-yellow-100 text-yellow-800 rounded text-center">{uiMessage}</div>}
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <Button onClick={handlePayNow} disabled={!selectedDates.length || loading}>
            {loading ? "Processing..." : "Buy Now"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingForm;