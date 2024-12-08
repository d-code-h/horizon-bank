import MobileNav from '@/components/MobileNav';
import Sidebar from '@/components/Sidebar';
import Image from 'next/image';
import { getLoggedInUser } from '@/lib/actions/user.actions';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch the logged-in user details
  // This call is async and should ideally be optimized with caching or server-side rendering (SSR)
  const user = (await getLoggedInUser()) as User;

  return (
    <main className="flex h-screen w-full font-inter">
      {/* Sidebar component: visible on larger screens */}
      <Sidebar user={user} />

      {/* Main content area */}
      <div className="flex size-full flex-col">
        {/* Header area with a logo and mobile navigation */}
        <div className="root-layout">
          {/* Optimized Image loading with Next.js Image component */}
          <Image
            src="/icons/logo.svg"
            width={30}
            height={30}
            alt="logo"
            priority // Prioritize loading for better performance
          />
          <div>
            {/* Mobile navigation bar */}
            <MobileNav user={user} />
          </div>
        </div>

        {/* Render the children components (the main content of each page) */}
        {children}
      </div>
    </main>
  );
}
