import EPTooltip from '@_components/EPToolTip';
import { IToken } from '@_types/common';
import { stringToDotString } from '@_utils/formatter';
import { FontWeightEnum, Typography } from 'aelf-design';
import { Flex } from 'antd';
import { ReactNode, useMemo } from 'react';

const { Text } = Typography;

interface ITokenCellProps extends React.PropsWithChildren {
  token: Partial<IToken>;
  showSymbol?: boolean;
  length?: number;
  subtitle?: ReactNode;
}

export default function TokenCell({ token, children, showSymbol = true, length = 25, subtitle }: ITokenCellProps) {
  const symbol = useMemo(() => stringToDotString(token?.symbol, length) || '--', [length, token?.symbol]);
  const name = useMemo(() => stringToDotString(token?.name, length) || '--', [length, token?.name]);

  return !subtitle ? (
    <Flex gap={4} align="center">
      {children}
      <Text size="normal" fontWeight={FontWeightEnum.Medium}>
        <EPTooltip mode="dark" title={token?.name}>
          <span className="text-black">{name}</span>
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
  ) : (
    <Flex gap={8} align="center">
      {children}
      <div>
        <div>
          <Text size="normal" fontWeight={FontWeightEnum.Medium}>
            <EPTooltip mode="dark" title={token?.name}>
              <span className="text-base-100">{name}</span>
            </EPTooltip>
          </Text>
          {symbol && showSymbol && (
            <Text className="!text-[#858585]" size="normal" fontWeight={FontWeightEnum.Medium}>
              <EPTooltip mode="dark" title={token?.symbol}>
                {`(${symbol})`}
              </EPTooltip>
            </Text>
          )}
        </div>
        <div>{subtitle}</div>
      </div>
    </Flex>
  );
}
