import { Abel } from 'next/font/google';
import Image from 'next/image';
import Footer from "@/app/components/Footer";

import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';

import Link from 'next/link';
import './globals.css';

const abel = Abel({ weight: '400', subsets: ['latin'] });

const navLinks = [
  { href: "/listings", label: "Find Parking" },
  { href: "/host", label: "Become a Host" },
];

export const metadata = {
  title: 'ParkSuite',
  description: 'Event Parking Made Easy',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${abel.className} bg-background text-foreground antialiased`}>
          <nav className="bg-background border-b border-blood">
            <div className="max-w-7xl mx-auto w-full flex items-center justify-between py-4 px-4">
              {/* Logos aligned to the left */}
              <Link href="/" className="flex items-center gap-2">
                               <Image
                  src="/images/logo.png"
                  alt="ParkSuite"
                  width={200}
                  height={64}
                  className="h-12 object-contain"
                />
              </Link>
              {/* Centered navigation for larger screens */}
              <nav className="hidden md:flex items-center justify-center gap-6">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="text-lg text-foreground font-medium hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                ))}
              </nav>
              {/* auth aligned to the right */}
              <div className="auth-nav flex items-center text-foreground space-x-4">
                <SignedOut>
                  <SignInButton />
                </SignedOut>
                <SignedIn>
                  <Link href="/dashboard" className="text-lg text-foreground font-medium hover:text-primary transition-colors">Dashboard</Link>
                  <UserButton />
                </SignedIn>
              </div>
            </div>
          </nav>
          <main className="mx-auto">{children}</main>
          <Footer /> {/* Added Footer component here */}
        </body>
      </html>
    </ClerkProvider>
  );
}