'use client';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'; // Importing Sheet components for mobile navigation
import { sidebarLinks } from '@/constants'; // Importing sidebar links from constants
import { cn } from '@/lib/utils'; // Utility function for conditional class names
import Image from 'next/image'; // Image component from Next.js
import Link from 'next/link'; // Link component from Next.js for routing
import { usePathname } from 'next/navigation'; // Hook to get the current pathname
import Footer from './Footer'; // Footer component
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'; // For accessibility, hiding elements visually but keeping them available for screen readers

// MobileNav component for rendering the mobile navigation
const MobileNav = ({ user }: MobileNavProps) => {
  const pathname = usePathname(); // Getting the current path of the page

  return (
    <section className="w-fulll max-w-[264px]">
      <Sheet>
        <SheetTrigger>
          <Image
            src="/icons/hamburger.svg" // Hamburger icon for the mobile menu
            width={30}
            height={30}
            alt="menu"
            className="cursor-pointer" // Adding a pointer cursor to the icon
          />
        </SheetTrigger>
        <SheetContent side="left" className="border-none bg-white">
          {/* Visually hidden heading for accessibility purposes */}
          <VisuallyHidden>
            <h2>Mobile Navigation</h2>
            <SheetTitle>Mobile Navigation</SheetTitle>
          </VisuallyHidden>

          {/* Logo and Home Link */}
          <Link
            href="/"
            className="cursor-pointer flex items-center gap-1 px-4"
          >
            <Image
              src="/icons/logo.svg" // Logo image
              width={34}
              height={34}
              alt="Horizon logo"
            />
            <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">
              Horizon
            </h1>
          </Link>

          {/* Mobile Navigation Links */}
          <div className="mobilenav-sheet">
            <SheetClose asChild>
              <nav className="flex h-full flex-col gap-6 pt-16 text-white">
                {/* Mapping through the sidebarLinks and rendering them */}
                {sidebarLinks.map((item) => {
                  // Check if the current path is active
                  const isActive =
                    pathname === item.route ||
                    pathname.startsWith(`${item.route}/`);

                  return (
                    <SheetClose asChild key={item.route}>
                      <Link
                        href={item.route} // Linking to the respective route
                        key={item.label}
                        className={cn('mobilenav-sheet_close w-full', {
                          'bg-bank-gradient': isActive, // Adding active background color
                        })}
                      >
                        <Image
                          src={item.imgURL} // Sidebar link icon
                          alt={item.label}
                          width={20}
                          height={20}
                          className={cn({
                            'brightness-[3] invert-0': isActive, // Changing icon style if active
                          })}
                        />
                        <p
                          className={cn('text-16 font-semibold text-black-2', {
                            'text-white': isActive, // Changing text color if active
                          })}
                        >
                          {item.label} {/* Displaying the label */}
                        </p>
                      </Link>
                    </SheetClose>
                  );
                })}
                {/* Placeholder for user */}
                USER
              </nav>
            </SheetClose>
            <Footer user={user} type="mobile" /> {/* Rendering the footer */}
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;
