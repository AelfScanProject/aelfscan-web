'use client'; // Error components must be Client Components

import { Button } from 'aelf-design';
import Image from 'next/image';
import Logo from 'public/image/search-not-found-red.svg';
import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log the error to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="not-found-wrap">
      <div className="not-found-logo-wrap">
        <Image className="object-contain" fill src={Logo} alt="" />
      </div>
      <h1 className="not-found-h1">Oops! An Error Occurred</h1>
      <h2 className="not-found-h2">
        Error message: <span className="break-words text-destructive">{error.message}</span>
      </h2>
      <Button
        type="primary"
        className="not-found-btn"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }>
        Try again
      </Button>
    </div>
  );
}
