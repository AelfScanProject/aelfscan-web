import React from 'react';
import { ColumnsType } from 'antd/es/table';
import { Address, HolderItem } from '../type';
import ContractToken from '@_components/ContractToken';
import { thousandsNumber } from '@_utils/formatter';
import ChainTags from '@_components/ChainTags';

function renderRank(currentPage, pageSize) {
  return (text, record, index) => (currentPage - 1) * pageSize + index + 1;
}

function renderAddress(data: Address, record) {
  const { name, addressType, address } = data;
  return (
    <div className="address flex items-center">
      <ContractToken name={name} type={addressType} address={address} chainIds={record.chainIds} onlyCopy />
    </div>
  );
}

renderAddress.displayName = 'RenderAddress';

function renderQuantity(quantity) {
  return <span>{thousandsNumber(quantity)}</span>;
}

function renderPercentage(percentage) {
  return <span>{percentage}%</span>;
}

export default function getColumns(currentPage, pageSize): ColumnsType<HolderItem> {
  const commonColumns = [
    {
      title: <span>#</span>,
      dataIndex: '',
      width: 100,
      key: 'rank',
      render: renderRank(currentPage, pageSize),
    },
    {
      dataIndex: 'address',
      key: 'address',
      width: 393,
      title: (
        <div>
          <span>Address</span>
        </div>
      ),
      render: (data: Address, record) => renderAddress(data, record),
    },
    {
      title: 'Chain',
      width: 120,

      dataIndex: 'chainIds',
      key: 'chainIds',
      render: (chainIds) => <ChainTags showIcon chainIds={chainIds || []} />,
    },
    {
      title: <span>Quantity</span>,
      dataIndex: 'quantity',
      width: 393,
      key: 'quantity',
      render: renderQuantity,
    },
    {
      title: <span>Percentage</span>,
      dataIndex: 'percentage',
      key: 'percentage',
      width: 391,
      render: renderPercentage,
    },
  ];

  return commonColumns;
}
