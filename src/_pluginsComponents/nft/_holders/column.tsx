import React from 'react';
import { ColumnsType } from 'antd/es/table';
import { Address, HolderItem } from '../type';
import ContractToken from '@_components/ContractToken';
import { thousandsNumber } from '@_utils/formatter';
import ChainTags from '@_components/ChainTags';
import { AddressType } from '@_types/common';

function renderAddress(data: Address, record) {
  const { addressType, address } = data;
  return (
    <div className="address flex items-center">
      <ContractToken
        type={addressType}
        showContractAddress={addressType === AddressType.Contract}
        address={address}
        chainIds={record.chainIds}
        onlyCopy
      />
    </div>
  );
}

function getCommonColumns(currentPage, pageSize): ColumnsType<HolderItem> {
  return [
    {
      title: <span>#</span>,
      dataIndex: '',
      width: 100,
      key: 'rank',
      render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      dataIndex: 'address',
      width: 393,
      key: 'address',
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
      render: (quantity) => <span>{thousandsNumber(quantity)}</span>,
    },
    {
      title: <span>Percentage</span>,
      dataIndex: 'percentage',
      width: 391,
      key: 'percentage',
      render: (percentage) => <span>{percentage}%</span>,
    },
  ];
}

export default getCommonColumns;
