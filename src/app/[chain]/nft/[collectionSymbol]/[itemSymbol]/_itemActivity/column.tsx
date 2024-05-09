/*
 * @Author: Peterbjx jianxiong.bai@aelf.io
 * @Date: 2023-08-14 18:13:54
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-18 16:22:36
 * @Description: columns config
 */
import { ColumnsType } from 'antd/es/table';
import { IActivityTableData } from '../type';
import { formatDate } from '@_utils/formatter';
import Copy from '@_components/Copy';
import Link from 'next/link';
import IconFont from '@_components/IconFont';
import ContractToken from '@_components/ContractToken';
import { AddressType } from '@_types/common';
import TransactionsView from '@_components/TransactionsView';
import EPTooltip from '@_components/EPToolTip';
import Market from '@_components/Market';

export default function getColumns({ timeFormat, handleTimeChange, chainId }): ColumnsType<IActivityTableData> {
  return [
    {
      title: (
        <EPTooltip title="See preview of the transaction details." mode="dark">
          <IconFont className="ml-[6px] cursor-pointer text-xs" type="question-circle" />
        </EPTooltip>
      ),
      width: 40,
      dataIndex: '',
      key: 'view',
      render: (record) => <TransactionsView record={record} />,
    },
    {
      dataIndex: 'transactionId',
      width: 224,
      key: 'transactionId',
      title: (
        <div>
          <span>Txn Hash</span>
        </div>
      ),
      render: (text, records) => {
        return (
          <div className="flex items-center">
            <EPTooltip title={text} mode="dark">
              <Link
                className="block w-[120px] truncate text-link"
                href={`/${chainId}/tx/${text}?blockHeight=${records.blockHeight}`}>
                {text}
              </Link>
            </EPTooltip>
            <Copy value={text}></Copy>
          </div>
        );
      },
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
      width: 224,
      dataIndex: 'blockTime',
      key: 'blockTime',
      render: (text) => {
        return <div className="text-xs leading-5">{formatDate(text, timeFormat)}</div>;
      },
    },
    {
      title: 'Action',
      width: 112,
      dataIndex: 'action',
      key: 'action',
      render: (text) => {
        return (
          <div>
            <span>{text}</span>
          </div>
        );
      },
    },
    {
      title: '',
      width: 50,
      dataIndex: 'market',
      key: 'market',
      render: (text, record) => {
        return <div>{record.action === 'Sale' && <Market />}</div>;
      },
    },
    {
      title: 'Price',
      width: 190,
      dataIndex: 'price',
      key: 'price',
      render: (text, record) => {
        return (
          record.action === 'Sale' && (
            <div>
              <span>${record.priceOfUsd}</span>
              <span className="text-xs leading-5 text-base-200">
                ({text} {record.priceSymbol})
              </span>
            </div>
          )
        );
      },
    },
    {
      dataIndex: 'from',
      title: 'From',
      width: 196,
      render: (from) => {
        const { address } = from;
        return <ContractToken name={address.name} address={address} type={AddressType.address} chainId={chainId} />;
      },
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
      // width: 196,
      render: (to) => {
        const { address } = to;
        return <ContractToken name={address.name} address={address} type={AddressType.address} chainId={chainId} />;
      },
    },
  ];
}
