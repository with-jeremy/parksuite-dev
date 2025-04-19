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

export default function ParkSuitePage() {
  return (
    <main className="flex flex-col items-center">
      {/* Removed inline header and footer, relying on shared layout */}
      {/* Mid-Page Call to Action */}
      <section className="w-full py-16 bg-blue-600 text-white text-center px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Revolutionize Your Event Parking?
          </h2>
          <p className="text-lg mb-8">
            Download the ParkSuite app today and discover a smarter way to park or an easier way to earn!
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" variant="secondary">Download on the App Store</Button>
            <Button size="lg" variant="secondary">Get it on Google Play</Button>
          </div>
        </div>
      </section>
      {/* FAQ Section */}
      <section id="faq" className="w-full py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {/* General Questions */}
            <h3 className="text-2xl font-semibold mt-8 mb-4 flex items-center gap-2"><Info className="h-6 w-6 text-primary"/>General Questions</h3>
            <AccordionItem value="faq-1">
              <AccordionTrigger className="text-lg text-left">1. What is Parksuite?</AccordionTrigger>
              <AccordionContent className="text-base">
                Parksuite is a parking app that connects homeowners with available parking spaces to visitors looking for convenient parking during events. Homeowners can also offer tailgating spots for guests.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-2">
              <AccordionTrigger className="text-lg text-left">2. How does Parksuite work?</AccordionTrigger>
              <AccordionContent className="text-base">
                Homeowners list their parking spaces or tailgating spots on the app, specifying availability and pricing. Visitors can browse available spots near their event location, book a space, and pay through the app.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-3">
              <AccordionTrigger className="text-lg text-left">3. Is Parksuite available in all cities?</AccordionTrigger>
              <AccordionContent className="text-base">
                Parksuite is expanding, but availability depends on the number of homeowners listing spaces in your area. Check the app for available locations.
              </AccordionContent>
            </AccordionItem>

            {/* For Homeowners */}
            <h3 className="text-2xl font-semibold mt-8 mb-4 flex items-center gap-2"><Home className="h-6 w-6 text-green-600"/>For Homeowners (Space Owners)</h3>
            <AccordionItem value="faq-4">
              <AccordionTrigger className="text-lg text-left">4. How do I list my parking space or tailgating spot?</AccordionTrigger>
              <AccordionContent className="text-base">
                Sign up on the Parksuite app, add details about your parking space or tailgating area, set the availability and price, and publish your listing.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-5">
              <AccordionTrigger className="text-lg text-left">5. Can I set my own price for my parking space or tailgating spot?</AccordionTrigger>
              <AccordionContent className="text-base">
                Yes, you can set your own price. Parksuite may provide pricing recommendations based on demand in your area.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-6">
              <AccordionTrigger className="text-lg text-left">6. Is my parking space or tailgating spot automatically booked, or do I have to approve each request?</AccordionTrigger>
              <AccordionContent className="text-base">
                You can choose between automatic bookings or manual approval.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-7">
              <AccordionTrigger className="text-lg text-left">7. How do I receive payments?</AccordionTrigger>
              <AccordionContent className="text-base">
                Payments are processed through the app and sent to your linked bank account or digital wallet.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-8">
              <AccordionTrigger className="text-lg text-left">8. Are there any fees for listing my parking space or tailgating spot?</AccordionTrigger>
              <AccordionContent className="text-base">
                Parksuite may charge a small service fee on each transaction. Check the app for details.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-9">
              <AccordionTrigger className="text-lg text-left">9. Can I cancel a booking?</AccordionTrigger>
              <AccordionContent className="text-base">
                Yes, but frequent cancellations may impact your listing. Refund policies apply.
              </AccordionContent>
            </AccordionItem>

            {/* For Visitors */}
            <h3 className="text-2xl font-semibold mt-8 mb-4 flex items-center gap-2"><Car className="h-6 w-6 text-blue-600"/>For Visitors (Drivers & Tailgaters)</h3>
            <AccordionItem value="faq-10">
              <AccordionTrigger className="text-lg text-left">10. How do I find and book a parking space or tailgating spot?</AccordionTrigger>
              <AccordionContent className="text-base">
                Use the app’s search function to find available spaces or tailgating areas near your destination. Select a spot, book it, and pay through the app.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-11">
              <AccordionTrigger className="text-lg text-left">11. Can I book a space in advance?</AccordionTrigger>
              <AccordionContent className="text-base">
                Yes, you can book a space or tailgating spot in advance to ensure availability.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-12">
              <AccordionTrigger className="text-lg text-left">12. What happens if I arrive late?</AccordionTrigger>
              <AccordionContent className="text-base">
                Each listing has a specified rental period. If you exceed your booking time, additional charges may apply.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-13">
              <AccordionTrigger className="text-lg text-left">13. Can I cancel my booking?</AccordionTrigger>
              <AccordionContent className="text-base">
                Cancellations are subject to the space owner’s cancellation policy. Refunds vary based on timing.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-14">
              <AccordionTrigger className="text-lg text-left">14. How do I pay for parking or a tailgating spot?</AccordionTrigger>
              <AccordionContent className="text-base">
                All payments are made through the Parksuite app using a credit card, debit card, or digital wallet.
              </AccordionContent>
            </AccordionItem>

            {/* Tailgating Specific */}
            <h3 className="text-2xl font-semibold mt-8 mb-4 flex items-center gap-2"><Heater className="h-6 w-6 text-primary"/>Tailgating-Specific Questions</h3>
            <AccordionItem value="faq-15">
              <AccordionTrigger className="text-lg text-left">15. What is a tailgating spot?</AccordionTrigger>
              <AccordionContent className="text-base">
                A tailgating spot is a designated area where guests can park and set up for pre-event gatherings, including grilling, socializing, and enjoying the game-day atmosphere.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-16">
              <AccordionTrigger className="text-lg text-left">16. What amenities do tailgating spots include?</AccordionTrigger>
              <AccordionContent className="text-base">
                Each host may offer different amenities, such as space for a grill, seating areas, or access to restrooms. Check the listing for details.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-17">
              <AccordionTrigger className="text-lg text-left">17. Are there any rules for tailgating?</AccordionTrigger>
              <AccordionContent className="text-base">
                Yes, each host may have specific rules regarding noise levels, alcohol, grilling, and cleanup. Be sure to review the listing details before booking.
              </AccordionContent>
            </AccordionItem>

            {/* Security & Support */}
            <h3 className="text-2xl font-semibold mt-8 mb-4 flex items-center gap-2"><HelpCircle className="h-6 w-6 text-primary"/>Security & Support</h3>
            <AccordionItem value="faq-18">
              <AccordionTrigger className="text-lg text-left">18. Is Parksuite safe to use?</AccordionTrigger>
              <AccordionContent className="text-base">
                Yes, Parksuite verifies users and provides secure payment processing. Always check user reviews before booking.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-19">
              <AccordionTrigger className="text-lg text-left">19. What if someone parks in my reserved spot?</AccordionTrigger>
              <AccordionContent className="text-base">
                If there’s an issue, contact Parksuite’s support team for assistance.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-20">
              <AccordionTrigger className="text-lg text-left">20. How do I contact customer support?</AccordionTrigger>
              <AccordionContent className="text-base">
                You can reach Parksuite support through the app’s Help section or via email.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
      {/* Final Call to Action */}
      <section className="w-full py-20 text-center px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Get Started with ParkSuite Today!
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Stop stressing, start parking (or earning!). Download the free ParkSuite app now and make your next event experience the best one yet.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg">Download on the App Store</Button>
            <Button size="lg">Get it on Google Play</Button>
          </div>
        </div>
      </section>
    </main>
  );
}