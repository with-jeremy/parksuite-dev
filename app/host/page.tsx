import Link from "next/link"
import Image from "next/image"
import { Car, Check, ChevronRight, DollarSign, Shield, Star } from "lucide-react"

import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Textarea } from "@/app/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Label } from "@/app/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Checkbox } from "@/app/components/ui/checkbox"
import { MainNav } from "@/app/components/main-nav"

export default function HostPage() {
  return (
    <div className="flex flex-col min-h-screen mx-auto max-w-7xl">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Turn Your Parking Space Into Cash
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Earn money by renting out your unused driveway, garage, or parking spot for game days and events.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <a
                    href="#get-started"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  >
                    Get Started
                  </a>
                  <Link
                    href="/host-faq"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
              <div className="mx-auto w-full max-w-[500px] lg:max-w-none">
                <Card className="border-none shadow-xl">
                  <CardHeader>
                    <CardTitle>How much could you earn?</CardTitle>
                    <CardDescription>
                      Estimate your potential earnings based on your location and events
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="venue">Nearest Venue</Label>
                        <Select>
                          <SelectTrigger id="venue">
                            <SelectValue placeholder="Select a venue" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="att">AT&T Stadium</SelectItem>
                            <SelectItem value="sofi">SoFi Stadium</SelectItem>
                            <SelectItem value="bryant">Bryant-Denny Stadium</SelectItem>
                            <SelectItem value="msg">Madison Square Garden</SelectItem>
                            <SelectItem value="crypto">Crypto.com Arena</SelectItem>
                            <SelectItem value="ohio">Ohio Stadium</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="distance">Distance from Venue</Label>
                        <Select>
                          <SelectTrigger id="distance">
                            <SelectValue placeholder="Select distance" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0.25">Less than 0.25 miles</SelectItem>
                            <SelectItem value="0.5">0.25 - 0.5 miles</SelectItem>
                            <SelectItem value="1">0.5 - 1 mile</SelectItem>
                            <SelectItem value="2">1 - 2 miles</SelectItem>
                            <SelectItem value="3">More than 2 miles</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="type">Parking Type</Label>
                        <Select>
                          <SelectTrigger id="type">
                            <SelectValue placeholder="Select parking type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="driveway">Driveway</SelectItem>
                            <SelectItem value="garage">Garage</SelectItem>
                            <SelectItem value="lot">Parking Lot</SelectItem>
                            <SelectItem value="street">Street Parking</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="pt-4">
                        <Card className="bg-muted">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold">Potential Earnings</h3>
                                <p className="text-sm text-muted-foreground">Per event</p>
                              </div>
                              <div className="text-right">
                                <span className="text-2xl font-bold">$45 - $75</span>
                                <p className="text-sm text-muted-foreground">Before fees</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      <Button className="w-full">Calculate with Your Address</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Why Host with ParkSpot?</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Join thousands of hosts earning extra income from their unused parking spaces
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
                    Turn your unused parking space into a steady source of income, especially during game days and
                    events.
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
                    Our platform includes insurance coverage and verified users for your peace of mind.
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
                    You decide when your space is available and how much to charge. Full control, always.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
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
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Listing your parking space is simple and takes just a few minutes
                  </p>
                </div>
                <ul className="grid gap-6">
                  <li className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      1
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold">Create your listing</h3>
                      <p className="text-muted-foreground">
                        Add photos, description, and set your availability and pricing
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      2
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold">Receive bookings</h3>
                      <p className="text-muted-foreground">
                        Get notified when someone books your space and confirm or decline
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      3
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold">Get paid</h3>
                      <p className="text-muted-foreground">
                        Payments are automatically processed and deposited to your account
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section id="get-started" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">List Your Parking Space</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Get started in minutes and start earning from your unused parking space
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-3xl py-12">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="pricing">Pricing</TabsTrigger>
                </TabsList>
                <TabsContent value="basic" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Listing Title</Label>
                    <Input id="title" placeholder="e.g. Private Driveway Near AT&T Stadium" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" placeholder="Street Address" />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="City" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input id="state" placeholder="State" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input id="zip" placeholder="ZIP Code" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="venue">Nearest Venue</Label>
                      <Select>
                        <SelectTrigger id="venue">
                          <SelectValue placeholder="Select a venue" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="att">AT&T Stadium</SelectItem>
                          <SelectItem value="sofi">SoFi Stadium</SelectItem>
                          <SelectItem value="bryant">Bryant-Denny Stadium</SelectItem>
                          <SelectItem value="msg">Madison Square Garden</SelectItem>
                          <SelectItem value="crypto">Crypto.com Arena</SelectItem>
                          <SelectItem value="ohio">Ohio Stadium</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button>
                      Continue <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="details" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Describe your parking space..." className="min-h-[120px]" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Parking Type</Label>
                    <Select>
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select parking type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="driveway">Driveway</SelectItem>
                        <SelectItem value="garage">Garage</SelectItem>
                        <SelectItem value="lot">Parking Lot</SelectItem>
                        <SelectItem value="street">Street Parking</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Features</Label>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="tailgating" />
                        <label
                          htmlFor="tailgating"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Tailgating Allowed
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="covered" />
                        <label
                          htmlFor="covered"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Covered Parking
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="security" />
                        <label
                          htmlFor="security"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Security
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="shuttle" />
                        <label
                          htmlFor="shuttle"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Shuttle Service
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="ev" />
                        <label
                          htmlFor="ev"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          EV Charging
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="inout" />
                        <label
                          htmlFor="inout"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          In/Out Privileges
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Photos</Label>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div className="flex h-32 items-center justify-center rounded-md border border-dashed">
                        <Button variant="ghost">Upload Photo</Button>
                      </div>
                      <div className="flex h-32 items-center justify-center rounded-md border border-dashed">
                        <Button variant="ghost">Upload Photo</Button>
                      </div>
                      <div className="flex h-32 items-center justify-center rounded-md border border-dashed">
                        <Button variant="ghost">Upload Photo</Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button>
                      Continue <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="pricing" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price per Day</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                      <Input id="price" type="number" placeholder="45" className="pl-7" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Availability</Label>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="start">Check-in Time</Label>
                        <Input id="start" type="time" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="end">Check-out Time</Label>
                        <Input id="end" type="time" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Available for Events</Label>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="football" />
                        <label
                          htmlFor="football"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Football Games
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="basketball" />
                        <label
                          htmlFor="basketball"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Basketball Games
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="concerts" />
                        <label
                          htmlFor="concerts"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Concerts
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="conventions" />
                        <label
                          htmlFor="conventions"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Conventions
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Card className="bg-muted">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <h3 className="font-semibold">Estimated Earnings</h3>
                          <div className="flex items-center justify-between">
                            <span>Price per day</span>
                            <span>$45.00</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Service fee (15%)</span>
                            <span>-$6.75</span>
                          </div>
                          <div className="flex items-center justify-between font-semibold">
                            <span>You earn</span>
                            <span>$38.25</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="flex justify-end">
                    <Button>Create Listing</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Hear From Our Hosts</h2>
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
                    "I've made over $2,000 in the last football season just by renting out my driveway for Cowboys
                    games. It's the easiest money I've ever made!"
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
                    "I live near SoFi Stadium and started renting my garage for events. It's been amazing! The extra
                    income helps with my mortgage, and the ParkSpot platform makes it so easy."
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
                    "Game days at Alabama used to be a parking nightmare. Now I make money from my driveway and help
                    fans find convenient parking. It's a win-win!"
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Ready to start earning?
                  </h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Join thousands of hosts making extra income from their parking spaces. It's free to list and only
                    takes a few minutes to get started.
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
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  >
                    List Your Space
                  </a>
                  <Link
                    href="/host-faq"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
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
  )
}

