import IconFont from '@_components/IconFont';
import { MouseEventHandler } from 'react';

export default function Download({ download }: { download: MouseEventHandler<HTMLSpanElement> }) {
  return (
    <div className="mt-4 flex items-center">
      <IconFont type="Download"></IconFont>
      <span className="ml-2 text-sm leading-[22px] text-base-100">
        {' '}
        Download:{' '}
        <span className="cursor-pointer text-link" onClick={download}>
          CSV Data{' '}
        </span>
        (Attribution Required)
      </span>
    </div>
  );
}
