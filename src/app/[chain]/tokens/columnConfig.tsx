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
import { MULTI_CHAIN } from '@_utils/contant';

const renderRank = (currentPage, pageSize) => (text, record, index) => (currentPage - 1) * pageSize + index + 1;

const getHolderPercentChange24h = (record: ITokenListItem) => {
  const { holderPercentChange24H, beforeCount } = record;
  const num = Number(holderPercentChange24H);
  if (Number.isNaN(num)) return '';
  if (num > 0)
    return `A ${num}% increase in token holders from the previous day count of ${thousandsNumber(beforeCount)}`;
  if (num < 0)
    return `A ${num}% decrease in token holders from the previous day count of ${thousandsNumber(beforeCount)}`;
  return 'No change in token holders from the previous day count';
};

const renderToken = (text, record) => (
  <Link
    className="block w-full"
    href={
      record.type === TokenTypeEnum.nft
        ? `/nftItem?chainId=${MULTI_CHAIN}&itemSymbol=${record.token.symbol}`
        : `/${MULTI_CHAIN}/token/${text.symbol}`
    }>
    <TokenTableCell token={text} className="max-w-[263px] flex-nowrap truncate">
      <div className="flex shrink-0 items-center">
        <TokenImage token={text} className="bg-muted" textClassName="text-xs font-normal" />
      </div>
    </TokenTableCell>
  </Link>
);

const renderSupply = (text) => thousandsNumber(text);

const renderHolderChange = (record) => {
  const { holderPercentChange24H } = record;
  return (
    <div>
      <div className="font-medium">{record.holders}</div>
      <div
        className={clsx(
          holderPercentChange24H === 0
            ? 'text-muted-foreground'
            : holderPercentChange24H > 0
              ? 'text-success'
              : 'text-destructive',
        )}>
        <EPTooltip title={getHolderPercentChange24h(record)} mode="dark">
          <span className="text-xs leading-5">{holderPercentChange24H}%</span>
        </EPTooltip>
      </div>
    </div>
  );
};

const getSortableHeader = (sort, ChangeOrder) => (
  <div className="flex cursor-pointer" onClick={ChangeOrder}>
    <EPTooltip mode="dark" title="Sorted in descending order Click for ascending order">
      <div className="text-primary">Holder</div>
    </EPTooltip>
    <IconFont
      className="ml-1 text-base"
      type={sort === SortEnum.asc ? 'arrow-up-wide-narrow' : 'arrow-down-wide-narrow-f6kehlin'}
    />
  </div>
);

export default function getColumns({ currentPage, pageSize, ChangeOrder, sort }): ColumnsType<ITokenListItem> {
  const commonColumns = [
    {
      title: '#',
      dataIndex: 'rank',
      width: 100,
      key: 'rank',
      render: renderRank(currentPage, pageSize),
    },
    {
      title: 'Token',
      dataIndex: 'token',
      width: 295,
      key: 'token',
      render: (text, record) => renderToken(text, record),
    },
    {
      title: 'Chain',
      width: 120,
      dataIndex: 'chainIds',
      key: 'chainIds',
      render: (chainIds) => <ChainTags chainIds={chainIds || []} showIcon={true} />,
    },
    {
      title: 'Maximum Supply',
      dataIndex: 'totalSupply',
      width: 295,
      key: 'totalSupply',
      render: renderSupply,
    },
    {
      title: 'Circulating Supply',
      dataIndex: 'circulatingSupply',
      width: 295,
      key: 'circulatingSupply',
      render: renderSupply,
    },
    {
      title: getSortableHeader(sort, ChangeOrder),
      dataIndex: 'holders',
      key: 'holders',
      width: 293,
      render: (text, record) => renderHolderChange(record),
    },
  ];

  return commonColumns;
}
