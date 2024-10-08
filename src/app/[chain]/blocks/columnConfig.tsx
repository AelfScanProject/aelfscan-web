/*
 * @Author: Peterbjx jianxiong.bai@aelf.io
 * @Date: 2023-08-14 18:13:54
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-16 16:28:28
 * @Description: columns config
 */
import { ColumnsType } from 'antd/es/table';
import { addSymbol, divDecimals, formatDate } from '@_utils/formatter';
import addressFormat, { hiddenAddress } from '@_utils/urlUtils';
import Link from 'next/link';
import Copy from '@_components/Copy';
import { IBlocksResponseItem } from '@_api/type';
import { MULTI_CHAIN } from '@_utils/contant';
import ChainTags from '@_components/ChainTags';
export default function getColumns({ timeFormat, handleTimeChange, chianId }): ColumnsType<IBlocksResponseItem> {
  return chianId === MULTI_CHAIN
    ? [
        {
          title: 'Chain',
          width: 144,
          dataIndex: 'chainIds',
          key: 'chainIds',
          render: (chainIds) => <ChainTags chainIds={chainIds || []} />,
        },
        {
          title: 'Block',
          width: '112px',
          dataIndex: 'blockHeight',
          key: 'blockHeight',
          render: (text, record) => (
            <Link
              className="block text-sm leading-[22px] text-link"
              href={`/${record.chainIds ? record.chainIds[0] : chianId}/block/${text}`}>
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
          width: '208px',
          dataIndex: 'timestamp',
          key: 'timestamp',
          render: (text) => {
            return <div className="text-sm leading-[22px]">{formatDate(text, timeFormat)}</div>;
          },
        },
        {
          title: 'Txn',
          width: '160px',
          key: 'transactionCount',
          dataIndex: 'transactionCount',
          render: (text, record) => (
            <Link
              className="block text-sm leading-[22px] text-link"
              href={`/${record.chainIds ? record.chainIds[0] : chianId}/block/${record.blockHeight}?tab=transactions`}>
              {text}
            </Link>
          ),
        },
        {
          title: 'Producer',
          key: 'producerAddress',
          width: '272px',
          dataIndex: 'producerAddress',
          render: (address, record) => (
            <div className="flex items-center">
              <Link
                className="block text-sm leading-[22px] text-link"
                title={`${addressFormat(address, chianId)}`}
                href={`/${record.chainIds ? record.chainIds[0] : chianId}/address/${addressFormat(address, chianId)}`}>
                {record.producerName ? record.producerName : `${addressFormat(hiddenAddress(address, 4, 4), chianId)}`}
              </Link>
              <Copy value={addressFormat(address, chianId)} />
            </div>
          ),
        },
        {
          title: 'Reward',
          width: '208px',
          key: 'reward',
          dataIndex: 'reward',
          render: (reward: string) => {
            return <>{addSymbol(divDecimals(reward))}</>;
          },
        },
        {
          title: 'Burnt Fees',
          // width: '208px',
          key: 'burntFees',
          dataIndex: 'burntFees',
          render: (value: string) => {
            return <>{addSymbol(divDecimals(value))}</>;
          },
        },
      ]
    : [
        {
          title: 'Block',
          width: '96px',
          dataIndex: 'blockHeight',
          key: 'blockHeight',
          render: (text, record) => (
            <Link
              className="block text-sm leading-[22px] text-link"
              href={`/${record.chainIds ? record.chainIds[0] : chianId}/block/${text}`}>
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
          width: '208px',
          dataIndex: 'timestamp',
          key: 'timestamp',
          render: (text) => {
            return <div className="text-sm leading-[22px]">{formatDate(text, timeFormat)}</div>;
          },
        },
        {
          title: 'Txn',
          width: '208px',
          key: 'transactionCount',
          dataIndex: 'transactionCount',
          render: (text, record) => (
            <Link
              className="block text-sm leading-[22px] text-link"
              href={`/${record.chainIds ? record.chainIds[0] : chianId}/block/${record.blockHeight}?tab=transactions`}>
              {text}
            </Link>
          ),
        },
        {
          title: 'Producer',
          key: 'producerAddress',
          width: '320px',
          dataIndex: 'producerAddress',
          render: (address, record) => (
            <div className="flex items-center">
              <Link
                className="block text-sm leading-[22px] text-link"
                title={`${addressFormat(address, chianId)}`}
                href={`/${record.chainIds ? record.chainIds[0] : chianId}/address/${addressFormat(address, chianId)}`}>
                {record.producerName ? record.producerName : `${addressFormat(hiddenAddress(address, 4, 4), chianId)}`}
              </Link>
              <Copy value={addressFormat(address, chianId)} />
            </div>
          ),
        },
        {
          title: 'Reward',
          width: '208px',
          key: 'reward',
          dataIndex: 'reward',
          render: (reward: string) => {
            return <>{addSymbol(divDecimals(reward))}</>;
          },
        },
        {
          title: 'Burnt Fees',
          width: '208px',
          key: 'burntFees',
          dataIndex: 'burntFees',
          render: (value: string) => {
            return <>{addSymbol(divDecimals(value))}</>;
          },
        },
      ];
}
