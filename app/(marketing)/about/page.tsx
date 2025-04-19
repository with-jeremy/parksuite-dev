// src/app/page.tsx (or your desired page route)
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Assuming Radix UI components are aliased like this
import { Button } from '@/app/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/app/components/ui/accordion';

// Icons (using lucide-react for example)
import { MapPin, CalendarCheck, PiggyBank, Car, Home, Settings, CircleDollarSign, ShieldCheck, Search, BookUser, ParkingCircle, Heater, Info, HelpCircle, Users, Code } from 'lucide-react';

// Constants for image URLs
const HERO_IMAGE_URL = '/images/hero.jpg';
const TAILGATE_IMAGE_URL = '/images/cars.png';
const BRIANNA_ERIN_LOGO_URL = '/images/logo.png';
const WITH_JEREMY_LOGO_URL = '/images/wj_wj_nobg.png';

export default function Page() {
  return (
    <div>
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center py-20 md:py-32 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Unlock Gameday & Event Parking Bliss
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto">
            Stop circling the block! ParkSuite connects you directly with residents near the action offering convenient, pre-bookable parking and unique tailgating spots. Turn your empty driveway into cash or find the perfect spot hassle-free.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link href="#find-spot">Find My Perfect Spot</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white bg-blue-900 hover:text-blue-700" asChild>
              <Link href="#list-space">List My Space & Earn</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="w-full py-16 md:py-24 px-4 bg-slate-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            Simple Parking & Earning in 3 Steps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* For Visitors */}
            <Card className="text-left">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Search className="h-6 w-6 text-blue-600" />
                  For Visitors (Drivers & Tailgaters)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-lg">
                <p><strong className="font-semibold">1. Search:</strong> Enter your event location and date in the ParkSuite app.</p>
                <p><strong className="font-semibold">2. Book:</strong> Browse available driveways, yards, or designated tailgating spots. Check details, reviews, and book instantly.</p>
                <p><strong className="font-semibold">3. Park & Enjoy:</strong> Arrive, park in your reserved spot using the app details, and focus on the fun!</p>
              </CardContent>
            </Card>

            {/* For Homeowners */}
            <Card className="text-left">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                 <Home className="h-6 w-6 text-green-600" />
                  For Homeowners (Space Owners)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-lg">
                 <p><strong className="font-semibold">1. List:</strong> Easily add your parking space or tailgating area details, photos, availability, and price on the app.</p>
                 <p><strong className="font-semibold">2. Approve (Optional):</strong> Choose automatic bookings or manually approve requests – you're in control.</p>
                 <p><strong className="font-semibold">3. Earn:</strong> Welcome visitors and receive secure payments directly through ParkSuite after each successful booking.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits for Visitors Section */}
      <section id="find-spot" className="w-full py-16 md:py-24 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Score Big Savings & Convenience
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <Card>
              <CardHeader>
                <CalendarCheck className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Reserve Ahead</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Lock in your spot days or weeks in advance (FAQ Q11). Arrive relaxed knowing parking is handled.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <MapPin className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Park Closer</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Discover hidden gem spots in residential areas, often closer than traditional lots (FAQ Q10).</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <PiggyBank className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Affordable Prices</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Compare homeowner-set prices for great value. Pay securely in-app (FAQ Q14).</p>
              </CardContent>
            </Card>
             <Card>
              <CardHeader>
                <Heater className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Tailgating Options</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Find dedicated tailgating spots to set up your pre-game party (FAQ Q1, Q15, Q16).</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits for Homeowners Section */}
       <section id="list-space" className="w-full py-16 md:py-24 px-4 bg-slate-50">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Turn Your Empty Space into Easy Income
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <Card>
              <CardHeader>
                 <CircleDollarSign className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Monetize Your Space</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Effortlessly earn cash renting your unused driveway or yard during events (FAQ Q1).</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Settings className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>You're In Control</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Set prices (FAQ Q5), availability, rules (FAQ Q17), and booking preferences (FAQ Q6).</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <BookUser className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Simple Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p>List easily via our app. Manage bookings and track earnings simply (FAQ Q4).</p>
              </CardContent>
            </Card>
             <Card>
              <CardHeader>
                <ShieldCheck className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Secure Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Receive secure, direct payments through the app – no cash handling (FAQ Q7, Q18).</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

       {/* Tailgating Spotlight Section */}
      <section className="w-full py-16 md:py-24 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Host or Find the Ultimate Pregame Party Spot!
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            ParkSuite isn't just about parking – it's about the *experience*!
          </p>
           {/* Placeholder Image */}
           <div className="mb-10 aspect-video max-w-3xl mx-auto bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
             <Image src={TAILGATE_IMAGE_URL} alt="Tailgating with ParkSuite" width={800} height={450} className="rounded-lg object-cover" />
             {/* Tailgate Image Placeholder */}
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-4xl mx-auto">
             <div className="bg-slate-50 p-6 rounded-lg">
               <h3 className="text-xl font-semibold mb-3 flex items-center gap-2"><Home className="h-5 w-5 text-green-600"/>For Homeowners:</h3>
               <p>Offer more than just parking! Designate a specific area for tailgating (FAQ Q1, Q4) and attract fans looking for the perfect spot to grill and socialize (FAQ Q15). Set clear rules (FAQ Q17) and highlight amenities (FAQ Q16).</p>
             </div>
             <div className="bg-slate-50 p-6 rounded-lg">
               <h3 className="text-xl font-semibold mb-3 flex items-center gap-2"><Car className="h-5 w-5 text-blue-600"/>For Visitors:</h3>
               <p>Need space for your pre-game setup? Use ParkSuite to find unique residential tailgating spots (FAQ Q10). Check listings for space, amenities, and host rules (FAQ Q16, Q17) to find your perfect party base.</p>
             </div>
           </div>
        </div>
      </section>
       {/* About the Team Section */}
       <section className="w-full py-16 md:py-24 px-4 bg-slate-50">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Meet the Minds Behind ParkSuite
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-start">
            {/* Brianna & Erin */}
            <div className="flex flex-col items-center text-center md:items-start md:text-left">
                <div className="w-24 h-24 mb-4 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white">
                 {/* Placeholder Logo/Image */}
                  {/* <Image src={BRIANNA_ERIN_LOGO_URL} alt="Brianna and Erin LLC Logo" width={96} height={96} className="rounded-full object-contain"/> */}
                  <Users className="h-12 w-12"/>
                </div>
                <h3 className="text-xl font-semibold mb-2">The Visionaries: Brianna and Erin, LLC</h3>
                <p className="text-muted-foreground">
                   As avid event-goers themselves, Brianna and Erin grew tired of the constant struggle and expense of finding decent parking near their favorite venues. They saw countless unused driveways and realized there had to be a better way. Driven by a passion for simplifying the event experience for both attendees and local residents, they founded ParkSuite to create a seamless, community-driven solution for short-term parking and tailgating.
                </p>
            </div>

             {/* With Jeremy */}
             <div className="flex flex-col items-center text-center md:items-start md:text-left">
                <div className="w-24 h-24 mb-4 rounded-full bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center text-white">
                  {/* Placeholder Logo/Image */}
                   {/* <Image src={WITH_JEREMY_LOGO_URL} alt="With Jeremy Logo" width={96} height={96} className="rounded-full object-contain"/> */}
                   <Code className="h-12 w-12"/>
                </div>
                <h3 className="text-xl font-semibold mb-2">The Developers: With Jeremy</h3>
                <p className="text-muted-foreground mb-3">
                  Bringing the ParkSuite vision to life required exceptional technical expertise and a focus on user experience. That's where With Jeremy came in. Led by Jeremy, a seasoned app developer with a knack for building intuitive and reliable mobile platforms, his team transformed the ParkSuite concept into the smooth, secure, and easy-to-use app you see today. Their commitment ensures ParkSuite works flawlessly for every booking.
                </p>
                 <Link href="https://withjeremy.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                   Visit them at: https://withjeremy.com
                 </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
