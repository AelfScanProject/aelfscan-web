import EPTooltip from '@_components/EPToolTip';
import { IToken } from '@_types/common';
import { stringToDotString } from '@_utils/formatter';
import { FontWeightEnum, Typography } from 'aelf-design';
import { Flex } from 'antd';
import { useMemo } from 'react';

const { Text } = Typography;

interface ITokenCellProps extends React.PropsWithChildren {
  token: Partial<IToken>;
  showSymbol?: boolean;
  length?: number;
}

export default function TokenCell({ token, children, showSymbol = true, length = 25 }: ITokenCellProps) {
  const symbol = useMemo(() => stringToDotString(token?.symbol, length) || '--', [length, token?.symbol]);
  const name = useMemo(() => stringToDotString(token?.name, length) || '--', [length, token?.name]);

  return (
    <Flex gap={4} align="center">
      {children}
      <Text size="normal" fontWeight={FontWeightEnum.Medium}>
        <EPTooltip mode="dark" title={token?.name}>
          <span className="text-[#000]">{name}</span>
        </EPTooltip>
      </Text>
      {symbol && showSymbol && (
        <Text className="!text-[#858585]" size="normal" fontWeight={FontWeightEnum.Medium}>
          <EPTooltip mode="dark" title={token?.symbol}>
            {`(${symbol})`}
          </EPTooltip>
        </Text>
      )}
    </Flex>
  );
}
