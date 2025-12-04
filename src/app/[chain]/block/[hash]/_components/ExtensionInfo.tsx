/*
 * @author: Peterbjx
 * @Date: 2023-08-17 17:32:38
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-17 18:29:06
 * @Description: extensionInfo
 */
import DetailContainer from '@_components/DetailContainer';
import CodeBlock from '@_components/CodeBlock';
import { useMemo } from 'react';
import { IBlocksDetailData } from '@_api/type';
export default function ExtensionInfo({ data }: { data: IBlocksDetailData }) {
  const renderInfo = useMemo(() => {
    return [
      {
        label: 'Hash ',
        ellipsis: true,
        tip: 'The hash of the block header of the current block.',
        value: data.blockHash,
      },
      {
        label: 'Previous Hash ',
        ellipsis: true,
        tip: 'The hash of the block after which this block was generated, also known as its previous block.',
        value: <span className="text-primary">{data.previousBlockHash}</span>,
      },
      {
        label: 'Merkle Tree Root OF Transactions ',
        ellipsis: true,
        tip: 'The merkle root of the transaction data.',
        value: data.merkleTreeRootOfTransactions,
      },
      {
        label: 'Merkle Tree Root OF World State ',
        ellipsis: true,
        tip: 'The merkle root of the transaction result.',
        value: data.merkleTreeRootOfWorldState,
      },
      {
        label: 'Merkle Tree Root OF Transaction State ',
        ellipsis: true,
        tip: 'The merkle root of the transaction state.',
        value: data.merkleTreeRootOfTransactionState,
      },
      {
        label: 'Extra Info ',
        tip: 'Extra info of the block.',
        value: <CodeBlock value={data.extra} />,
      },
      {
        label: 'divider1',
        value: 'divider',
      },
    ];
  }, [data]);

  return <DetailContainer infoList={renderInfo} />;
}
