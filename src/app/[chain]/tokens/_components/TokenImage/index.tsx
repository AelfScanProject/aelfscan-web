'use client';
import NFTImage from '@_components/NFTImage';
import { IToken } from '@_types/common';
import { FontWeightEnum, Typography } from 'aelf-design';
interface ITokenImageProps {
  token: Partial<IToken>;
}

const { Text } = Typography;

export default function TokenImage({ token }: ITokenImageProps) {
  return (
    <>
      {token?.imageUrl ? (
        <NFTImage className="size-6 rounded-xl" src={token.imageUrl} alt="logo" width="24px" height="24px" />
      ) : (
        <div className="flex size-6 items-center justify-center rounded-xl border-[1px] border-solid border-[#D0D0D0] bg-white">
          <Text size="small" fontWeight={FontWeightEnum.Bold}>
            {token?.symbol?.[0] || '--'}
          </Text>
        </div>
      )}
    </>
  );
}
