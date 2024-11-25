import IconFont from '@_components/IconFont';
import clsx from 'clsx';
import { memo } from 'react';
import { TransactionStatus, TransactionStatusText } from '@_api/type';
function Status({ status }: { status: TransactionStatus }) {
  return (
    <div
      className={clsx(
        'flex h-5 items-center rounded-[9px] px-[10px]',
        status === TransactionStatus.Mined && ' bg-success',
        (status === TransactionStatus.Failed || status === TransactionStatus.Conflict) && 'bg-destructive',
      )}>
      {status === TransactionStatus.Mined && <IconFont className="mr-1 text-xs" type="circle-check-big" />}
      {(status === TransactionStatus.Failed || status === TransactionStatus.Conflict) && (
        <IconFont className="mr-1 text-xs" type="circle-x" />
      )}
      <span className={clsx('block text-xs font-semibold text-white')}>
        {TransactionStatusText[TransactionStatus[status]]}
      </span>
    </div>
  );
}

export default memo(Status);
