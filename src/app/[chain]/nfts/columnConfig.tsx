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

export default function getColumns({
  currentPage,
  pageSize,
  ChangeOrder,
  sort,
  chain,
  multi,
}): ColumnsType<INFTsTableItem> {
  return multi
    ? [
        {
          title: '#',
          width: 112,
          dataIndex: 'rank',
          key: 'rank',
          render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
        },
        {
          title: 'Collection',
          width: 480,
          dataIndex: 'nftCollection',
          key: 'nftCollection',
          render: (collection: IToken) => (
            <Link href={`/nft?chainId=${chain}&&collectionSymbol=${collection.symbol}`}>
              <TokenTableCell token={collection}>
                <NFTImage
                  className="rounded-lg"
                  src={collection.imageUrl}
                  width="40px"
                  height="40px"
                  alt="img"></NFTImage>
              </TokenTableCell>
            </Link>
          ),
        },
        {
          title: 'Chain',
          width: 224,
          dataIndex: 'chainIds',
          key: 'chainIds',
          render: (chainIds) => <ChainTags chainIds={chainIds || []} />,
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
          width: 304,
          dataIndex: 'items',
          key: 'items',
          render: (text) => thousandsNumber(text),
        },
        {
          title: (
            <div className="flex cursor-pointer" onClick={ChangeOrder}>
              <IconFont className={`mr-1 text-xs ${sort === SortEnum.asc ? '-scale-y-100' : ''}`} type="Rank" />
              <EPTooltip mode="dark" title="Sorted in descending order Click for ascending order">
                <div className="text-link">Holders</div>
              </EPTooltip>
            </div>
          ),
          width: 224,
          dataIndex: 'holders',
          key: 'holders',
          render: (text) => thousandsNumber(text),
        },
      ]
    : [
        {
          title: '#',
          width: 128,
          dataIndex: 'rank',
          key: 'rank',
          render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
        },
        {
          title: 'Collection',
          width: 548,
          dataIndex: 'nftCollection',
          key: 'nftCollection',
          render: (collection: IToken) => (
            <Link href={`/nft?chainId=${chain}&&collectionSymbol=${collection.symbol}`}>
              <TokenTableCell token={collection}>
                <NFTImage
                  className="rounded-lg"
                  src={collection.imageUrl}
                  width="40px"
                  height="40px"
                  alt="img"></NFTImage>
              </TokenTableCell>
            </Link>
          ),
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
          width: 348,
          dataIndex: 'items',
          key: 'items',
          render: (text) => thousandsNumber(text),
        },
        {
          title: (
            <div className="flex cursor-pointer" onClick={ChangeOrder}>
              <IconFont className={`mr-1 text-xs ${sort === SortEnum.asc ? '-scale-y-100' : ''}`} type="Rank" />
              <EPTooltip mode="dark" title="Sorted in descending order Click for ascending order">
                <div className="text-link">Holders</div>
              </EPTooltip>
            </div>
          ),
          width: 336,
          dataIndex: 'holders',
          key: 'holders',
          render: (text) => thousandsNumber(text),
        },
      ];
}
