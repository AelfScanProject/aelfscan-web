import { formatDate, thousandsNumber } from '@_utils/formatter';
import { NftsItemType } from '@_types/commonDetail';
import { ColumnsType } from 'antd/es/table';
import NFTImage from '@_components/NFTImage';
import Link from 'next/link';
import EPTooltip from '@_components/EPToolTip';
import EPSortIcon from '@_components/EPSortIcon';
import ChainTags from '@_components/ChainTags';

const renderToken = (token, record, chain) => {
  if (!token) return null;
  return (
    <div className="item-container flex items-center">
      <NFTImage className="rounded-lg" src={token.imageUrl} width="40px" height="40px" alt="img" />
      <div className="info ml-1">
        <EPTooltip mode="dark" title={token.name}>
          <Link href={`/nft?chainId=${record.chainIds ? record.chainIds[0] : chain}&&collectionSymbol=${token.symbol}`}>
            <div className="name max-w-[175px] truncate text-base-100">{token.name}</div>
          </Link>
        </EPTooltip>
      </div>
    </div>
  );
};

const renderCollection = (collection, record, chain) =>
  collection && (
    <Link href={`/${record.chainIds ? record.chainIds[0] : chain}/token/${collection.symbol}`}>
      <div className="flex items-center">
        <EPTooltip mode="dark" title={collection.name}>
          <span className="mx-1 inline-block max-w-[194px] truncate text-link">{collection.name}</span>
        </EPTooltip>
        <EPTooltip mode="dark" title={collection.name}>
          <span className="flex items-center text-base-200">
            (<span className="mx-1 inline-block max-w-[146px] truncate text-base-200">{collection.symbol}</span>)
          </span>
        </EPTooltip>
      </div>
    </Link>
  );

const getSortOrder = (sortedInfo, columnKey) => (sortedInfo?.columnKey === columnKey ? sortedInfo.order : null);

const renderQuantity = (text) => (
  <span className="mx-1 inline-block max-w-[124px] truncate text-base-100">{thousandsNumber(text)}</span>
);

const renderDate = (text) => (
  <span className="mx-1 inline-block text-base-100">{formatDate(text, 'Date Time (UTC)')}</span>
);

export default function getColumns(chain, sortedInfo, multi): ColumnsType<NftsItemType> {
  const commonColumns = [
    {
      dataIndex: 'token',
      key: 'token',
      render: (token, record) => renderToken(token, record, chain),
    },
    {
      title: 'Collection',
      dataIndex: 'nftCollection',
      key: 'nftCollection',
      render: (collection, record) => renderCollection(collection, record, chain),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'FormatAmount',
      sorter: true,
      sortIcon: ({ sortOrder }) => <EPSortIcon sortOrder={sortOrder} />,
      sortOrder: getSortOrder(sortedInfo, 'FormatAmount'),
      render: renderQuantity,
    },
    {
      title: 'Acquired_Since_Time',
      dataIndex: 'firstNftTime',
      key: 'FirstNftTime',
      sorter: true,
      sortIcon: ({ sortOrder }) => <EPSortIcon sortOrder={sortOrder} />,
      sortOrder: getSortOrder(sortedInfo, 'FirstNftTime'),
      render: renderDate,
    },
  ];

  return multi
    ? [
        {
          title: 'Chain',
          dataIndex: 'chainIds',
          key: 'chainIds',
          render: (chainIds) => <ChainTags chainIds={chainIds || []} />,
          width: 144,
        },
        { ...commonColumns[0], width: 235, title: 'Item' },
        { ...commonColumns[1], width: 421 },
        { ...commonColumns[2], width: 208 },
        { ...commonColumns[3], width: 304 },
      ]
    : [
        { ...commonColumns[0], width: 235, title: 'Item' },
        { ...commonColumns[1], width: 421 },
        { ...commonColumns[2], width: 328 },
        { ...commonColumns[3], width: 328 },
      ];
}
