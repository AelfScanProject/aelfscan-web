import { Divider, Flex } from 'antd';
import './index.css';
import { IFourOverviewCardProps } from './type';
import { useMD } from '@_hooks/useResponsive';
import { useRenderItem } from './useRenderItem';

export default function OverviewThreeCard({ items, dataSource, title = 'Overview' }: IFourOverviewCardProps) {
  const isMobile = useMD();

  const renderItem = useRenderItem(dataSource);

  return (
    <Flex className="overview-card" vertical>
      <Flex className="mb-4">
        <div>
          <div className="text-sm font-semibold">{title}</div>
        </div>
      </Flex>
      <Flex vertical={isMobile} gap={isMobile ? 24 : 0}>
        {items.map((item, index) => {
          return (
            <>
              <Flex key={'Flex' + index} vertical gap={16} flex={1}>
                {item?.map((data, index) => renderItem(data, index))}
              </Flex>
              {index !== items.length - 1 && !isMobile && (
                <Divider
                  key={'Divider' + index}
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
