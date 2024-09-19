import EPTooltip from '@_components/EPToolTip';
import IconFont from '@_components/IconFont';
import { FontWeightEnum, Typography } from 'aelf-design';
import { Divider, Flex } from 'antd';
import { useCallback } from 'react';
import './index.css';
import { IFourOverviewCardProps, IOverviewItem } from './type';
import { useMD } from '@_hooks/useResponsive';

const { Text } = Typography;

export default function OverviewThreeCard({ items, dataSource, title = 'Overview' }: IFourOverviewCardProps) {
  const isMobile = useMD();

  const renderItem = useCallback(
    (item: IOverviewItem, index: number) => {
      const { label, key, tooltip, format, render } = item;
      return (
        <Flex key={key} vertical>
          <Flex gap={4} align="center">
            {tooltip && (
              <EPTooltip title={tooltip} mode="dark">
                <IconFont className="text-xs" type="question-circle" />
              </EPTooltip>
            )}
            <Text size="small" style={{ color: '#858585' }}>
              {label}
            </Text>
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
          <span className="text-base-100">{title}</span>
        </Text>
      </Flex>
      <Flex vertical={isMobile} gap={0}>
        {items.map((item, index) => {
          return (
            <>
              <Flex key={index} vertical gap={16} flex={1}>
                {item?.map((data, index) => renderItem(data, index))}
              </Flex>
              {index !== items.length - 1 && (
                <Divider
                  className={`card-divider ${isMobile && '!mx-0 !my-4'}`}
                  type={isMobile ? 'horizontal' : 'vertical'}
                />
              )}
            </>
          );
        })}
      </Flex>
    </Flex>
  );
}