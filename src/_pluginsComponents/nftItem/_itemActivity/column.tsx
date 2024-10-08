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

export default function getColumns({
  timeFormat,
  handleTimeChange,
  chainId,
  detailData,
  multi,
}): ColumnsType<IActivityTableData> {
  return multi
    ? [
        {
          title: 'Chain',
          width: 144,
          dataIndex: 'chainIds',
          key: 'chainIds',
          render: (chainIds) => <ChainTags chainIds={chainIds || []} />,
        },
        {
          dataIndex: 'transactionId',
          width: 200,
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
                    href={`/${(records.chainIds && records.chainIds[0]) || chainId}/tx/${text}`}>
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
          width: 200,
          dataIndex: 'blockTime',
          key: 'blockTime',
          render: (text) => {
            return <div>{formatDate(dayjs(text).unix().valueOf(), timeFormat)}</div>;
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
          width: 90,
          dataIndex: 'market',
          key: 'market',
          render: (text, record) => {
            return <div>{record.action === 'Sale' && <Market url={detailData?.marketPlaces?.marketLogo} />}</div>;
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
          render: (from, records) => {
            if (!from) return <div></div>;
            const { address, name } = from;
            return (
              <ContractToken
                name={name}
                address={getAddress(address)}
                type={AddressType.address}
                chainId={(records.chainIds && records.chainIds[0]) || chainId}
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
          // width: 196,
          render: (to, records) => {
            if (!to) return <div></div>;
            const { address, name } = to;
            return (
              <ContractToken
                name={name}
                address={getAddress(address)}
                type={AddressType.address}
                chainId={(records.chainIds && records.chainIds[0]) || chainId}
              />
            );
          },
        },
      ]
    : [
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
            return <div>{formatDate(dayjs(text).unix().valueOf(), timeFormat)}</div>;
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
          width: 90,
          dataIndex: 'market',
          key: 'market',
          render: (text, record) => {
            return <div>{record.action === 'Sale' && <Market url={detailData?.marketPlaces?.marketLogo} />}</div>;
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
            if (!from) return <div></div>;
            const { address, name } = from;
            return (
              <ContractToken name={name} address={getAddress(address)} type={AddressType.address} chainId={chainId} />
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
          // width: 196,
          render: (to) => {
            if (!to) return <div></div>;
            const { address, name } = to;
            return (
              <ContractToken name={name} address={getAddress(address)} type={AddressType.address} chainId={chainId} />
            );
          },
        },
      ];
}
