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
import { MULTI_CHAIN } from '@_utils/contant';

const renderRank = (currentPage, pageSize) => (text, record, index) => (currentPage - 1) * pageSize + index + 1;

const renderCollection = (collection: IToken) => (
  <Link className="block w-full" href={`/nft?chainId=${MULTI_CHAIN}&&collectionSymbol=${collection.symbol}`}>
    <TokenTableCell token={collection} className="max-w-[361px] flex-nowrap truncate">
      <div className="shrink-0">
        <NFTImage className="rounded-lg" src={collection.imageUrl} width="40px" height="40px" alt="img" />
      </div>
    </TokenTableCell>
  </Link>
);

const renderItems = (text) => thousandsNumber(text);

const renderHolders = (sort, ChangeOrder) => (
  <div className="flex cursor-pointer" onClick={ChangeOrder}>
    <EPTooltip mode="dark" title="Sorted in descending order Click for ascending order">
      <div className="px-1 text-primary">Holders</div>
    </EPTooltip>
    <IconFont
      className="ml-1 text-base"
      type={sort === SortEnum.asc ? 'arrow-up-wide-narrow' : 'arrow-down-wide-narrow-f6kehlin'}
    />
  </div>
);

export default function getColumns({ currentPage, pageSize, ChangeOrder, sort }): ColumnsType<INFTsTableItem> {
  const commonColumns = [
    {
      dataIndex: 'rank',
      key: 'rank',
      title: '#',
      width: 100,
      render: renderRank(currentPage, pageSize),
    },
    {
      title: 'Collection',
      dataIndex: 'nftCollection',
      key: 'nftCollection',
      width: 393,
      render: (collection) => renderCollection(collection),
    },
    {
      title: 'Chain',
      width: 120,
      dataIndex: 'chainIds',
      key: 'chainIds',
      render: (chainIds) => <ChainTags showIcon chainIds={chainIds || []} />,
    },
    {
      title: (
        <>
          <span className="mr-1">Items</span>
          <EPTooltip mode="dark" title="The total number of NFT items in the collection">
            <IconFont className="text-base" type="circle-help" />
          </EPTooltip>
        </>
      ),
      dataIndex: 'items',
      key: 'items',
      width: 393,
      render: renderItems,
    },
    {
      title: renderHolders(sort, ChangeOrder),
      dataIndex: 'holders',
      key: 'holders',
      width: 391,
      render: renderItems,
    },
  ];

  return commonColumns;
}
