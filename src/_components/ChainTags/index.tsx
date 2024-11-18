import { TChainID } from '@_api/type';
import { Tag } from 'antd';
import clsx from 'clsx';
import Image from 'next/image';
import MainChainLogo from 'public/image/mianChainLogo.svg';
import DappChainLogo from 'public/image/dappChainLogo.svg';

export default function ChainTags({ chainIds = [], className }: { chainIds: TChainID[]; className?: string }) {
  return (
    <div>
      {chainIds.length > 1 ? (
        [...chainIds].sort().map((chain) => {
          return (
            <Tag className={clsx('px-2 py-[2px]', className)} key={chain}>
              {chain === 'AELF' ? 'aelf MainChain' : 'aelf dAppChain'}
            </Tag>
          );
        })
      ) : (
        <div className="flex items-center gap-2">
          <Image width={24} height={24} alt="" src={chainIds[0] === 'AELF' ? MainChainLogo : DappChainLogo}></Image>
          <span className="text-sm text-foreground">{chainIds[0] === 'AELF' ? 'MainChain' : 'dAppChain'}</span>
        </div>
      )}
    </div>
  );
}
