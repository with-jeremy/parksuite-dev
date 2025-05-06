// Admin Dashboard Page
"use client";

import { useState, useEffect } from "react";
import { startOfDay, subDays } from "date-fns";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/app/components/ui/table";
import { Users, Home, CalendarCheck, PiggyBank } from "lucide-react";
import { db } from "@/utils/supabase/client";

// Table components for each card (stubbed, fetch on demand)
function ListingsTable({ data }: { data: any[] }) {
  return (
    <Table>
      <TableCaption>All Parking Listings</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Spot Name</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>City</TableHead>
          <TableHead>State</TableHead>
          <TableHead>Bookings (Pending/Completed)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.id}>
            <TableCell>{row.user_name || "-"}</TableCell>
            <TableCell>{row.title}</TableCell>
            <TableCell>{row.address}</TableCell>
            <TableCell>{row.city}</TableCell>
            <TableCell>{row.state}</TableCell>
            <TableCell>
              {row.pending || 0}/{row.completed || 0}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function BookingsTable({ data }: { data: any[] }) {
  return (
    <Table>
      <TableCaption>All Bookings</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Spot Name</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Total Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.id}>
            <TableCell>{row.user_name || "-"}</TableCell>
            <TableCell>{row.spot_title || "-"}</TableCell>
            <TableCell>{row.booking_date}</TableCell>
            <TableCell>{row.status}</TableCell>
            <TableCell>${row.total_price?.toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function EarningsTable({ data }: { data: any[] }) {
  return (
    <Table>
      <TableCaption>All Earnings/Payments</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Client Price</TableHead>
          <TableHead>Listed Price</TableHead>
          <TableHead>Host Payout</TableHead>
          <TableHead>App Earnings</TableHead>
          <TableHead>Date Booked</TableHead>
          <TableHead>Booking Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.id}>
            <TableCell>{row.user_name || "-"}</TableCell>
            <TableCell>
              {row.client_price !== undefined
                ? `$${row.client_price?.toFixed(2)}`
                : "-"}
            </TableCell>
            <TableCell>
              {row.listed_price !== undefined
                ? `$${row.listed_price?.toFixed(2)}`
                : "-"}
            </TableCell>
            <TableCell>
              {row.host_payout !== undefined
                ? `$${row.host_payout?.toFixed(2)}`
                : "-"}
            </TableCell>
            <TableCell>
              {row.app_earnings !== undefined
                ? `$${row.app_earnings?.toFixed(2)}`
                : "-"}
            </TableCell>
            <TableCell>
              {row.date_booked
                ? new Date(row.date_booked).toLocaleDateString()
                : "-"}
            </TableCell>
            <TableCell>
              {row.booking_date
                ? new Date(row.booking_date).toLocaleDateString()
                : "-"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function AdminDashboard() {
  const [active, setActive] = useState<
    "users" | "listings" | "bookings" | "earnings" | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState<any[]>([]);
  // Placeholder counts (would be fetched in real app)
  const [counts, setCounts] = useState({
    users: { new: 0, total: 0 },
    listings: { new: 0, total: 0 },
    bookings: { new: 0, total: 0 },
    earnings: {
      paidIn: 0,
      paidOut: 0,
      app: 0,
      paidInCount: 0,
      paidOutCount: 0,
    },
  });

  // Fetch summary counts on mount
  useEffect(() => {
    async function fetchCounts() {
      const now = new Date("2025-04-21T00:00:00");
      const lastWeek = subDays(startOfDay(now), 7).toISOString();
      // Users
      const { data: allUsers } = await db.from("users").select("id,created_at");
      const usersNew = (allUsers || []).filter(
        (u) => u.created_at && u.created_at >= lastWeek
      ).length;
      const usersTotal = (allUsers || []).length;
      // Listings
      const { data: allListings } = await db
        .from("parking_spots")
        .select("id,created_at");
      const listingsNew = (allListings || []).filter(
        (l) => l.created_at && l.created_at >= lastWeek
      ).length;
      const listingsTotal = (allListings || []).length;
      // Bookings
      const { data: allBookings } = await db
        .from("bookings")
        .select("id,created_at");
      const bookingsNew = (allBookings || []).filter(
        (b) => b.created_at && b.created_at >= lastWeek
      ).length;
      const bookingsTotal = (allBookings || []).length;
      // Earnings: use the same join as the table
      const { data: earnings } = await db
        .from("earnings_payments")
        .select("amount, booking:booking_id(total_price)");
      let paidIn = 0,
        paidInCount = 0,
        paidOut = 0,
        paidOutCount = 0;
      (earnings || []).forEach((e) => {
        if (e.booking?.total_price) {
          paidIn += e.booking.total_price;
          paidInCount++;
        }
        if (typeof e.amount === "number") {
          paidOut += e.amount;
          paidOutCount++;
        }
      });
      setCounts({
        users: { new: usersNew, total: usersTotal },
        listings: { new: listingsNew, total: listingsTotal },
        bookings: { new: bookingsNew, total: bookingsTotal },
        earnings: {
          paidIn: parseFloat(paidIn.toFixed(2)),
          paidInCount,
          paidOut: parseFloat(paidOut.toFixed(2)),
          paidOutCount,
          app: parseFloat((paidIn - paidOut).toFixed(2)),
        },
      });
    }
    fetchCounts();
  }, []);

  // Helper to render summary cards for each category
  function renderCategoryCards() {
    if (active === "users") {
      return (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>New Users (7d)</CardTitle>
              <CardDescription>{counts.users.new}</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Users</CardTitle>
              <CardDescription>{counts.users.total}</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
              <CardDescription>-</CardDescription>
            </CardHeader>
          </Card>
        </div>
      );
    } else if (active === "listings") {
      return (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>New Listings (7d)</CardTitle>
              <CardDescription>{counts.listings.new}</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Listings</CardTitle>
              <CardDescription>{counts.listings.total}</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
              <CardDescription>-</CardDescription>
            </CardHeader>
          </Card>
        </div>
      );
    } else if (active === "bookings") {
      return (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>New Bookings (7d)</CardTitle>
              <CardDescription>{counts.bookings.new}</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Bookings</CardTitle>
              <CardDescription>{counts.bookings.total}</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
              <CardDescription>-</CardDescription>
            </CardHeader>
          </Card>
        </div>
      );
    } else if (active === "earnings") {
      return (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Paid In</CardTitle>
              <CardDescription>
                ${counts.earnings.paidIn} ({counts.earnings.paidInCount})
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Paid Out</CardTitle>
              <CardDescription>
                ${counts.earnings.paidOut} ({counts.earnings.paidOutCount})
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>App Earnings</CardTitle>
              <CardDescription>
                ${counts.earnings.app.toFixed(2)}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      );
    }
    return null;
  }

  // Fetch data for each card on click
  async function handleCardClick(
    type: "users" | "listings" | "bookings" | "earnings"
  ) {
    setActive(type);
    setLoading(true);
    if (type === "listings") {
      // Fetch all parking spots with user and booking counts
      const { data: spots } = await db.from("parking_spots").select("*");
      // Simulate user_name and booking counts (replace with real joins in production)
      const rows = (spots || []).map((s: any) => ({
        ...s,
        user_name: "User", // Placeholder
        pending: Math.floor(Math.random() * 3),
        completed: Math.floor(Math.random() * 10),
      }));
      setTableData(rows);
    } else if (type === "bookings") {
      // Fetch all bookings with user and spot info
      const { data: bookings } = await db.from("bookings").select("*");
      const rows = (bookings || []).map((b: any) => ({
        ...b,
        user_name: "User", // Placeholder
      }));
      setTableData(rows);
    } else if (type === "earnings") {
      // Fetch all earnings_payments and join booking.total_price
      const { data: earnings } = await db
        .from("earnings_payments")
        .select(
          "*, booking:booking_id(total_price, booking_date, created_at, price_per_day)"
        );
      const rows = (earnings || []).map((e: any) => {
        const client_price = e.booking?.total_price;
        const host_payout = e.amount;
        return {
          ...e,
          user_name: "User", // Placeholder
          client_price,
          listed_price: e.booking?.price_per_day,
          host_payout,
          app_earnings:
            typeof client_price === "number" && typeof host_payout === "number"
              ? client_price - host_payout
              : undefined,
          booking_date: e.booking?.booking_date,
          date_booked: e.booking?.created_at,
        };
      });
      setTableData(rows);
    } else if (type === "users") {
      // Placeholder: no user table yet
      setTableData([]);
    }
    setLoading(false);
  }

  return (
    <div className="p-8 min-h-screen bg-slate-50">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-4 gap-6 mb-8">
        {/* Column 1: Cards */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription className="mt-2">
                  New: {counts.users.new} | Total: {counts.users.total}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => handleCardClick("users")}
              >
                View Users
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <Home className="h-8 w-8 text-green-600" />
              <div>
                <CardTitle>Listings</CardTitle>
                <CardDescription className="mt-2">
                  New: {counts.listings.new} | Total: {counts.listings.total}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => handleCardClick("listings")}
              >
                View Listings
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <CalendarCheck className="h-8 w-8 text-yellow-600" />
              <div>
                <CardTitle>Bookings</CardTitle>
                <CardDescription className="mt-2">
                  New: {counts.bookings.new} | Total: {counts.bookings.total}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => handleCardClick("bookings")}
              >
                View Bookings
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <PiggyBank className="h-8 w-8 text-purple-600" />
              <div>
                <CardTitle>Earnings</CardTitle>
                <CardDescription className="mt-2">
                  In: ${counts.earnings.paidIn} ({counts.earnings.paidInCount})
                  / Out: ${counts.earnings.paidOut} (
                  {counts.earnings.paidOutCount}) / App: $
                  {counts.earnings.app.toFixed(2)}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => handleCardClick("earnings")}
              >
                View Earnings
              </Button>
            </CardContent>
          </Card>
        </div>
        {/* Columns 2-4: Table */}
        <div className="col-span-3">
          <div className="rounded-lg bg-white shadow border min-h-[400px] p-6">
            {active && renderCategoryCards()}
            {loading ? (
              <div className="text-center text-gray-500 py-12">Loading...</div>
            ) : active === "listings" ? (
              <ListingsTable data={tableData} />
            ) : active === "bookings" ? (
              <BookingsTable data={tableData} />
            ) : active === "earnings" ? (
              <EarningsTable data={tableData} />
            ) : active === "users" ? (
              <div className="text-center text-gray-500 py-12">
                User management coming soon.
              </div>
            ) : (
              <div className="text-center text-gray-400 py-12">
                Select a card to view data.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
