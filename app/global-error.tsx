'use client';

import * as Sentry from '@sentry/nextjs';
import Error from 'next/error';
import { useEffect } from 'react';

export default function GlobalError({ error }: { error: unknown }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  // Defaulting to 500 if there's no specific status code
  const statusCode = (error as { statusCode?: number })?.statusCode || 500;

  return (
    <html>
      <body>
        <Error statusCode={statusCode} />
      </body>
    </html>
  );
}
