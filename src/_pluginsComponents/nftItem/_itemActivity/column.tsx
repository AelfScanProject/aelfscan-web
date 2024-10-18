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

const renderTransactionId = (text, records, chainId) => (
  <div className="flex items-center">
    <EPTooltip title={text} mode="dark">
      <Link className="block w-[120px] truncate text-link" href={`/${chainId}/tx/${text}`}>
        {text}
      </Link>
    </EPTooltip>
    <Copy value={text} />
  </div>
);

const renderContractToken = (data, chainId) => {
  if (!data) return <div></div>;
  const { address, name } = data;
  return <ContractToken name={name} address={getAddress(address)} type={AddressType.address} chainId={chainId} />;
};

const renderPrice = (text, record) =>
  record.action === 'Sale' && (
    <div>
      <span>${record.priceOfUsd}</span>
      <span className="text-xs leading-5 text-base-200">
        ({record.price} {record.priceSymbol})
      </span>
    </div>
  );

export default function getColumns({
  timeFormat,
  handleTimeChange,
  chainId,
  detailData,
  multi,
}): ColumnsType<IActivityTableData> {
  const commonColumns = [
    {
      title: 'Txn Hash',
      dataIndex: 'transactionId',
      key: 'transactionId',
      render: (text, records) => renderTransactionId(text, records, chainId),
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
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text) => <span>{text}</span>,
    },
    {
      title: '',
      dataIndex: 'market',
      key: 'market',
      render: (text, record) => (
        <div>{record.action === 'Sale' && <Market url={detailData?.marketPlaces?.marketLogo} />}</div>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: renderPrice,
    },
    {
      dataIndex: 'from',
      title: 'From',
      render: (from, records) => renderContractToken(from, (records.chainIds && records.chainIds[0]) || chainId),
    },
    {
      title: '',
      key: 'from_to',
      render: () => <IconFont className="text-[24px]" type="fromto" />,
    },
    {
      dataIndex: 'to',
      title: 'To',
      render: (to, records) => renderContractToken(to, (records.chainIds && records.chainIds[0]) || chainId),
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
        { ...commonColumns[0], width: 200 },
        { ...commonColumns[1], width: 200 },
        { ...commonColumns[2], width: 112 },
        { ...commonColumns[3], width: 90 },
        { ...commonColumns[4], width: 190 },
        { ...commonColumns[5], width: 196 },
        { ...commonColumns[6], width: 40 },
        { ...commonColumns[7] },
      ]
    : [
        { ...commonColumns[0], width: 224 },
        { ...commonColumns[1], width: 224 },
        { ...commonColumns[2], width: 112 },
        { ...commonColumns[3], width: 90 },
        { ...commonColumns[4], width: 190 },
        { ...commonColumns[5], width: 196 },
        { ...commonColumns[6], width: 40 },
        { ...commonColumns[7] },
      ];
}
