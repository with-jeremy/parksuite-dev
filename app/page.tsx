import { db } from '@/lib/supabaseClient';
import { Dancing_Script, Abel } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';

const abel = Abel({ weight: '400', subsets: ['latin'] });
const dancingScript = Dancing_Script({ subsets: ['latin'] });

export default async function Home() {
  
  return (
    <>
      <section className="relative w-screen h-screen min-h-[600px] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero.jpg"
            alt="Dodger Stadium aerial view at sunset"
            fill
            className="object-cover brightness-[0.4]"
            priority
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-full max-w-7xl px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white">
                    Event Parking Made Easy
                  </h1>
                  <p className="max-w-[600px] text-gray-200 md:text-xl">
                    Find and reserve the perfect parking spot for your next game or event. No more circling the block or overpaying for stadium parking.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="/listings"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  >
                    Find Parking
                  </Link>
                  <Link
                    href="/host"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-white bg-transparent px-8 text-sm font-medium text-white shadow-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  >
                    List Your Spot
                  </Link>
                </div>
              </div>
              <div className="mx-auto w-full max-w-[500px] lg:max-w-none">
                <div className="border-none shadow-xl rounded-lg bg-white/90">
                  <div className="p-6">
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold">Find your spot</h3>
                      <div className="grid w-full grid-cols-3 mb-4">
                        <button className="py-2 font-semibold border-b-2 border-primary text-primary">Event</button>
                        <button className="py-2 font-semibold text-gray-500">Venue</button>
                        <button className="py-2 font-semibold text-gray-500">Neighborhood</button>
                      </div>
                      <div className="space-y-4 pt-4">
                        <div className="grid gap-2">
                          <label htmlFor="event" className="text-sm font-medium leading-none">Event</label>
                          <input id="event" placeholder="e.g. Cowboys vs Eagles" className="w-full p-2 border rounded" />
                        </div>
                        <div className="grid gap-2">
                          <label htmlFor="date" className="text-sm font-medium leading-none">Date</label>
                          <div className="flex items-center gap-2">
                            <span className="h-4 w-4 opacity-50 inline-block bg-gray-300 rounded" />
                            <input id="date" type="date" className="w-full p-2 border rounded" />
                          </div>
                        </div>
                        <button className="w-full bg-primary text-white py-2 rounded mt-2">Search Parking</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="container mx-auto px-4 py-8">
        <div className="text-2xl text-blood mb-8">Upcoming Shows</div>
        <div className="w-full">
          asdf
        </div>
      </div>
    </>
  );
}
