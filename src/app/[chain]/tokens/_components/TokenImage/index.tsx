'use client';
import NFTImage from '@_components/NFTImage';
import { IToken } from '@_types/common';
import clsx from 'clsx';
interface ITokenImageProps {
  token: Partial<IToken>;
  className?: string;
  textClassName?: string;
  width?: string;
  height?: string;
}

export default function TokenImage({
  token,
  className,
  width = '24px',
  height = '24px',
  textClassName,
}: ITokenImageProps) {
  return (
    <>
      {token?.imageUrl ? (
        <NFTImage
          className={clsx('size-6 rounded-xl', className)}
          src={token.imageUrl}
          alt="logo"
          width={width}
          height={height}
        />
      ) : (
        <div
          className={clsx(
            'flex size-6 items-center justify-center rounded-xl border border-solid border-D0 bg-white',
            className,
          )}>
          <div className={clsx('text-sm font-semibold text-muted-foreground', textClassName)}>
            {token?.symbol?.[0] || '--'}
          </div>
        </div>
      )}
    </>
  );
}
