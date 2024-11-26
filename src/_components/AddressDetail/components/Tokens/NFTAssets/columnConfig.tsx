import { formatDate, thousandsNumber } from '@_utils/formatter';
import { NftsItemType } from '@_types/commonDetail';
import { ColumnsType } from 'antd/es/table';
import NFTImage from '@_components/NFTImage';
import Link from 'next/link';
import EPTooltip from '@_components/EPToolTip';
import EPSortIcon from '@_components/EPSortIcon';
import ChainTags from '@_components/ChainTags';
import dayjs from 'dayjs';
import { MULTI_CHAIN } from '@_utils/contant';

const renderToken = (token) => {
  if (!token) return null;
  return (
    <div className="item-container flex items-center">
      <NFTImage className="rounded-lg" src={token.imageUrl} width="40px" height="40px" alt="img" />
      <div className="info ml-1">
        <EPTooltip mode="dark" title={token.name}>
          <Link href={`/nft?chainId=${MULTI_CHAIN}&&collectionSymbol=${token.symbol}`}>
            <div className="name max-w-[175px] truncate text-foreground">{token.name}</div>
          </Link>
        </EPTooltip>
      </div>
    </div>
  );
};

const renderCollection = (collection) =>
  collection && (
    <Link href={`/nft?chainId=${MULTI_CHAIN}&&collectionSymbol=${collection.symbol}`}>
      <div className="flex items-center">
        <EPTooltip mode="dark" title={collection.name}>
          <span className="mx-1 inline-block max-w-[194px] truncate text-foreground">{collection.name}</span>
        </EPTooltip>
        <EPTooltip mode="dark" title={collection.name}>
          <span className="flex items-center">
            (<span className="mx-1 inline-block max-w-[146px] truncate text-muted-foreground">{collection.symbol}</span>
            )
          </span>
        </EPTooltip>
      </div>
    </Link>
  );

const trimmedDateString = (originalDateString) => {
  const result = originalDateString.replace(/\.\d+Z$/, 'Z');
  return dayjs(result).unix();
};

const getSortOrder = (sortedInfo, columnKey) => (sortedInfo?.columnKey === columnKey ? sortedInfo.order : null);

const renderQuantity = (text) => (
  <span className="mx-1 inline-block max-w-[124px] truncate text-base-100">{thousandsNumber(text)}</span>
);

const renderDate = (text) => (
  <span className="mx-1 inline-block text-base-100">{formatDate(trimmedDateString(text), 'Date Time (UTC)')}</span>
);

export default function getColumns(sortedInfo): ColumnsType<NftsItemType> {
  const commonColumns = [
    {
      title: 'Chain',
      dataIndex: 'chainIds',
      key: 'chainIds',
      render: (chainIds) => <ChainTags chainIds={chainIds || []} />,
      width: 140,
    },
    {
      dataIndex: 'token',
      key: 'token',
      width: 315,
      render: (token) => renderToken(token),
    },
    {
      title: 'Collection',
      dataIndex: 'nftCollection',
      key: 'nftCollection',
      width: 315,
      render: (collection) => renderCollection(collection),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'FormatAmount',
      sorter: true,
      width: 315,
      className: 'sort-title-cell',
      sortIcon: ({ sortOrder }) => <EPSortIcon sortOrder={sortOrder} />,
      sortOrder: getSortOrder(sortedInfo, 'FormatAmount'),
      render: renderQuantity,
    },
    {
      title: 'Acquired since',
      dataIndex: 'firstNftTime',
      key: 'FirstNftTime',
      width: 313,
      sorter: true,
      className: 'sort-title-cell',
      sortIcon: ({ sortOrder }) => <EPSortIcon sortOrder={sortOrder} />,
      sortOrder: getSortOrder(sortedInfo, 'FirstNftTime'),
      render: renderDate,
    },
  ];

  return commonColumns;
}
