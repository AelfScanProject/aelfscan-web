import React from 'react';
import { ColumnsType } from 'antd/es/table';
import { Address, HolderItem } from '../type';
import ContractToken from '@_components/ContractToken';
import { thousandsNumber } from '@_utils/formatter';

export default function getColumns(currentPage, pageSize, chain): ColumnsType<HolderItem> {
  return [
    {
      title: <span>#</span>,
      width: 144,
      dataIndex: '',
      key: 'rank',
      render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      dataIndex: 'address',
      width: 448,
      key: 'address',
      title: (
        <div>
          <span>Address</span>
        </div>
      ),
      render: (data: Address) => {
        const { name, addressType, address } = data;
        return (
          <div className="address flex items-center">
            <ContractToken name={name} type={addressType} address={address} chainId={chain} />
          </div>
        );
      },
    },
    {
      title: <span>Quantity</span>,
      width: 384,
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity) => <span>{thousandsNumber(quantity)}</span>,
    },
    {
      title: <span>Percentage</span>,
      width: 384,
      dataIndex: 'percentage',
      key: 'percentage',
      render: (percentage) => <span>{percentage}%</span>,
    },
  ];
}
