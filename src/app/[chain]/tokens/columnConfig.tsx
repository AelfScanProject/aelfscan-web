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

const renderRank = (currentPage, pageSize) => (text, record, index) => (currentPage - 1) * pageSize + index + 1;

const getHolderPercentChange24h = (record: ITokenListItem) => {
  const { holderPercentChange24H, holders } = record;
  const num = Number(holderPercentChange24H);
  if (Number.isNaN(num)) return '';
  if (num > 0) return `A ${num}% increase in token holders from the previous day count of ${thousandsNumber(holders)}`;
  if (num < 0) return `A ${num}% decrease in token holders from the previous day count of ${thousandsNumber(holders)}`;
  return 'No change in token holders from the previous day count';
};

const renderToken = (text, record, chain) => (
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
);

const renderSupply = (text) => thousandsNumber(text);

const renderHolderChange = (record) => {
  const { holderPercentChange24H } = record;
  return (
    <div>
      <div>{record.holders}</div>
      <div className={clsx(holderPercentChange24H >= 0 ? 'text-[#00A186]' : 'text-rise-red')}>
        <EPTooltip title={getHolderPercentChange24h(record)} mode="dark">
          <span className="text-xs leading-5">{holderPercentChange24H}%</span>
        </EPTooltip>
      </div>
    </div>
  );
};

const getSortableHeader = (sort, ChangeOrder) => (
  <div className="flex cursor-pointer" onClick={ChangeOrder}>
    <IconFont className={`mr-1 text-xs ${sort === SortEnum.asc ? '-scale-y-100' : ''}`} type="Rank" />
    <EPTooltip mode="dark" title="Sorted in descending order Click for ascending order">
      <div className="text-link">Holder</div>
    </EPTooltip>
  </div>
);

export default function getColumns({
  currentPage,
  pageSize,
  ChangeOrder,
  chain,
  sort,
  multi,
}): ColumnsType<ITokenListItem> {
  const commonColumns = [
    {
      title: '#',
      dataIndex: 'rank',
      key: 'rank',
      render: renderRank(currentPage, pageSize),
    },
    {
      title: 'Token',
      dataIndex: 'token',
      key: 'token',
      render: (text, record) => renderToken(text, record, chain),
    },
    {
      title: 'Maximum Supply',
      dataIndex: 'totalSupply',
      key: 'totalSupply',
      render: renderSupply,
    },
    {
      title: 'Circulating Supply',
      dataIndex: 'circulatingSupply',
      key: 'circulatingSupply',
      render: renderSupply,
    },
    {
      title: getSortableHeader(sort, ChangeOrder),
      dataIndex: 'holders',
      key: 'holders',
      render: (text, record) => renderHolderChange(record),
    },
  ];

  return multi
    ? [
        { ...commonColumns[0], width: '96px' },
        { ...commonColumns[1], width: '400px' },
        {
          title: 'Chain',
          width: 224,
          dataIndex: 'chainIds',
          key: 'chainIds',
          render: (chainIds) => <ChainTags chainIds={chainIds || []} />,
        },
        { ...commonColumns[2], width: '224px' },
        { ...commonColumns[3], width: '224px' },
        { ...commonColumns[4], width: '160px' },
      ]
    : [
        { ...commonColumns[0], width: '96px' },
        { ...commonColumns[1], width: '432px' },
        { ...commonColumns[2], width: '320px' },
        { ...commonColumns[3], width: '208px' },
        { ...commonColumns[4], width: '208px' },
      ];
}
