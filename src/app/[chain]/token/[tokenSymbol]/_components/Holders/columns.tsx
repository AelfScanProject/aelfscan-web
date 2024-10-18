import ContractToken from '@_components/ContractToken';
import { thousandsNumber } from '@_utils/formatter';
import { ColumnsType } from 'antd/es/table';
import { IHolderItem } from '../../type';
import ChainTags from '@_components/ChainTags';

const renderIndex = (currentPage, pageSize) => (text, record, index) => (currentPage - 1) * pageSize + index + 1;

const renderAddress = (chain, data) => {
  const { address, addressType } = data;
  return <ContractToken address={address} type={addressType} chainId={chain} />;
};

const renderQuantity = (text) => thousandsNumber(text);
const renderPercentage = (text) => `${thousandsNumber(text)}%`;
const renderValue = (text) => `$${thousandsNumber(text)}`;

export default function getColumns({ currentPage, pageSize, chain, multi }): ColumnsType<IHolderItem> {
  const commonColumns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      render: renderIndex(currentPage, pageSize),
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      render: (text) => renderAddress(chain, text),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: renderQuantity,
    },
    {
      title: 'Percentage',
      dataIndex: 'percentage',
      key: 'percentage',
      render: renderPercentage,
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      render: renderValue,
    },
  ];

  return multi
    ? [
        { ...commonColumns[0], width: 128 },
        { ...commonColumns[1], width: 320 },
        {
          title: 'Chain',
          width: 224,
          dataIndex: 'chainIds',
          key: 'chainIds',
          render: (chainIds) => <ChainTags chainIds={chainIds || []} />,
        },
        { ...commonColumns[2], width: 256 },
        { ...commonColumns[3], width: 208 },
        { ...commonColumns[4], width: 208 },
      ]
    : [
        { ...commonColumns[0], width: 112 },
        { ...commonColumns[1], width: 432 },
        { ...commonColumns[2], width: 240 },
        { ...commonColumns[3], width: 240 },
        { ...commonColumns[4], width: 240 },
      ];
}
