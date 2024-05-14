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

export default function getColumns(sortedInfo, chain, showELF): ColumnsType<TokensListItemType> {
  return [
    {
      dataIndex: 'token',
      width: 369,
      key: 'token',
      title: 'Token Name',
      render: (token) => {
        return (
          <Link href={`/${chain}/token/${token.symbol}`}>
            <TokenTableCell showSymbol={false} token={token}>
              <TokenImage token={token} />
            </TokenTableCell>
          </Link>
        );
      },
    },
    {
      title: 'Symbol',
      width: 218,
      dataIndex: 'symbol',
      key: 'Symbol',
      sorter: true,
      sortIcon: ({ sortOrder }) => <EPSortIcon sortOrder={sortOrder} />,
      sortOrder: sortedInfo?.columnKey === 'Symbol' ? sortedInfo.order : null,
      render: (text, record) => (
        <span className="inline-block max-w-[181px] truncate leading-5 text-base-100">{record.token?.symbol}</span>
      ),
    },
    {
      title: 'Quantity',
      width: 219,
      dataIndex: 'quantity',
      key: 'FormatAmount',
      sorter: true,
      sortIcon: ({ sortOrder }) => <EPSortIcon sortOrder={sortOrder} />,
      sortOrder: sortedInfo?.columnKey === 'FormatAmount' ? sortedInfo.order : null,
      render: (text) => (
        <EPTooltip mode="dark" title={thousandsNumber(text)}>
          <span className="inline-block max-w-[124px] truncate leading-5 text-base-100">{thousandsNumber(text)}</span>
        </EPTooltip>
      ),
    },
    {
      title: 'Price',
      width: 174,
      dataIndex: 'priceOfUsd',
      key: 'priceOfUsd',
      render: (text, record) => (
        <>{showELF ? <span>{numberFormatter(record.priceOfElf)}</span> : <span>${thousandsNumber(text)}</span>}</>
      ),
    },
    {
      title: 'Change(24H)',
      width: 108,
      dataIndex: 'priceOfUsdPercentChange24h',
      key: 'priceOfUsdPercentChange24h',
      render: (text) => (
        <span className={clsx(text >= 0 ? 'text-positive' : 'text-rise-red')}>
          <IconFont className={clsx(text >= 0 && 'rotate-180', 'mr-1 text-xs')} type="down-aa9i0lma" />
          {text}%
        </span>
      ),
    },
    {
      title: 'Value',
      width: 224,
      dataIndex: 'valueOfUsd',
      key: 'valueOfUsd',
      render: (text, record) => (
        <>{showELF ? <span>{numberFormatter(record.valueOfElf)}</span> : <span>${thousandsNumber(text)}</span>}</>
      ),
    },
  ];
}
