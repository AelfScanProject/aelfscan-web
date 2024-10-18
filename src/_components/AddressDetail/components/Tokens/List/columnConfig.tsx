import IconFont from '@_components/IconFont';
import { numberFormatter, thousandsNumber } from '@_utils/formatter';
import { TokensListItemType } from '@_types/commonDetail';
import { ColumnsType } from 'antd/es/table';
import EPSortIcon from '@_components/EPSortIcon';
import clsx from 'clsx';
import TokenTableCell from '@_components/TokenTableCell';
import TokenImage from '@app/[chain]/tokens/_components/TokenImage';
import Link from 'next/link';
import EPTooltip from '@_components/EPToolTip';
import ChainTags from '@_components/ChainTags';
import { TokenTypeEnum } from '@app/[chain]/token/[tokenSymbol]/type';

const renderTokenLink = (record, chain) => (
  <Link
    href={
      record.type === TokenTypeEnum.nft
        ? `/nftItem?chainId=${record.chainIds ? record.chainIds[0] : chain}&itemSymbol=${record.token.symbol}`
        : `/${record.chainIds ? record.chainIds[0] : chain}/token/${record.token.symbol}`
    }>
    <TokenTableCell showSymbol={false} token={record.token}>
      <TokenImage token={record.token} />
    </TokenTableCell>
  </Link>
);

const renderSymbol = (text, record) => (
  <span className="inline-block max-w-[181px] truncate leading-5 text-base-100">{record.token?.symbol}</span>
);

const renderQuantity = (text) => (
  <EPTooltip mode="dark" title={thousandsNumber(text)}>
    <span className="inline-block max-w-[124px] truncate leading-5 text-base-100">{thousandsNumber(text)}</span>
  </EPTooltip>
);

const renderPrice = (text, record, showELF) =>
  showELF ? <span>{numberFormatter(record.priceOfElf)}</span> : <span>${thousandsNumber(text)}</span>;

const renderValue = (text, record, showELF) =>
  showELF ? <span>{numberFormatter(record.valueOfElf)}</span> : <span>${thousandsNumber(text)}</span>;

const renderChange24h = (text) => (
  <span className={clsx(text >= 0 ? 'text-positive' : 'text-rise-red')}>
    <IconFont className={clsx(text >= 0 && 'rotate-180', 'mr-1 text-xs')} type="down-aa9i0lma" />
    {text}%
  </span>
);

const getColumns = (sortedInfo, chain, showELF, multi): ColumnsType<TokensListItemType> => {
  const commonColumns = [
    {
      dataIndex: 'token',
      key: 'token',
      render: (text, record) => renderTokenLink(record, chain),
    },
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: 'Symbol',
      sorter: true,
      sortIcon: ({ sortOrder }) => <EPSortIcon sortOrder={sortOrder} />,
      sortOrder: sortedInfo?.columnKey === 'Symbol' ? sortedInfo.order : null,
      render: renderSymbol,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'FormatAmount',
      sorter: true,
      sortIcon: ({ sortOrder }) => <EPSortIcon sortOrder={sortOrder} />,
      sortOrder: sortedInfo?.columnKey === 'FormatAmount' ? sortedInfo.order : null,
      render: renderQuantity,
    },
    {
      title: 'Price',
      dataIndex: 'priceOfUsd',
      key: 'priceOfUsd',
      render: (text, record) => renderPrice(text, record, showELF),
    },
    {
      title: 'Change(24H)',
      dataIndex: 'priceOfUsdPercentChange24h',
      key: 'priceOfUsdPercentChange24h',
      render: renderChange24h,
    },
    {
      title: 'Value',
      dataIndex: 'valueOfUsd',
      key: 'valueOfUsd',
      render: (text, record) => renderValue(text, record, showELF),
    },
  ];

  return multi
    ? [
        {
          title: 'Chain',
          width: 144,
          dataIndex: 'chainIds',
          key: 'chainIds',
          render: (chainIds) => <ChainTags chainIds={chainIds || []} />,
        },
        { ...commonColumns[0], width: 240, title: 'Token Name' },
        { ...commonColumns[1], width: 176 },
        { ...commonColumns[2], width: 208 },
        { ...commonColumns[3], width: 240 },
        { ...commonColumns[4], width: 108 },
        { ...commonColumns[5], width: 196 },
      ]
    : [
        { ...commonColumns[0], width: 369, title: 'Token Name' },
        { ...commonColumns[1], width: 218 },
        { ...commonColumns[2], width: 219 },
        { ...commonColumns[3], width: 174 },
        { ...commonColumns[4], width: 108 },
        { ...commonColumns[5], width: 224 },
      ];
};

export default getColumns;
