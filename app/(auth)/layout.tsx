import Image from 'next/image';
import React, { ReactNode } from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  const loggedIn = session?.user;

  if (loggedIn) redirect('/');

  return (
    <main className="flex min-h-screen w-full justify-between font-inter">
      {children}
      <div className="auth-asset">
        <div>
          <Image
            src="/icons/auth-image.svg"
            alt="Auth image"
            width={500}
            height={500}
            className="rounded-l-xl object-contain"
          />
        </div>
      </div>
    </main>
  );
};

export default RootLayout;
