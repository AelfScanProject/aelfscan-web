import { Divider, Flex } from 'antd';
import './index.css';
import { IFourOverviewCardProps } from './type';
import { useMD, usePad } from '@_hooks/useResponsive';
import { useRenderItem } from './useRenderItem';

export default function OverviewFourCard({ items, dataSource }: IFourOverviewCardProps) {
  const isMobile = useMD();

  const renderItem = useRenderItem(dataSource);

  return (
    <Flex className="overview-card" vertical>
      <Flex className="mb-4">
        <div>
          <div className="text-sm font-semibold">Overview</div>
        </div>
      </Flex>
      {!isMobile ? (
        <Flex vertical={true} gap={24}>
          <Flex vertical={false} gap={0}>
            {items.slice(0, 2).map((item, index) => {
              return (
                <>
                  <Flex key={index} vertical gap={16} flex={1}>
                    {item?.map((data, index) => renderItem(data, index))}
                  </Flex>
                  {index === 0 && (
                    <Divider
                      className={`card-divider ${isMobile && '!mx-0 !my-4'}`}
                      type={isMobile ? 'horizontal' : 'vertical'}
                    />
                  )}
                </>
              );
            })}
          </Flex>
          <Flex vertical={false} gap={0}>
            {items.slice(2).map((item, index) => {
              return (
                <>
                  <Flex key={index} vertical gap={16} flex={1}>
                    {item?.map((data, index) => renderItem(data, index))}
                  </Flex>
                  {index === 0 && (
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
      ) : (
        <Flex vertical={isMobile} gap={24}>
          {items.map((item, index) => {
            return (
              <>
                <Flex key={index} vertical gap={16} flex={1}>
                  {item?.map((data, index) => renderItem(data, index))}
                </Flex>
              </>
            );
          })}
        </Flex>
      )}
    </Flex>
  );
}
