/*
 * @Author: Peterbjx jianxiong.bai@aelf.io
 * @Date: 2023-08-14 18:13:54
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-18 16:22:36
 * @Description: columns config
 */
import { ColumnsType } from 'antd/es/table';
import { addSymbol, divDecimals, formatDate } from '@_utils/formatter';
import Link from 'next/link';
import IconFont from '@_components/IconFont';
import Method from '@_components/Method';
import ContractToken from '@_components/ContractToken';
import TransactionsView from '@_components/TransactionsView';
import { ITransactionsResponseItem, TransactionStatus } from '@_api/type';
import EPTooltip from '@_components/EPToolTip';
import Copy from '@_components/Copy';
import ChainTags from '@_components/ChainTags';
import { MULTI_CHAIN } from '@_utils/contant';

export default function getColumns({
  timeFormat,
  handleTimeChange,
  chainId = 'AELF',
  type,
}): ColumnsType<ITransactionsResponseItem> {
  return chainId === MULTI_CHAIN
    ? [
        {
          title: (
            <EPTooltip title="See preview of the transaction details." mode="dark">
              <IconFont className="ml-[6px] cursor-pointer text-xs" type="question-circle" />
            </EPTooltip>
          ),
          width: 72,
          dataIndex: '',
          key: 'view',
          render: (record) => <TransactionsView record={record} />,
        },
        {
          title: 'Chain',
          width: 100,
          dataIndex: 'chainIds',
          key: 'chainIds',
          render: (chainIds) => <ChainTags chainIds={chainIds} />,
        },
        {
          dataIndex: 'transactionId',
          width: 168,
          key: 'transactionId',
          title: 'Txn Hash',
          render: (text, records) => {
            return (
              <div className="flex items-center">
                {records.status === TransactionStatus.Failed && (
                  <IconFont className="mr-1" type="question-circle-error" />
                )}
                <EPTooltip title={text} mode="dark">
                  <Link
                    className="block w-[120px] truncate text-link"
                    href={`/${(records?.chainIds && records?.chainIds[0]) || chainId}/tx/${text}`}>
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
            <div className="cursor-pointer font-medium">
              <span>Method</span>
              <EPTooltip title="Function executed based on input data. " mode="dark">
                <IconFont className="ml-1 text-xs" type="question-circle" />
              </EPTooltip>
            </div>
          ),
          width: 128,
          dataIndex: 'method',
          key: 'method',
          render: (text) => <Method text={text} tip={text} />,
        },
        {
          title: 'Block',
          width: 112,
          dataIndex: 'blockHeight',
          hidden: type === 'block',
          key: 'blockHeight',
          render: (text, records) => (
            <Link
              className="block text-link"
              href={`/${(records?.chainIds && records?.chainIds[0]) || chainId}/block/${text}`}>
              {text}
            </Link>
          ),
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
          width: 144,
          dataIndex: 'timestamp',
          key: 'timestamp',
          render: (text) => {
            return <div>{formatDate(text, timeFormat)}</div>;
          },
        },
        {
          dataIndex: 'from',
          title: 'From',
          width: 196,
          render: (fromData, records) => {
            const { address } = fromData;
            return (
              <ContractToken
                address={address}
                name={fromData.name}
                chainId={(records?.chainIds && records?.chainIds[0]) || chainId}
                type={fromData.addressType}
              />
            );
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
          render: (toData, records) => {
            const { address } = toData;
            return (
              <ContractToken
                address={address}
                name={toData.name}
                chainId={(records?.chainIds && records?.chainIds[0]) || chainId}
                type={toData.addressType}
              />
            );
          },
        },
        {
          title: 'Value',
          width: 128,
          key: 'transactionValue',
          dataIndex: 'transactionValue',
          render: (text) => {
            return (
              <span className="break-all text-base-100">{text || text === 0 ? addSymbol(divDecimals(text)) : '-'}</span>
            );
          },
        },
        {
          title: 'Txn Fee',
          width: 108,
          key: 'transactionFee',
          dataIndex: 'transactionFee',
          render: (text) => {
            return <span className="break-all text-base-200">{addSymbol(divDecimals(text))}</span>;
          },
        },
      ]
    : [
        {
          title: (
            <EPTooltip title="See preview of the transaction details." mode="dark">
              <IconFont className="ml-[6px] cursor-pointer text-xs" type="question-circle" />
            </EPTooltip>
          ),
          width: 72,
          dataIndex: '',
          key: 'view',
          render: (record) => <TransactionsView record={record} />,
        },
        {
          dataIndex: 'transactionId',
          width: 168,
          key: 'transactionId',
          title: 'Txn Hash',
          render: (text, records) => {
            return (
              <div className="flex items-center">
                {records.status === TransactionStatus.Failed && (
                  <IconFont className="mr-1" type="question-circle-error" />
                )}
                <EPTooltip title={text} mode="dark">
                  <Link
                    className="block w-[120px] truncate text-link"
                    href={`/${(records?.chainIds && records?.chainIds[0]) || chainId}/tx/${text}`}>
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
            <div className="cursor-pointer font-medium">
              <span>Method</span>
              <EPTooltip title="Function executed based on input data. " mode="dark">
                <IconFont className="ml-1 text-xs" type="question-circle" />
              </EPTooltip>
            </div>
          ),
          width: 128,
          dataIndex: 'method',
          key: 'method',
          render: (text) => <Method text={text} tip={text} />,
        },
        {
          title: 'Block',
          width: 112,
          dataIndex: 'blockHeight',
          hidden: type === 'block',
          key: 'blockHeight',
          render: (text, records) => (
            <Link
              className="block text-link"
              href={`/${(records?.chainIds && records?.chainIds[0]) || chainId}/block/${text}`}>
              {text}
            </Link>
          ),
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
          width: 144,
          dataIndex: 'timestamp',
          key: 'timestamp',
          render: (text) => {
            return <div>{formatDate(text, timeFormat)}</div>;
          },
        },
        {
          dataIndex: 'from',
          title: 'From',
          width: 196,
          render: (fromData, records) => {
            const { address } = fromData;
            return (
              <ContractToken
                address={address}
                name={fromData.name}
                chainId={(records?.chainIds && records?.chainIds[0]) || chainId}
                type={fromData.addressType}
              />
            );
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
          render: (toData, records) => {
            const { address } = toData;
            return (
              <ContractToken
                address={address}
                name={toData.name}
                chainId={(records?.chainIds && records?.chainIds[0]) || chainId}
                type={toData.addressType}
              />
            );
          },
        },
        {
          title: 'Value',
          width: 148,
          key: 'transactionValue',
          dataIndex: 'transactionValue',
          render: (text) => {
            return (
              <span className="break-all text-base-100">{text || text === 0 ? addSymbol(divDecimals(text)) : '-'}</span>
            );
          },
        },
        {
          title: 'Txn Fee',
          width: 158,
          key: 'transactionFee',
          dataIndex: 'transactionFee',
          render: (text) => {
            return <span className="break-all text-base-200">{addSymbol(divDecimals(text))}</span>;
          },
        },
      ];
}
