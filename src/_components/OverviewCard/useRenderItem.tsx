import React from 'react';
import EPTooltip from '@_components/EPToolTip';
import IconFont from '@_components/IconFont';
import { IOverviewItem } from './type';
import { Flex } from 'antd';

export const useRenderItem = (dataSource: any) => {
  return function renderItem(item: IOverviewItem, index: number) {
    const { label, key, tooltip, format, render } = item;
    return (
      <Flex key={key} vertical gap={2}>
        <Flex gap={4} align="center">
          <div className="text-sm text-muted-foreground">{label}</div>
          {tooltip && (
            <EPTooltip title={tooltip} mode="dark">
              <IconFont className="text-base" type="circle-help" />
            </EPTooltip>
          )}
        </Flex>
        <Flex>
          <div className="min-h-[22px]">
            {render ? (
              render(dataSource[key], dataSource, index)
            ) : (
              <div className="text-base font-medium">{format ? format(dataSource[key]) : dataSource[key]}</div>
            )}
          </div>
        </Flex>
      </Flex>
    );
  };
};
