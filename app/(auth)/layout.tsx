import Image from 'next/image';
import React, { ReactNode } from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

const RootLayout = async ({ children }: { children: ReactNode }) => {
  // Check if the user is already logged in by verifying the session
  const session = await auth();
  const loggedIn = session?.user;

  // Redirect the user to the homepage if already logged in
  if (loggedIn) redirect('/');

  return (
    <main className="flex min-h-screen w-full justify-between font-inter">
      {/* Render the children (main content) on the left */}
      {children}

      {/* Auth-specific asset (image) on the right side */}
      <div className="auth-asset">
        <div>
          <Image
            src="/icons/auth-image.svg"
            alt="Auth image" // Descriptive alt text for accessibility
            width={500}
            height={500}
            className="rounded-l-xl object-contain" // Rounded corners and scaling for image
          />
        </div>
      </div>
    </main>
  );
};

export default RootLayout;
