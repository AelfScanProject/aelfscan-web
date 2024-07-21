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
import { FontWeightEnum, Tooltip } from 'aelf-design';
import { useMobileAll } from '@_hooks/useResponsive';
import { Typography } from 'aelf-design';

export default function DetailContainer({
  infoList,
}: {
  infoList: {
    label: string;
    value: React.ReactNode | string;
    tip?: React.ReactNode | string;
    hidden?: boolean;
    row?: boolean;
  }[];
}) {
  const isMobile = useMobileAll();
  return (
    <div className="wrap basic px-4">
      {infoList.map((item) => {
        return !item.hidden ? (
          item.value === 'divider' ? (
            <Divider key={item.label} className="!my-3 border-color-divider" />
          ) : (
            <div
              key={item.label}
              className={clsx(isMobile && !item.row ? 'flex flex-col' : 'row flex flex-wrap items-start', 'py-3')}>
              <div className={clsx('label mr-4 flex !max-w-[312px] items-center', isMobile && 'mb-2')}>
                {item.tip && (
                  <Tooltip title={item.tip}>
                    <IconFont className="text-sm" style={{ marginRight: '4px' }} type="question-circle-blod" />
                  </Tooltip>
                )}
                <Typography.Text size="normal" className="text-title" fontWeight={FontWeightEnum.Bold}>
                  {item.label} :
                </Typography.Text>
              </div>
              <div className="value flex-1 break-all text-sm leading-[22px] text-base-100">{item.value}</div>
            </div>
          )
        ) : null;
      })}
    </div>
  );
}
