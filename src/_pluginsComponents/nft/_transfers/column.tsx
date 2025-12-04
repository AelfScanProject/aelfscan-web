import React from 'react';
import { ColumnsType } from 'antd/es/table';
import { CollectionTransfer, CollectionTransferItemProperty } from '../type';
import { formatDate, thousandsNumber } from '@_utils/formatter';
import Copy from '@_components/Copy';
import Link from 'next/link';
import IconFont from '@_components/IconFont';
import ContractToken from '@_components/ContractToken';
import TransactionsView from '@_components/TransactionsView';
import EPTooltip from '@_components/EPToolTip';
import { TransactionStatus } from '@_api/type';
import Method from '@_components/Method';
import NFTImage from '@_components/NFTImage';
import ChainTags from '@_components/ChainTags';
import TokenImage from '@app/[chain]/tokens/_components/TokenImage';

const renderTransactionId = (text, records) => (
  <div className="flex items-center">
    {records.status === TransactionStatus.Failed && (
      <IconFont className="mr-1 text-base" type="question-circle-error" />
    )}
    <EPTooltip title={text} mode="dark">
      <Link
        className="block w-[120px] truncate text-primary"
        href={`/${records.chainIds && records.chainIds[0]}/tx/${text}`}>
        {text}
      </Link>
    </EPTooltip>
    <Copy value={text}></Copy>
  </div>
);

const renderContractToken = (data, records) => (
  <ContractToken address={data.address} name={data.name} chainIds={records.chainIds} type={data.addressType} onlyCopy />
);

const renderNFTItem = (item: CollectionTransferItemProperty) => (
  <div className="item-container flex items-center">
    <TokenImage width="40px" height="40px" token={{ name: item.name, imageUrl: item.imageUrl, symbol: item.symbol }} />
    <div className="info ml-1">
      <div className="name max-w-[139px] truncate text-sm">{item.name}</div>
      <div className="message flex items-center leading-[18px]">
        <span className="inline-block max-w-[149.39759px] truncate text-sm  text-muted-foreground">{item.symbol}</span>
      </div>
    </div>
  </div>
);

export default function getColumns({ timeFormat, handleTimeChange }): ColumnsType<CollectionTransfer> {
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
      dataIndex: 'transactionId',
      width: 177,
      key: 'transactionId',
      title: 'Txn Hash',
      render: (text, records) => renderTransactionId(text, records),
    },

    {
      dataIndex: 'method',
      width: 130,
      key: 'method',
      title: (
        <div className="cursor-pointer font-medium">
          <span>Method</span>
          <EPTooltip title="Function executed based on input data." mode="dark">
            <IconFont className="ml-1 text-base" type="circle-help" />
          </EPTooltip>
        </div>
      ),
      render: (text) => <Method text={text} tip={text} />,
    },
    {
      title: (
        <div className="time cursor-pointer text-primary" onClick={handleTimeChange} onKeyDown={handleTimeChange}>
          {timeFormat}
        </div>
      ),
      dataIndex: 'blockTime',
      key: 'blockTime',
      render: (text) => <div>{formatDate(text, timeFormat)}</div>,
    },
    {
      dataIndex: 'from',
      title: 'From',
      width: 200,
      render: (fromData, records) => renderContractToken(fromData, records),
    },
    {
      title: '',
      width: 24,
      dataIndex: '',
      className: 'from_to-col',
      key: 'from_to',
      render: () => <IconFont className="text-[24px]" type="From-To" />,
    },
    {
      dataIndex: 'to',
      title: 'To',
      width: 200,
      render: (toData, records) => renderContractToken(toData, records),
    },
    {
      title: 'Amount',
      width: 177,
      dataIndex: 'value',
      key: 'value',
      render: (text) => <span>{thousandsNumber(text)}</span>,
    },
    {
      title: 'Item',
      width: 175,
      dataIndex: 'item',
      key: 'item',
      render: (item: CollectionTransferItemProperty) => renderNFTItem(item),
    },
  ];

  return commonColumns;
}
