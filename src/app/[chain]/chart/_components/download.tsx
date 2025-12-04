import IconFont from '@_components/IconFont';
import { MouseEventHandler } from 'react';

export default function Download({ download }: { download: MouseEventHandler<HTMLSpanElement> }) {
  return (
    <div className="mt-4 flex items-center">
      <IconFont className="text-base" type="download-f7em235n"></IconFont>
      <span className="ml-2 text-sm">
        {' '}
        Download:{' '}
        <span className="cursor-pointer text-primary" onClick={download}>
          CSV Data{' '}
        </span>
        (Attribution Required)
      </span>
    </div>
  );
}
