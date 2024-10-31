import { TChainID } from '@_api/type';
import clsx from 'clsx';

export default function BasicTag({
  chainIds = [],
  size = 'small',
}: {
  chainIds: TChainID[];
  size?: 'small' | 'large';
}) {
  return (
    <div className="flex items-center gap-1">
      {[...chainIds].sort().map((item) => {
        return (
          <div
            key={item}
            className={clsx(
              'rounded border border-[#EAECEF] px-1 text-[10px] leading-[18px] text-base-200',
              size === 'small' && 'text-xs leading-5',
            )}>
            {item === 'AELF' ? 'aelf MainChain' : 'aelf dAppChain'}
          </div>
        );
      })}
    </div>
  );
}
