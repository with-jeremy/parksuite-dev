"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useSupabaseClient } from "@/utils/supabase/client";
import { TablesInsert } from "@/types/supabase";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/app/components/ui/table";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/app/components/ui/card";
import { CreditCard, PiggyBank, CalendarCheck, Banknote } from "lucide-react";

const TODAY = new Date(); // Use current date

export default function EarningsPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getSupabaseClient } = useSupabaseClient();
  const [bookings, setBookings] = useState<any[]>([]);
  const [payments, setPayments] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalBooking, setModalBooking] = useState<any | null>(null);
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!isLoaded || !isSignedIn || !user) return;

      try {
        setLoading(true);

        // Get authenticated client with Clerk token
        const supabase = await getSupabaseClient();

        // 1. Get all spots owned by user
        const { data: spots, error: spotError } = await supabase
          .from("parking_spots")
          .select("id, title")
          .eq("owner_id", user.id);

        if (spotError) {
          setError(spotError.message);
          setLoading(false);
          return;
        }

        if (!spots || spots.length === 0) {
          setBookings([]);
          setLoading(false);
          return;
        }

        const spotIds = spots.map((s: any) => s.id);

        // 2. Get all bookings for these spots
        const { data: bookingsData, error: bookingsError } = await supabase
          .from("bookings")
          .select("id, booking_date, price_per_day, service_fee, status, parking_spot_id, parking_spots(title)")
          .in("parking_spot_id", spotIds)
          .order("booking_date", { ascending: true });

        if (bookingsError) {
          setError(bookingsError.message);
          setLoading(false);
          return;
        }

        const bookingsList = (bookingsData || []).map((b: any) => ({
          ...b,
          spot: b.parking_spots || spots.find((s: any) => s.id === b.parking_spot_id) || {},
        }));

        setBookings(bookingsList);

        // 3. Fetch earnings_payments for these bookings
        const bookingIds = bookingsList.map((b: any) => b.id);

        if (bookingIds.length > 0) {
          const { data: paymentsData, error: paymentsError } = await supabase
            .from("earnings_payments")
            .select("id, booking_id, status")
            .in("booking_id", bookingIds)
            .eq("status", "completed");

          if (!paymentsError && paymentsData) {
            // Map by booking_id for quick lookup
            const map: Record<string, any> = {};
            paymentsData.forEach((p: any) => {
              if (p.booking_id) map[p.booking_id] = p;
            });
            setPayments(map);
          }
        }

        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        setLoading(false);
      }
    }

    fetchData();
  }, [isLoaded, isSignedIn, user, getSupabaseClient]);

  const handleWithdraw = (booking: any) => {
    setModalBooking(booking);
  };

  const confirmWithdraw = async () => {
    if (!modalBooking || !user) return;

    try {
      setWithdrawingId(modalBooking.id);

      // Get authenticated client
      const supabase = await getSupabaseClient();

      // Simulate payment confirmation and create earnings_payment record
      const earnings = (modalBooking.price_per_day || 0) - (modalBooking.service_fee || 0);
      const payment: TablesInsert<"earnings_payments"> = {
        amount: earnings,
        booking_id: modalBooking.id,
        user_id: user.id,
        status: "completed",
      };

      const { error: insertError } = await supabase.from("earnings_payments").insert([payment]);

      if (!insertError) {
        setPayments((prev) => ({ ...prev, [modalBooking.id]: { ...payment, status: "completed" } }));
      } else {
        setError(insertError.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process withdrawal");
    } finally {
      setWithdrawingId(null);
      setModalBooking(null);
    }
  };

  // --- Earnings summary calculations ---
  let pendingCount = 0,
    pendingTotal = 0;
  let availableCount = 0,
    availableTotal = 0;
  let paidCount = 0,
    paidTotal = 0;
  bookings.forEach((booking) => {
    const bookingDate = new Date(booking.booking_date);
    const earnings = (booking.price_per_day || 0) - (booking.service_fee || 0);
    const paid = payments[booking.id]?.status === "completed";
    if (paid) {
      paidCount++;
      paidTotal += earnings;
    } else if (TODAY > bookingDate) {
      availableCount++;
      availableTotal += earnings;
    } else {
      pendingCount++;
      pendingTotal += earnings;
    }
  });

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn || !user) return <div>Sign in to view your earnings.</div>;

  return (
    <div className="p-5 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-5">Earnings from Your Spot Bookings</h1>
      {/* --- Earnings Summary Cards Row --- */}
      <div className="grid gap-6 mb-8 w-full max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* Pending Earnings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Earnings</CardTitle>
            <CalendarCheck className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pendingTotal.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{pendingCount} pending</p>
          </CardContent>
        </Card>
        {/* Available Earnings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Available Earnings</CardTitle>
            <PiggyBank className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${availableTotal.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{availableCount} available</p>
          </CardContent>
        </Card>
        {/* Paid Earnings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Paid Earnings</CardTitle>
            <Banknote className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${paidTotal.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{paidCount} paid</p>
          </CardContent>
        </Card>
        {/* Payment Methods */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Payment Methods</CardTitle>
            <CreditCard className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-base font-semibold mb-2">Your Account Name</div>
            <Button asChild variant="outline" size="sm" className="w-full">
              <a href="#">Edit Payment Methods</a>
            </Button>
          </CardContent>
        </Card>
      </div>
      {/* Table aligned to columns 2-4 */}
      <div className="grid w-full max-w-7xl" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
        <div />
        <div className="col-span-3">
          <div className="rounded-lg bg-white shadow border overflow-x-auto">
            {error && <div className="text-red-500 mb-4 p-4">{error}</div>}
            {loading ? (
              <div className="text-gray-700 p-6 text-center">Loading earnings...</div>
            ) : bookings.length === 0 ? (
              <div className="text-gray-700 p-6 text-center font-medium">No bookings found for your spots.</div>
            ) : (
              <div className="min-w-[600px] md:min-w-0">
                <Table className="text-sm md:text-base">
                  <TableCaption>All bookings for your listings</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Spot</TableHead>
                      <TableHead>Price/Day</TableHead>
                      <TableHead>Service Fee</TableHead>
                      <TableHead>Earnings</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => {
                      const bookingDate = new Date(booking.booking_date);
                      const canWithdraw = TODAY > bookingDate;
                      const earnings = (booking.price_per_day || 0) - (booking.service_fee || 0);
                      const paid = payments[booking.id]?.status === "completed";
                      return (
                        <TableRow key={booking.id}>
                          <TableCell>{bookingDate.toLocaleDateString()}</TableCell>
                          <TableCell>{booking.spot?.title || "(Untitled)"}</TableCell>
                          <TableCell>${booking.price_per_day?.toFixed(2)}</TableCell>
                          <TableCell>${booking.service_fee?.toFixed(2)}</TableCell>
                          <TableCell>
                            <span className="font-semibold">${earnings.toFixed(2)}</span>
                          </TableCell>
                          <TableCell>
                            {paid ? (
                              <Button size="sm" disabled variant="outline">
                                Paid
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                disabled={!canWithdraw || withdrawingId === booking.id}
                                onClick={() => handleWithdraw(booking)}
                              >
                                {withdrawingId === booking.id ? "Transferring..." : "Withdraw Earnings"}
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </div>
      <Dialog open={!!modalBooking} onOpenChange={() => setModalBooking(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer funds to your default account 'Fake Account Name' now?</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setModalBooking(null)} disabled={withdrawingId === modalBooking?.id}>
              Cancel
            </Button>
            <Button onClick={confirmWithdraw} disabled={withdrawingId === modalBooking?.id}>
              {withdrawingId === modalBooking?.id ? "Transferring..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
