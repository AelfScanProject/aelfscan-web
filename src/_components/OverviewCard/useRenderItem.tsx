import React from 'react';
import EPTooltip from '@_components/EPToolTip';
import IconFont from '@_components/IconFont';
import { Typography } from 'aelf-design';
import { IOverviewItem } from './type';
import { Flex } from 'antd';

const { Text } = Typography;

export const useRenderItem = (dataSource: any) => {
  return function renderItem(item: IOverviewItem, index: number) {
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
  };
};
