import EPTooltip from '@_components/EPToolTip';
import IconFont from '@_components/IconFont';
import TokenTableCell from '@_components/TokenTableCell';
import { IToken, SortEnum } from '@_types/common';
import { thousandsNumber } from '@_utils/formatter';
import { ColumnsType } from 'antd/es/table';
import { INFTsTableItem } from './type';
import Link from 'next/link';
import NFTImage from '@_components/NFTImage';
import ChainTags from '@_components/ChainTags';

const renderRank = (currentPage, pageSize) => (text, record, index) => (currentPage - 1) * pageSize + index + 1;

const renderCollection = (collection: IToken, chain) => (
  <Link href={`/nft?chainId=${chain}&&collectionSymbol=${collection.symbol}`}>
    <TokenTableCell token={collection}>
      <NFTImage className="rounded-lg" src={collection.imageUrl} width="40px" height="40px" alt="img" />
    </TokenTableCell>
  </Link>
);

const renderItems = (text) => thousandsNumber(text);

const renderHolders = (sort, ChangeOrder) => (
  <div className="flex cursor-pointer" onClick={ChangeOrder}>
    <IconFont className={`mr-1 text-xs ${sort === SortEnum.asc ? '-scale-y-100' : ''}`} type="Rank" />
    <EPTooltip mode="dark" title="Sorted in descending order Click for ascending order">
      <div className="text-link">Holders</div>
    </EPTooltip>
  </div>
);

export default function getColumns({
  currentPage,
  pageSize,
  ChangeOrder,
  sort,
  chain,
  multi,
}): ColumnsType<INFTsTableItem> {
  const commonColumns = [
    {
      dataIndex: 'rank',
      key: 'rank',
      render: renderRank(currentPage, pageSize),
    },
    {
      title: 'Collection',
      dataIndex: 'nftCollection',
      key: 'nftCollection',
      render: (collection) => renderCollection(collection, chain),
    },
    {
      title: (
        <>
          <span className="mr-1">Items</span>
          <EPTooltip mode="dark" title="The total number of NFT items in the collection">
            <IconFont className="text-xs" type="question-circle" />
          </EPTooltip>
        </>
      ),
      dataIndex: 'items',
      key: 'items',
      render: renderItems,
    },
    {
      title: renderHolders(sort, ChangeOrder),
      dataIndex: 'holders',
      key: 'holders',
      render: renderItems,
    },
  ];

  return multi
    ? [
        { ...commonColumns[0], width: 112 },
        { ...commonColumns[1], width: 480 },
        {
          title: 'Chain',
          width: 234,
          dataIndex: 'chainIds',
          key: 'chainIds',
          render: (chainIds) => <ChainTags chainIds={chainIds || []} />,
        },
        { ...commonColumns[2], width: 294 },
        { ...commonColumns[3], width: 224 },
      ]
    : [
        { ...commonColumns[0], width: 128 },
        { ...commonColumns[1], width: 548 },
        { ...commonColumns[2], width: 348 },
        { ...commonColumns[3], width: 336 },
      ];
}
