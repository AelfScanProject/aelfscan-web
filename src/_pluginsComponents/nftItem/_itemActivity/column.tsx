import React from 'react';
import { ColumnsType } from 'antd/es/table';
import { IActivityTableData } from '../type';
import { formatDate, getAddress } from '@_utils/formatter';
import Copy from '@_components/Copy';
import Link from 'next/link';
import IconFont from '@_components/IconFont';
import ContractToken from '@_components/ContractToken';
import { AddressType } from '@_types/common';
import EPTooltip from '@_components/EPToolTip';
import Market from '@_components/Market';
import dayjs from 'dayjs';
import ChainTags from '@_components/ChainTags';
import Method from '@_components/Method';
import TransactionsView from '@_components/TransactionsView';

const renderTransactionId = (text, records) => (
  <div className="flex items-center">
    <EPTooltip title={text} mode="dark">
      <Link className="block w-[120px] truncate text-link" href={`/${records.chainIds[0]}/tx/${text}`}>
        {text}
      </Link>
    </EPTooltip>
    <Copy value={text} />
  </div>
);

const renderContractToken = (data, chainIds) => {
  if (!data) return <div></div>;
  const { address, name } = data;
  return (
    <ContractToken name={name} address={getAddress(address)} type={AddressType.address} chainIds={chainIds} onlyCopy />
  );
};

const renderPrice = (text, record) =>
  record.action === 'Sale' && (
    <div className="text-sm">
      <span className="text-foreground">${record.priceOfUsd}</span>
      <span className="text-muted-foreground">
        ({record.price} {record.priceSymbol})
      </span>
    </div>
  );

export default function getColumns({ timeFormat, handleTimeChange, detailData }): ColumnsType<IActivityTableData> {
  const commonColumns = [
    {
      title: (
        <EPTooltip title="See preview of the transaction details." mode="dark">
          <IconFont className="ml-[6px] cursor-pointer text-base" type="circle-help" />
        </EPTooltip>
      ),
      width: 60,
      dataIndex: '',
      key: 'view',
      render: (record) => <TransactionsView record={record} custom={true} jumpChain={record.chainIds[0]} />,
    },
    {
      title: 'Chain',
      width: 140,
      dataIndex: 'chainIds',
      key: 'chainIds',
      render: (chainIds) => <ChainTags chainIds={chainIds || []} />,
    },
    {
      title: 'Txn Hash',
      dataIndex: 'transactionId',
      width: 177,
      key: 'transactionId',
      render: (text, records) => renderTransactionId(text, records),
    },
    {
      dataIndex: 'action',
      key: 'action',
      width: 130,
      title: (
        <div className="cursor-pointer font-medium">
          <span>Action</span>
          <EPTooltip title="Function executed based on input data." mode="dark">
            <IconFont className="ml-1 text-base" type="circle-help" />
          </EPTooltip>
        </div>
      ),
      render: (text) => <Method text={text} tip={text} />,
    },
    {
      title: (
        <div
          className="time cursor-pointer font-medium text-link"
          onClick={handleTimeChange}
          onKeyDown={handleTimeChange}>
          {timeFormat}
        </div>
      ),
      dataIndex: 'blockTime',
      key: 'blockTime',
      render: (text) => <div>{formatDate(dayjs(text).unix().valueOf(), timeFormat)}</div>,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      width: 240,
      key: 'price',
      render: renderPrice,
    },
    {
      dataIndex: 'from',
      title: 'From',
      width: 257,
      render: (from, records) => renderContractToken(from, records.chainIds),
    },
    {
      title: '',
      width: 24,
      className: 'from_to-col',
      render: () => <IconFont className="text-[24px]" type="From-To" />,
    },
    {
      dataIndex: 'to',
      title: 'To',
      width: 255,
      render: (to, records) => renderContractToken(to, records.chainIds),
    },
  ];

  return commonColumns;
}
