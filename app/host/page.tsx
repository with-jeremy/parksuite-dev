import Link from "next/link";
import Image from "next/image";
import {
  BookUser,
  Car,
  Check,
  ChevronRight,
  CircleDollarSign,
  DollarSign,
  Settings,
  ShieldCheck,
  Shield,
  Star,
} from "lucide-react";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Checkbox } from "@/app/components/ui/checkbox";

export default function HostPage() {
  return (
    <div className="flex flex-col min-h-screen mx-auto w-full">
      <main className="flex-1">
        {/* Hero Section with background image */}
        <section className="w-full py-12 md:py-24 lg:py-32 relative bg-primary/10 border-b border-primary/20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero.jpg"
              alt="Host your parking spot hero"
              fill
              className="object-cover object-center w-full h-full opacity-60"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-primary/30 to-white/80" />
          </div>
          <div className="container px-4 max-w-7xl m-auto md:px-6 relative z-10">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Turn Your Parking Space Into Cash
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Earn money by renting out your unused driveway, garage, or
                    parking spot for game days and events.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="/dashboard/spots/create"
                    className="inline-flex text-white h-10 items-center justify-center rounded-md bg-primary px-8 text-lg font-semibold shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  >
                    Get Started
                  </Link>
                  <Link
                    href="/host-faq"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-lg font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
              <div className="mx-auto w-full max-w-[500px] lg:max-w-none"></div>
            </div>
          </div>
        </section>
        {/* Why Host Section - white bg */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white border-b border-primary/10">
          <div className="container max-w-7xl m-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Why Host with ParkSpot?
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Join thousands of hosts earning extra income from their unused
                  parking spaces
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <DollarSign className="h-10 w-10 text-primary" />
                  <CardTitle className="mt-2">Earn Extra Income</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Turn your unused parking space into a steady source of
                    income, especially during game days and events.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <Shield className="h-10 w-10 text-primary" />
                  <CardTitle className="mt-2">Safe & Secure</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our platform includes insurance coverage and verified users
                    for your peace of mind.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <Star className="h-10 w-10 text-primary" />
                  <CardTitle className="mt-2">Flexible Control</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    You decide when your space is available and how much to
                    charge. Full control, always.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        {/* How It Works Section - gradient bg */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-primary/5 via-white to-primary/10 border-b border-primary/10">
          <div className="container max-w-7xl m-auto px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
              <Image
                src="/images/cars.png"
                alt="Host your parking spot"
                width={800}
                height={550}
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
              />
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    How It Works
                  </h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Listing your parking space is simple and takes just a few
                    minutes
                  </p>
                </div>
                <ul className="grid gap-6">
                  <li className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                      1
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold">Create your listing</h3>
                      <p className="text-muted-foreground">
                        Add photos, description, and set your availability and
                        pricing
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                      2
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold">Receive bookings</h3>
                      <p className="text-muted-foreground">
                        Get notified when someone books your space and confirm
                        or decline
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                      3
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold">Get paid</h3>
                      <p className="text-muted-foreground">
                        Payments are automatically processed and deposited to
                        your account
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        {/* Get Started Section - white bg */}
        <section
          id="get-started"
          className="w-full py-12 md:py-24 lg:py-32 bg-white border-b border-primary/10"
        >
          <div className="container max-w-7xl m-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  List Your Parking Space
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Get started in minutes and start earning from your unused
                  parking space
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-3xl py-12 flex justify-center">
              <Button className="text-lg px-8 py-4" asChild>
                <Link href="/dashboard/spots/create">Get Started</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              <Card>
                <CardHeader>
                  <CircleDollarSign className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Monetize Your Space</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Effortlessly earn cash renting your unused driveway or yard
                    during events.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Settings className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>You're In Control</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Set prices, availability, rules, and booking preferences.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <BookUser className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Simple Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    List easily via our app. Manage bookings and track earnings
                    simply.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <ShieldCheck className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Secure Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Receive secure, direct payments through the app – no cash
                    handling.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        {/* Testimonials Section - light primary bg */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary/5 border-b border-primary/10">
          <div className="container max-w-7xl m-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Hear From Our Hosts
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Real stories from people earning extra income with ParkSpot
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Image
                      src="/images/cars.png"
                      alt="Host"
                      width={60}
                      height={60}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <CardTitle className="text-lg">Michael S.</CardTitle>
                      <CardDescription>Dallas, TX</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <Star className="h-4 w-4 fill-primary text-primary" />
                  </div>
                  <p className="text-muted-foreground">
                    "I've made over $2,000 in the last football season just by
                    renting out my driveway for Cowboys games. It's the easiest
                    money I've ever made!"
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Image
                      src="/images/cars.png"
                      alt="Host"
                      width={60}
                      height={60}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <CardTitle className="text-lg">Sarah T.</CardTitle>
                      <CardDescription>Los Angeles, CA</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <Star className="h-4 w-4 fill-primary text-primary" />
                  </div>
                  <p className="text-muted-foreground">
                    "I live near SoFi Stadium and started renting my garage for
                    events. It's been amazing! The extra income helps with my
                    mortgage, and the ParkSpot platform makes it so easy."
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Image
                      src="/images/cars.png"
                      alt="Host"
                      width={60}
                      height={60}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <CardTitle className="text-lg">Robert K.</CardTitle>
                      <CardDescription>Tuscaloosa, AL</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <Star className="h-4 w-4 fill-primary text-primary" />
                  </div>
                  <p className="text-muted-foreground">
                    "Game days at Alabama used to be a parking nightmare. Now I
                    make money from my driveway and help fans find convenient
                    parking. It's a win-win!"
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        {/* Final CTA Section - gradient bg */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-tl from-primary/10 via-white to-primary/5">
          <div className="container max-w-7xl m-auto px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Ready to start earning?
                  </h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Join thousands of hosts making extra income from their
                    parking spaces. It's free to list and only takes a few
                    minutes to get started.
                  </p>
                </div>
                <ul className="grid gap-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Free to list your space</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Set your own schedule and prices</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Get paid directly to your bank account</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>$1,000,000 host liability insurance</span>
                  </li>
                </ul>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <a
                    href="#get-started"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-xl font-medium text-white shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  >
                    List Your Space
                  </a>
                  <Link
                    href="/host-faq"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-xl font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
              <div className="mx-auto w-full max-w-[500px] lg:max-w-none">
                <Image
                  src="/images/cars.png"
                  alt="Host your parking spot"
                  width={800}
                  height={550}
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
