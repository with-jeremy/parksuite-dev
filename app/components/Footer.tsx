import Link from 'next/link';
import Image from 'next/image';
import { Twitter, Instagram, Facebook } from "lucide-react";

const Footer = () => (
  <footer className="border-t bg-background">
    <div className="container max-w-7xl mx-auto flex flex-col gap-6 py-8">
      <div className="flex flex-col md:flex-row gap-6" id="r1">
        <div className="flex-1" id="r1c1">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex flex-col gap-2">
            <Image
                  src="/images/logo.png"
                  alt="ParkSuite"
                  width={200}
                  height={64}
                  className="h-12 object-contain"
                />
            </Link>
            <p className="text-sm ml-8 text-muted-foreground">Event parking made easy.</p>
            <div className="flex ml-8 gap-4">
              <Link href="https://twitter.com" aria-label="Twitter">
                <Twitter className="h-5 w-5 text-muted-foreground hover:text-foreground" />
              </Link>
              <Link href="https://instagram.com" aria-label="Instagram">
                <Instagram className="h-5 w-5 text-muted-foreground hover:text-foreground" />
              </Link>
              <Link href="https://facebook.com" aria-label="Facebook">
                <Facebook className="h-5 w-5 text-muted-foreground hover:text-foreground" />
              </Link>
            </div>
          </div>
        </div>
        <div className="flex-1" id="r1c2">
          <ul className="space-y-2 mt-3">
            <li>
              <Link href="/about" className="text-sm text-muted-foreground hover:underline">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/advertising" className="text-sm text-muted-foreground hover:underline">
                Advertising Policy
              </Link>
            </li>
            <li>
              <Link href="/community" className="text-sm text-muted-foreground hover:underline">
                Community
              </Link>
            </li><li>
              <Link href="/cookies" className="text-sm text-muted-foreground hover:underline">
                Cookies & Interest Based
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex-1" id="r1c3">
          <ul className="space-y-2 mt-3">
          <li>
              <Link href="/data" className="text-sm text-muted-foreground hover:underline">
                Data Privacy
              </Link>
            </li>
          <li>
              <Link href="/faq" className="text-sm text-muted-foreground hover:underline">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/payment-terms" className="text-sm text-muted-foreground hover:underline">
                Payment Terms
              </Link>
            </li>
            <li>
              <Link href="/terms-conditions" className="text-sm text-muted-foreground hover:underline">
                Terms and Conditions
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t py-6" id="r2">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} ParkSuite. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;