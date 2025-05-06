import { Abel } from "next/font/google";
import Image from "next/image";
import Footer from "@/app/components/Footer";

import { ClerkProvider, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import Link from "next/link";
import "./globals.css";

const abel = Abel({ weight: "400", subsets: ["latin"] });

const navLinks = [
  { href: "/listings", label: "Find Parking" },
  { href: "/host", label: "Become a Host" },
];

export const metadata = {
  title: "ParkSuite",
  description: "Event Parking Made Easy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${abel.className} bg-background text-foreground antialiased`}
        >
          <header className="sticky top-0 z-40 bg-background border-b border-blood py-2">
            {/* Responsive nav container */}
            <nav className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0 pr-4">
              {/* Logo + Auth row (mobile: both, sm+: only logo) */}
              <div className="w-full flex justify-between items-center">
                <Link href="/" className="block w-auto">
                  <Image
                    src="/images/logo.png"
                    alt="ParkSuite"
                    width={200}
                    height={64}
                    className="h-20 w-full max-w-xs object-contain sm:w-[200px] sm:mx-0"
                  />
                </Link>
                {/* Auth segment: right on mobile, hidden on sm+ */}
                <div className="flex items-center space-x-4 sm:hidden auth-nav text-foreground">
                  <SignedOut>
                    <Link
                      href="/sign-in"
                      className="text-lg text-foreground font-medium hover:text-primary transition-colors"
                    >
                      Sign In
                    </Link>
                  </SignedOut>
                  <SignedIn>
                    <Link
                      href="/dashboard"
                      className="text-lg text-foreground font-medium hover:text-primary transition-colors"
                    >
                      Dashboard
                    </Link>
                    <UserButton />
                  </SignedIn>
                </div>
              </div>
              {/* Menu + Auth row for mobile, flex-row for sm+ */}
              <div className="relative w-full flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 sm:mt-0">
                {/* Menu row: centered with separator on mobile, center on sm+ */}
                <div className="flex w-full justify-center items-center gap-0 sm:justify-center sm:gap-6 sm:flex-1">
                  <Link
                    href={navLinks[0].href}
                    className="text-lg text-foreground font-medium hover:text-primary transition-colors"
                  >
                    {navLinks[0].label}
                  </Link>
                  <span className="px-2 text-muted-foreground select-none">
                    |
                  </span>
                  <Link
                    href={navLinks[1].href}
                    className="text-lg text-foreground font-medium hover:text-primary transition-colors"
                  >
                    {navLinks[1].label}
                  </Link>
                </div>
                {/* Auth segment: right on sm+, hidden on mobile */}
                <div className="hidden sm:flex items-center space-x-4 auth-nav text-foreground sm:w-auto">
                  <SignedOut>
                    <Link
                      href="/sign-in"
                      className="text-lg text-foreground font-medium hover:text-primary transition-colors"
                    >
                      Sign In
                    </Link>
                  </SignedOut>
                  <SignedIn>
                    <Link
                      href="/dashboard"
                      className="text-lg text-foreground font-medium hover:text-primary transition-colors"
                    >
                      Dashboard
                    </Link>
                    <UserButton />
                  </SignedIn>
                </div>
              </div>
            </nav>
          </header>
          <main className="mx-auto">{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
