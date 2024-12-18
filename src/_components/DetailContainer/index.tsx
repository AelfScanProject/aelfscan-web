/*
 * @author: Peterbjx
 * @Date: 2023-08-17 11:09:00
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-17 18:16:23
 * @Description: Detail Container
 */
import IconFont from '@_components/IconFont';
import { Divider } from 'antd';
import clsx from 'clsx';
import { Tooltip } from 'aelf-design';
import { useBreakpointMD } from '@_hooks/useResponsive';

export default function DetailContainer({
  infoList,
  className,
}: {
  className?: string;
  infoList: {
    label: string;
    value: React.ReactNode | string;
    tip?: React.ReactNode | string;
    hidden?: boolean;
    ellipsis?: boolean;
    between?: boolean;
    row?: boolean;
  }[];
}) {
  const isMobile = useBreakpointMD();
  return (
    <div className={clsx('wrap basic px-4', className)}>
      {infoList.map((item) => {
        return !item.hidden ? (
          item.value === 'divider' ? (
            <Divider key={item.label} className="!my-3 border-border" />
          ) : (
            <div
              key={item.label}
              className={clsx(
                isMobile && !item.row
                  ? 'flex flex-col gap-4'
                  : `flex flex-row flex-wrap items-center ${item.between && 'justify-between'}`,
                'py-3',
              )}>
              <div
                className={clsx(
                  'label mr-4 flex w-full items-center min-[769px]:w-[300px] min-[1025px]:w-[400px]',
                  isMobile && '!w-auto',
                )}>
                {item.tip && (
                  <Tooltip title={item.tip}>
                    <IconFont className="mr-1 text-base" type="circle-help" />
                  </Tooltip>
                )}
                <div className="overflow-hidden truncate whitespace-nowrap text-base text-muted-foreground">
                  {item.label} :
                </div>
              </div>
              <div
                className={clsx(
                  'value w-full flex-1 break-all text-base text-foreground',
                  item.ellipsis && 'overflow-hidden truncate whitespace-nowrap',
                  isMobile && item.between && '!w-auto flex-none',
                )}>
                {item.value}
              </div>
            </div>
          )
        ) : null;
      })}
    </div>
  );
}
