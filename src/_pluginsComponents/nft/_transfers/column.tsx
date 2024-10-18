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

const renderTransactionId = (text, records, chainId) => (
  <div className="flex items-center">
    {records.status === TransactionStatus.Failed && <IconFont className="mr-1" type="question-circle-error" />}
    <EPTooltip title={text} mode="dark">
      <Link
        className="block w-[120px] truncate text-link"
        href={`/${records.chainIds ? records.chainIds[0] : chainId}/tx/${text}?blockHeight=${records.blockHeight}`}>
        {text}
      </Link>
    </EPTooltip>
    <Copy value={text}></Copy>
  </div>
);

const renderContractToken = (data, records, chainId) => (
  <ContractToken
    address={data.address}
    name={data.name}
    chainId={records.chainIds ? records.chainIds[0] : chainId}
    type={data.addressType}
  />
);

const renderNFTItem = (item: CollectionTransferItemProperty) => (
  <div className="collection-transfer-item">
    <div className="mr-[4px] size-[40px] rounded-lg">
      <NFTImage width="40px" height="40px" src={item.imageUrl} />
    </div>
    <div>
      <div className="name h-[20px] w-[140px] truncate leading-20">{item.name}</div>
      <div className="symbol h-[18px] w-[124px] truncate leading-20">{item.symbol}</div>
    </div>
  </div>
);

export default function getColumns({ timeFormat, handleTimeChange, chainId, multi }): ColumnsType<CollectionTransfer> {
  const commonColumns = [
    {
      title: (
        <EPTooltip title="See preview of the transaction details." mode="dark">
          <IconFont className="ml-[6px] cursor-pointer text-xs" type="question-circle" />
        </EPTooltip>
      ),
      width: 40,
      dataIndex: '',
      key: 'view',
      render: (record) => <TransactionsView record={record} custom={true} />,
    },
    {
      dataIndex: 'transactionId',
      width: 168,
      key: 'transactionId',
      title: (
        <div>
          <span>Txn Hash</span>
        </div>
      ),
      render: (text, records) => renderTransactionId(text, records, chainId),
    },
    {
      dataIndex: 'method',
      width: 128,
      key: 'method',
      title: (
        <div className="cursor-pointer font-medium">
          <span>Method</span>
          <EPTooltip title="Function executed based on input data." mode="dark">
            <IconFont className="ml-1 text-xs" type="question-circle" />
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
      width: multi ? 160 : 144,
      dataIndex: 'blockTime',
      key: 'blockTime',
      render: (text) => <div>{formatDate(text, timeFormat)}</div>,
    },
    {
      dataIndex: 'from',
      title: 'From',
      width: 196,
      render: (fromData, records) => renderContractToken(fromData, records, chainId),
    },
    {
      title: '',
      width: 40,
      dataIndex: '',
      key: 'from_to',
      render: () => <IconFont className="text-[24px]" type="fromto" />,
    },
    {
      dataIndex: 'to',
      title: 'To',
      width: 196,
      render: (toData, records) => renderContractToken(toData, records, chainId),
    },
    {
      title: 'Value',
      width: multi ? 144 : 192,
      dataIndex: 'value',
      key: 'value',
      render: (text) => <span>{thousandsNumber(text)}</span>,
    },
    {
      title: 'Item',
      width: 224,
      dataIndex: 'item',
      key: 'item',
      render: (item: CollectionTransferItemProperty) => renderNFTItem(item),
    },
  ];

  if (multi) {
    commonColumns.splice(1, 0, {
      title: 'Chain',
      width: 144,
      dataIndex: 'chainIds',
      key: 'chainIds',
      render: (chainIds) => <ChainTags chainIds={chainIds || []} />,
    });
  }

  return commonColumns;
}
