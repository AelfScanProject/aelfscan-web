import EPTooltip from '@_components/EPToolTip';
import IconFont from '@_components/IconFont';
import TokenTableCell from '@_components/TokenTableCell';
import { thousandsNumber } from '@_utils/formatter';
import { ColumnsType } from 'antd/es/table';
import clsx from 'clsx';
import TokenImage from './_components/TokenImage';
import { ITokenListItem, TokenTypeEnum } from '../token/[tokenSymbol]/type';
import Link from 'next/link';
import { SortEnum } from '@_types/common';
import ChainTags from '@_components/ChainTags';

const getHolderPercentChange24h = (record: ITokenListItem) => {
  const { holderPercentChange24H, holders } = record;
  const num = Number(holderPercentChange24H);
  if (Number.isNaN(num)) return '';
  if (num > 0) return `A ${num}% increase in token holders from the previous day count of ${thousandsNumber(holders)}`;
  if (num < 0) return `A ${num}% decrease in token holders from the previous day count of ${thousandsNumber(holders)}`;
  return 'No change in token holders from the previous day count';
};

export default function getColumns({
  currentPage,
  pageSize,
  ChangeOrder,
  chain,
  sort,
  multi,
}): ColumnsType<ITokenListItem> {
  return multi
    ? [
        {
          title: '#',
          width: '96px',
          dataIndex: 'rank',
          key: 'rank',
          render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
        },
        {
          title: 'Token',
          width: '400px',
          dataIndex: 'token',
          key: 'token',
          render: (text, record) => (
            <Link
              href={
                record.type === TokenTypeEnum.nft
                  ? `/nftItem?chainId=${chain}&itemSymbol=${record.token.symbol}`
                  : `/${chain}/token/${text.symbol}`
              }>
              <TokenTableCell token={text}>
                <TokenImage token={text} />
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
          title: 'Maximum Supply',
          width: '224px',
          dataIndex: 'totalSupply',
          key: 'totalSupply',
          render: (text) => thousandsNumber(text),
        },
        {
          title: 'Circulating Supply',
          width: '224px',
          dataIndex: 'circulatingSupply',
          key: 'circulatingSupply',
          render: (text) => thousandsNumber(text),
        },
        {
          title: (
            <div className="flex cursor-pointer" onClick={ChangeOrder}>
              <IconFont className={`mr-1 text-xs ${sort === SortEnum.asc ? '-scale-y-100' : ''}`} type="Rank" />
              <EPTooltip mode="dark" title="Sorted in descending order Click for ascending order">
                <div className="text-link">Holder</div>
              </EPTooltip>
            </div>
          ),
          width: '160px',
          dataIndex: 'holders',
          key: 'holders',
          render: (text, record) => {
            const { holderPercentChange24H } = record;
            return (
              <div>
                <div>{text}</div>
                <div className={clsx(holderPercentChange24H >= 0 ? 'text-[#00A186]' : 'text-rise-red')}>
                  <EPTooltip title={getHolderPercentChange24h(record)} mode="dark">
                    <span className="text-xs leading-5">{holderPercentChange24H}%</span>
                  </EPTooltip>
                </div>
              </div>
            );
          },
        },
      ]
    : [
        {
          title: '#',
          width: '96px',
          dataIndex: 'rank',
          key: 'rank',
          render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
        },
        {
          title: 'Token',
          width: '432px',
          dataIndex: 'token',
          key: 'token',
          render: (text, record) => (
            <Link
              href={
                record.type === TokenTypeEnum.nft
                  ? `/nftItem?chainId=${chain}&itemSymbol=${record.token.symbol}`
                  : `/${chain}/token/${text.symbol}`
              }>
              <TokenTableCell token={text}>
                <TokenImage token={text} />
              </TokenTableCell>
            </Link>
          ),
        },
        {
          title: 'Maximum Supply',
          width: '320px',
          dataIndex: 'totalSupply',
          key: 'totalSupply',
          render: (text) => thousandsNumber(text),
        },
        {
          title: 'Circulating Supply',
          width: '208px',
          dataIndex: 'circulatingSupply',
          key: 'circulatingSupply',
          render: (text) => thousandsNumber(text),
        },
        {
          title: (
            <div className="flex cursor-pointer" onClick={ChangeOrder}>
              <IconFont className={`mr-1 text-xs ${sort === SortEnum.asc ? '-scale-y-100' : ''}`} type="Rank" />
              <EPTooltip mode="dark" title="Sorted in descending order Click for ascending order">
                <div className="text-link">Holder</div>
              </EPTooltip>
            </div>
          ),
          width: '208px',
          dataIndex: 'holders',
          key: 'holders',
          render: (text, record) => {
            const { holderPercentChange24H } = record;
            return (
              <div>
                <div>{text}</div>
                <div className={clsx(holderPercentChange24H >= 0 ? 'text-[#00A186]' : 'text-rise-red')}>
                  <EPTooltip title={getHolderPercentChange24h(record)} mode="dark">
                    <span className="text-xs leading-5">{holderPercentChange24H}%</span>
                  </EPTooltip>
                </div>
              </div>
            );
          },
        },
      ];
}
