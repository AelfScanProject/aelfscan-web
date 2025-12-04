/*
 * @author: Peterbjx
 * @Date: 2023-08-17 14:37:04
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-17 18:18:42
 * @Description: confirmed or unconfirmed
 */
import IconFont from '@_components/IconFont';
import clsx from 'clsx';
import { memo } from 'react';
import { StatusEnum } from '@_types/status';
function Status({ status }: { status: StatusEnum }) {
  return (
    <div
      className={clsx(
        'confirm-status flex h-5 items-center rounded-[9px] px-[10px]',
        (status === StatusEnum.Confirmed || status === StatusEnum.Success) && 'bg-success',
        status === StatusEnum.Unconfrimed && ' bg-muted-foreground',
        status === StatusEnum.Fail && 'bg-destructive',
      )}>
      {(status === StatusEnum.Confirmed || status === StatusEnum.Success) && (
        <IconFont className="mr-1 text-xs" type="circle-check-big" />
      )}
      {status === StatusEnum.Unconfrimed && <IconFont className="mr-1 text-xs" type="clock-white" />}
      {status === StatusEnum.Fail && <IconFont className="mr-1 text-xs" type="circle-x" />}
      <span className={clsx('block text-xs font-semibold text-white')}>{status}</span>
    </div>
  );
}

export default memo(Status);
