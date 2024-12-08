'use client'; // Indicates that this file uses client-side features in Next.js

// Importing necessary modules and components
import { sidebarLinks } from '@/constants'; // Sidebar link data from constants
import { cn } from '@/lib/utils'; // Utility function for conditional class names
import Image from 'next/image'; // Next.js Image component for optimized images
import Link from 'next/link'; // Next.js Link component for navigation
import { usePathname } from 'next/navigation'; // Hook to get the current pathname
import Footer from './Footer'; // Footer component
import PlaidLink from './PlaidLink'; // PlaidLink component for linking to Plaid service

// Sidebar component to display navigation and links for the app
const Sidebar = ({ user }: SiderbarProps) => {
  // Getting the current pathname using the `usePathname` hook
  const pathname = usePathname();

  return (
    <section className="sidebar">
      {/* Sidebar navigation */}
      <nav className="flex flex-col gap-4">
        {/* Logo and link to the homepage */}
        <Link href="/" className="mb-12 cursor-pointer flex items-center gap-2">
          <Image
            src="/icons/logo.svg"
            width={34} // Logo width
            height={34} // Logo height
            alt="Horizon logo" // Alt text for the image
            className="size-[24px] max-xl:size-14" // Responsive sizing for the logo
          />
          <h1 className="sidebar-logo">Horizon</h1> {/* Sidebar title */}
        </Link>

        {/* Mapping through sidebarLinks to render each link item */}
        {sidebarLinks.map((item) => {
          // Determine if the current pathname matches the item's route or starts with the item's route (for nested routes)
          const isActive =
            pathname === item.route || pathname.startsWith(`${item.route}/`);

          return (
            <Link
              href={item.route} // The route the link points to
              key={item.label} // Unique key for each link
              className={cn('sidebar-link', { 'bg-bank-gradient': isActive })} // Conditional styling based on active state
            >
              {/* Icon for the link */}
              <div className="relative size-6">
                <Image
                  src={item.imgURL} // Image URL for the icon
                  alt={item.label} // Alt text for the icon
                  fill // Makes the image fill the parent container
                  className={cn({
                    'brightness-[3] invert-0': isActive, // Apply effects if the link is active
                  })}
                />
              </div>

              {/* Label for the link */}
              <p className={cn('sidebar-label', { '!text-white': isActive })}>
                {item.label} {/* Display the link label */}
              </p>
            </Link>
          );
        })}

        {/* PlaidLink component to allow the user to link their Plaid account */}
        <PlaidLink user={user} />
      </nav>

      {/* Footer section of the sidebar */}
      <Footer user={user} />
    </section>
  );
};

// Export the Sidebar component for use in other parts of the app
export default Sidebar;
