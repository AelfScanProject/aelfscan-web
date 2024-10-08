import EPTooltip from '@_components/EPToolTip';
import IconFont from '@_components/IconFont';
import { FontWeightEnum, Typography } from 'aelf-design';
import { Divider, Flex } from 'antd';
import { useCallback, useMemo } from 'react';
import './index.css';
import { IOverviewCardProps, IOverviewItem } from './type';
import { useMD } from '@_hooks/useResponsive';

const { Text } = Typography;

export default function OverviewCard({ items, dataSource, breakIndex }: IOverviewCardProps) {
  const [col1Items, col2Items] = useMemo(() => {
    const col2StartIndex = breakIndex ?? items?.length ?? 0;
    const col1Items = items.slice(0, col2StartIndex);
    const col2Items = items.slice(col2StartIndex);
    return [col1Items, col2Items];
  }, [breakIndex, items]);

  const isMobile = useMD();

  const renderItem = useCallback(
    (item: IOverviewItem, index: number) => {
      const { label, key, tooltip, format, render } = item;
      return (
        <Flex key={key} vertical>
          <Flex gap={4} align="center">
            <Text size="small" style={{ color: '#858585' }}>
              {label}
            </Text>
            {tooltip && (
              <EPTooltip title={tooltip} mode="dark">
                <IconFont className="text-xs" type="question-circle" />
              </EPTooltip>
            )}
          </Flex>
          <Flex>
            <div className="min-h-[22px]">
              {render ? (
                render(dataSource[key], dataSource, index)
              ) : (
                <Text>{format ? format(dataSource[key]) : dataSource[key]}</Text>
              )}
            </div>
          </Flex>
        </Flex>
      );
    },
    [dataSource],
  );
  return (
    <Flex className="overview-card" vertical>
      <Flex className="mb-5">
        <Text size="normal" fontWeight={FontWeightEnum.Medium}>
          <span className="text-base-100">Overview</span>
        </Text>
      </Flex>
      <Flex vertical={isMobile} gap={isMobile ? 8 : 0}>
        <Flex vertical gap={16} flex={1}>
          {col1Items?.map((item, index) => renderItem(item, index))}
        </Flex>
        {col2Items?.length && (
          <Divider
            className={`card-divider ${isMobile && '!mx-0 !my-4'}`}
            type={isMobile ? 'horizontal' : 'vertical'}
          />
        )}
        <Flex vertical gap={16} flex={1}>
          {col2Items?.map((item, index) => renderItem(item, index))}
        </Flex>
      </Flex>
    </Flex>
  );
}
