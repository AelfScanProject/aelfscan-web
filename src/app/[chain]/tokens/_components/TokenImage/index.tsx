'use client';
import NFTImage from '@_components/NFTImage';
import { IToken } from '@_types/common';
import { FontWeightEnum, Typography } from 'aelf-design';
import clsx from 'clsx';
interface ITokenImageProps {
  token: Partial<IToken>;
  className?: string;
  width?: string;
  height?: string;
}

const { Text } = Typography;

export default function TokenImage({ token, className, width = '24px', height = '24px' }: ITokenImageProps) {
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
          <Text size="small" fontWeight={FontWeightEnum.Bold}>
            {token?.symbol?.[0] || '--'}
          </Text>
        </div>
      )}
    </>
  );
}
