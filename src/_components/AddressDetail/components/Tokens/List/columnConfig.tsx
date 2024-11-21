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
import { MULTI_CHAIN } from '@_utils/contant';

const renderTokenLink = (record, chain) => (
  <Link
    href={
      record.type === TokenTypeEnum.nft
        ? `/nftItem?chainId=${MULTI_CHAIN}&itemSymbol=${record.token.symbol}`
        : `/${MULTI_CHAIN}/token/${record.token.symbol}`
    }>
    <TokenTableCell showSymbol={false} token={record.token}>
      <TokenImage token={record.token} />
    </TokenTableCell>
  </Link>
);

const renderSymbol = (text, record) => (
  <span className="inline-block max-w-[181px] truncate leading-5">{record.token?.symbol}</span>
);

const renderQuantity = (text) => (
  <EPTooltip mode="dark" title={thousandsNumber(text)}>
    <span className="inline-block max-w-[192px] truncate leading-5">{thousandsNumber(text)}</span>
  </EPTooltip>
);

const renderPrice = (text, record, showELF) =>
  showELF ? <span>{numberFormatter(record.priceOfElf)}</span> : <span>${thousandsNumber(text)}</span>;

const renderValue = (text, record, showELF) =>
  showELF ? <span>{numberFormatter(record.valueOfElf)}</span> : <span>${thousandsNumber(text)}</span>;

const renderChange24h = (text) => (
  <span className={clsx(text >= 0 ? 'text-success' : 'text-destructive', 'flex items-center')}>
    <IconFont className={clsx('mr-1 text-base')} type={text >= 0 ? 'arrow-up' : 'arrow-down-red'} />
    {text}%
  </span>
);

const getColumns = (sortedInfo, chain, showELF): ColumnsType<TokensListItemType> => {
  const commonColumns = [
    {
      title: 'Chain',
      width: 140,
      dataIndex: 'chainIds',
      key: 'chainIds',
      render: (chainIds) => <ChainTags chainIds={chainIds || []} />,
    },
    {
      title: 'Token Name',
      dataIndex: 'token',
      key: 'token',
      width: 224,
      render: (text, record) => renderTokenLink(record, chain),
    },
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      width: 224,
      className: 'sort-title-cell',
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
      className: 'sort-title-cell',
      width: 224,
      sortIcon: ({ sortOrder }) => <EPSortIcon sortOrder={sortOrder} />,
      sortOrder: sortedInfo?.columnKey === 'FormatAmount' ? sortedInfo.order : null,
      render: renderQuantity,
    },
    {
      title: 'Price',
      dataIndex: 'priceOfUsd',
      key: 'priceOfUsd',
      width: 224,
      render: (text, record) => renderPrice(text, record, showELF),
    },
    {
      title: 'Change(24H)',
      width: 140,
      dataIndex: 'priceOfUsdPercentChange24h',
      key: 'priceOfUsdPercentChange24h',
      render: renderChange24h,
    },
    {
      title: 'Value',
      dataIndex: 'valueOfUsd',
      width: 222,
      key: 'valueOfUsd',
      render: (text, record) => renderValue(text, record, showELF),
    },
  ];

  return commonColumns;
};

export default getColumns;
