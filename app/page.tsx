import { db } from '@/utils/supabase/client';
import { Abel } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import ListingsFilterClient from '@/app/components/ListingsFilterClient';
import { Button } from '@/app/components/ui/button';
import { ButtonProps } from '@/app/components/ui/button';
import HeroSearchForm from './components/HeroSearchForm';

const abel = Abel({ weight: '400', subsets: ['latin'] });

export default async function Home() {
  // Fetch spots with their images (if any)
  const { data: spots, error } = await db
    .from('parking_spots')
    .select('*, parking_spot_images(image_url, is_primary)')
    .eq('is_active', true);

  if (error) {
    return <div className="p-8">Error loading parking spots: {error.message}</div>;
  }

  if (!spots) {
    return <div className="p-8">Loading...</div>;
  }

  // Generate signed URLs for the first image of each spot
  const spotsWithSignedUrls = await Promise.all(
    spots.map(async spot => {
      let signedUrl = null;
      if (Array.isArray(spot.parking_spot_images) && spot.parking_spot_images.length > 0) {
        const imagePath = spot.parking_spot_images[0].image_url;
        const { data } = await db.storage
          .from('parking-spot-images')
          .createSignedUrl(imagePath.replace(/^.*parking-spot-images\//, ''), 60 * 60); // 1 hour expiry
        signedUrl = data?.signedUrl || null;
      }
      return { ...spot, signedUrl };
    })
  );

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
        <div className="absolute inset-0 flex items-center z-10">
          <div className="w-full ">
            <div className="flex flex-col max-w-7xl m-auto px-8 md:px-6 space-y-8 items-start">
              <div className="upper flex flex-col space-y-4 text-left">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white">
                    Event Parking Made Easy
                  </h1>
                  <p className="max-w-[600px] text-gray-200 md:text-xl">
                    Find and reserve the perfect parking spot for your next game or event. No more circling the block or overpaying for stadium parking.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button>
                    <Link className="text-white" href="/listings">Find Parking</Link>
                  </Button>
                  <Button asChild
                    variant="secondary"
                  >
                    <Link href="/host">List Your Spot</Link>
                  </Button>
                </div>
              </div>
              <div className="lower w-full max-w-[500px]">
                <HeroSearchForm />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="relative w-screen">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">Available Parking</h2>
          <div className="w-full py-8">
            <ListingsFilterClient spots={spotsWithSignedUrls} gridOnly />
          </div>
        </div>
      </section>
      <section className="w-full py-8 md:py-12 lg:py-16 bg-gray-50">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
              <Image
                src="/images/cars.png"
                alt="Host your parking spot"
                width={800}
                height={550}
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              />
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Earn Money With Your Parking Space
                  </h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Turn your unused driveway, garage, or parking spot into extra income. It's easy to list and start
                    earning.
                  </p>
                </div>
                <ul className="grid gap-2 py-4">
                  <li className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white">
                      1
                    </div>
                    <span>List your spot for free in minutes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white">
                      2
                    </div>
                    <span>Set your own schedule and prices</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white">
                      3
                    </div>
                    <span>Get paid directly to your bank account</span>
                  </li>
                </ul>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button>
                  <Link className="text-white" href="/host">Become a Host</Link>
                </Button>
                <Button
                  asChild
                  variant="secondary"
                >
                    <Link href="/faq">Learn More</Link>
                </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
