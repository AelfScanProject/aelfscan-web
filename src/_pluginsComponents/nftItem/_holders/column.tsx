import React from 'react';
import { ColumnsType } from 'antd/es/table';
import { Address, HolderItem } from '../type';
import ContractToken from '@_components/ContractToken';
import { thousandsNumber } from '@_utils/formatter';
import ChainTags from '@_components/ChainTags';

function renderRank(currentPage, pageSize) {
  return (text, record, index) => (currentPage - 1) * pageSize + index + 1;
}

function renderAddress(chain, data: Address) {
  const { name, addressType, address } = data;
  return (
    <div className="address flex items-center">
      <ContractToken name={name} type={addressType} address={address} chainId={chain} />
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

export default function getColumns(currentPage, pageSize, chain, multi): ColumnsType<HolderItem> {
  const commonColumns = [
    {
      title: <span>#</span>,
      dataIndex: '',
      key: 'rank',
      render: renderRank(currentPage, pageSize),
    },
    {
      dataIndex: 'address',
      key: 'address',
      title: (
        <div>
          <span>Address</span>
        </div>
      ),
      render: (data: Address) => renderAddress(chain, data),
    },
    {
      title: <span>Quantity</span>,
      dataIndex: 'quantity',
      key: 'quantity',
      render: renderQuantity,
    },
    {
      title: <span>Percentage</span>,
      dataIndex: 'percentage',
      key: 'percentage',
      render: renderPercentage,
    },
  ];

  if (multi) {
    return [
      { ...commonColumns[0], width: 128 },
      { ...commonColumns[1], width: 384 },
      {
        title: 'Chain',
        width: 224,
        dataIndex: 'chainIds',
        key: 'chainIds',
        render: (chainIds) => <ChainTags chainIds={chainIds || []} />,
      },
      { ...commonColumns[2], width: 304 },
      { ...commonColumns[3], width: 304 },
    ];
  }

  return [
    { ...commonColumns[0], width: 144 },
    { ...commonColumns[1], width: 448 },
    { ...commonColumns[2], width: 384 },
    { ...commonColumns[3], width: 384 },
  ];
}
