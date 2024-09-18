import { formatDate, thousandsNumber } from '@_utils/formatter';
import { NftsItemType } from '@_types/commonDetail';
import { ColumnsType } from 'antd/es/table';
import NFTImage from '@_components/NFTImage';
import Link from 'next/link';
import EPTooltip from '@_components/EPToolTip';
import EPSortIcon from '@_components/EPSortIcon';
import ChainTags from '@_components/ChainTags';

export default function getColumns(chain, sortedInfo, multi): ColumnsType<NftsItemType> {
  return multi
    ? [
        {
          title: 'Chain',
          width: 144,
          dataIndex: 'chainIds',
          key: 'chainIds',
          render: (chainIds) => <ChainTags chainIds={chainIds || []} />,
        },
        {
          dataIndex: 'token',
          width: 235,
          key: 'token',
          title: 'Item',
          render: (token, record) => {
            if (!token) return null;
            return (
              <div className="item-container flex items-center">
                <NFTImage className="rounded-lg" src={token.imageUrl} width="40px" height="40px" alt="img"></NFTImage>
                <div className="info ml-1">
                  <EPTooltip mode="dark" title={token.name}>
                    <Link
                      href={`/nft?chainId=${record.chainIds ? record.chainIds[0] : chain}&&collectionSymbol=${token.symbol}`}>
                      <div className="name max-w-[175px] truncate text-base-100">{token.name}</div>
                    </Link>
                  </EPTooltip>
                </div>
              </div>
            );
          },
        },
        {
          title: 'Collection',
          width: 421,
          dataIndex: 'nftCollection',
          key: 'nftCollection',
          render: (collection, record) =>
            !collection && (
              <Link href={`/${record.chainIds ? record.chainIds[0] : chain}/token/${collection.symbol}`}>
                <div className="flex items-center">
                  <EPTooltip mode="dark" title={collection.name}>
                    <span className="mx-1 inline-block max-w-[194px] truncate text-link">{collection.name}</span>
                  </EPTooltip>
                  <EPTooltip mode="dark" title={collection.name}>
                    <span className="flex items-center text-base-200">
                      (
                      <span className="mx-1 inline-block max-w-[146px] truncate text-base-200">
                        {collection.symbol}
                      </span>
                      )
                    </span>
                  </EPTooltip>
                </div>
              </Link>
            ),
        },
        {
          title: 'Quantity',
          width: 208,
          dataIndex: 'quantity',
          key: 'FormatAmount',
          sorter: true,
          sortIcon: ({ sortOrder }) => <EPSortIcon sortOrder={sortOrder} />,
          sortOrder: sortedInfo?.columnKey === 'FormatAmount' ? sortedInfo.order : null,
          render: (text) => (
            <span className="mx-1 inline-block max-w-[124px] truncate text-base-100">{thousandsNumber(text)}</span>
          ),
        },
        {
          title: 'Acquired_Since_Time',
          width: 304,
          dataIndex: 'firstNftTime',
          key: 'FirstNftTime',
          sorter: true,
          sortIcon: ({ sortOrder }) => <EPSortIcon sortOrder={sortOrder} />,
          sortOrder: sortedInfo?.columnKey === 'FirstNftTime' ? sortedInfo.order : null,
          render: (text) => (
            <span className="mx-1 inline-block text-base-100">{formatDate(text, 'Date Time (UTC)')}</span>
          ),
        },
      ]
    : [
        {
          dataIndex: 'token',
          width: 235,
          key: 'token',
          title: 'Item',
          render: (token, record) => {
            if (!token) return null;
            return (
              <div className="item-container flex items-center">
                <NFTImage className="rounded-lg" src={token.imageUrl} width="40px" height="40px" alt="img"></NFTImage>
                <div className="info ml-1">
                  <EPTooltip mode="dark" title={token.name}>
                    <Link
                      href={`/nft?chainId=${record.chainIds ? record.chainIds[0] : chain}&&collectionSymbol=${token.symbol}`}>
                      <div className="name max-w-[175px] truncate text-base-100">{token.name}</div>
                    </Link>
                  </EPTooltip>
                </div>
              </div>
            );
          },
        },
        {
          title: 'Collection',
          width: 421,
          dataIndex: 'nftCollection',
          key: 'nftCollection',
          render: (collection, record) =>
            !collection && (
              <Link href={`/${record.chainIds ? record.chainIds[0] : chain}/token/${collection.symbol}`}>
                <div className="flex items-center">
                  <EPTooltip mode="dark" title={collection.name}>
                    <span className="mx-1 inline-block max-w-[194px] truncate text-link">{collection.name}</span>
                  </EPTooltip>
                  <EPTooltip mode="dark" title={collection.name}>
                    <span className="flex items-center text-base-200">
                      (
                      <span className="mx-1 inline-block max-w-[146px] truncate text-base-200">
                        {collection.symbol}
                      </span>
                      )
                    </span>
                  </EPTooltip>
                </div>
              </Link>
            ),
        },
        {
          title: 'Quantity',
          width: 328,
          dataIndex: 'quantity',
          key: 'FormatAmount',
          sorter: true,
          sortIcon: ({ sortOrder }) => <EPSortIcon sortOrder={sortOrder} />,
          sortOrder: sortedInfo?.columnKey === 'FormatAmount' ? sortedInfo.order : null,
          render: (text) => (
            <span className="mx-1 inline-block max-w-[124px] truncate text-base-100">{thousandsNumber(text)}</span>
          ),
        },
        {
          title: 'Acquired_Since_Time',
          width: 328,
          dataIndex: 'firstNftTime',
          key: 'FirstNftTime',
          sorter: true,
          sortIcon: ({ sortOrder }) => <EPSortIcon sortOrder={sortOrder} />,
          sortOrder: sortedInfo?.columnKey === 'FirstNftTime' ? sortedInfo.order : null,
          render: (text) => (
            <span className="mx-1 inline-block text-base-100">{formatDate(text, 'Date Time (UTC)')}</span>
          ),
        },
      ];
}
