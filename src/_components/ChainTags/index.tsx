import { TChainID } from '@_api/type';
import { Tag } from 'antd';
import clsx from 'clsx';

export default function ChainTags({ chainIds, className }: { chainIds: TChainID[]; className?: string }) {
  return (
    <div>
      {chainIds.sort().map((chain) => {
        return (
          <Tag className={clsx('px-2 py-[2px]', className)} key={chain}>
            {chain === 'AELF' ? 'MainChain' : `SideChain(${chain})`}
          </Tag>
        );
      })}
    </div>
  );
}
