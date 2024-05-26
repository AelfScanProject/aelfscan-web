'use client'; // Error components must be Client Components

import { Button } from 'aelf-design';
import Image from 'next/image';
import Logo from 'public/image/search-not-found-red.svg';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="not-found-wrap">
      <div className="not-found-logo-wrap">
        <Image className="object-contain" fill src={Logo} alt="" />
      </div>
      <h1 className="not-found-h1">Something went wrong!</h1>
      <h2 className="not-found-h2">
        The error message content is: <span className="break-all text-[red]">{error.message}</span>
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
