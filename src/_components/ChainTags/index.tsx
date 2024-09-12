import { TChainID } from '@_api/type';
import { Tag } from 'antd';

export default function ChainTags({ chainIds }: { chainIds: TChainID[] }) {
  return (
    <div>
      {chainIds.map((chain) => {
        return <Tag key={chain}>{chain === 'AELF' ? 'MainChain' : `SideChain(${chain})`}</Tag>;
      })}
    </div>
  );
}
