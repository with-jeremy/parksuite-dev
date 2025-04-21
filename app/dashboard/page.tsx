"use client";

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { db } from '@/lib/supabaseClient';
import { Calendar, Car, MapPin, CreditCard } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [hostListings, setHostListings] = useState([]);
  const [hostEarnings, setHostEarnings] = useState(0);

  useEffect(() => {
    if (!isLoaded || !user) return;
    // Fetch upcoming bookings
    db.from('bookings')
      .select('id, booking_date, parking_spots (id, title, city, state)')
      .eq('user_id', user.id)
      .gte('booking_date', new Date().toISOString())
      .order('booking_date', { ascending: true })
      .then(({ data }) => setUpcomingBookings(data || []));
    // Fetch host listings (parking spots)
    db.from('parking_spots')
      .select('id, title, is_active')
      .eq('owner_id', user.id)
      .then(async ({ data }) => {
        setHostListings(data || []);
        if (!user.id) {
          setHostEarnings(0);
          return;
        }
        // Fetch earnings_payments for this user with status 'earned'
        db.from('earnings_payments')
          .select('amount')
          .eq('user_id', user.id)
          .eq('status', 'earned')
          .then(({ data: earnings, error }) => {
            if (error || !earnings) {
              setHostEarnings(0);
              return;
            }
            let total = 0;
            for (const e of earnings) {
              total += e.amount || 0;
            }
            setHostEarnings(total);
          });
      });
  }, [isLoaded, user]);

  if (!isLoaded) return <div>Loading...</div>;
  if (!user) return <div>Please sign in to view your dashboard.</div>;

  return (
    <div className="p-5 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-5">User Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 w-full max-w-6xl">
        {/* Find Parking Card (1st) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Find Parking</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Search for parking spots near your destination</p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link href="/listings">Browse Listings</Link>
            </Button>
          </CardFooter>
        </Card>
        {/* Upcoming Bookings Card (2nd) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingBookings?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Parking reservations</p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link href="/dashboard/bookings">View All</Link>
            </Button>
          </CardFooter>
        </Card>
        {/* Become a Host/Your Listings Card (3rd) */}
        {hostListings && hostListings.length > 0 ? (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your Listings</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hostListings?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Active parking spots</p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full" asChild>
                <Link href="/dashboard/spots">Host Dashboard</Link>
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Become a Host</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Earn money by renting out your parking space</p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full" asChild>
                <Link href="/host">Learn More</Link>
              </Button>
            </CardFooter>
          </Card>
        )}
        {/* Host Earnings Card (4th, always shown) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Host Earnings</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${hostEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Available Now</p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link href="/dashboard/earnings">View Earnings Details</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      <div className="grid gap-6 mt-8 md:grid-cols-2 w-full max-w-6xl">
        {/* Upcoming Bookings (left) */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Bookings</CardTitle>
            <CardDescription>Your next parking reservations</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingBookings && upcomingBookings.length > 0 ? (
              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{booking.parking_spots?.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.parking_spots?.city}, {booking.parking_spots?.state} •{' '}
                        {new Date(booking.booking_date).toLocaleDateString()}
                      </p>
                    </div>
                    <Link
                      href={`/listings/${booking.parking_spots.id}`}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      See Listing Details
                    </Link>
                    <button
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                      onClick={() => {
                        const address = [booking.parking_spots.address, booking.parking_spots.city, booking.parking_spots.state].filter(Boolean).join(", ");
                        if (address) {
                          const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
                          window.open(url, '_blank');
                        } else {
                          alert('No address available for directions.');
                        }
                      }}
                      type="button"
                    >
                      Get Directions
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <p>No upcoming bookings</p>
                <Button variant="outline" size="sm" className="mt-2" asChild>
                  <Link href="/listings">Find Parking</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        {/* Your Listings (right) */}
        {hostListings && hostListings.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Your Listings</CardTitle>
              <CardDescription>Manage your parking spots</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hostListings.map((listing) => (
                  <div
                    key={listing.id}
                    className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{listing.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Status: {listing.is_active ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/host/dashboard/listings/${listing.id}`}>Edit</Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href="/host/dashboard">Go to Host Dashboard</Link>
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}