import ContractToken from '@_components/ContractToken';
import { thousandsNumber } from '@_utils/formatter';
import { ColumnsType } from 'antd/es/table';
import { IHolderItem } from '../../type';
import ChainTags from '@_components/ChainTags';

const renderIndex = (currentPage, pageSize) => (text, record, index) => (currentPage - 1) * pageSize + index + 1;

const renderAddress = (data, record) => {
  const { address, addressType, name } = data;
  return <ContractToken address={address} name={name} type={addressType} onlyCopy chainIds={record.chainIds} />;
};

const renderQuantity = (text) => thousandsNumber(text);
const renderPercentage = (text) => `${thousandsNumber(text)}%`;
const renderValue = (text) => `$${thousandsNumber(text)}`;

export default function getColumns({ currentPage, pageSize }): ColumnsType<IHolderItem> {
  const commonColumns = [
    {
      title: '#',
      width: 100,
      dataIndex: 'index',
      key: 'index',
      render: renderIndex(currentPage, pageSize),
    },
    {
      title: 'Address',
      width: 295,
      dataIndex: 'address',
      key: 'address',
      render: (text, record) => renderAddress(text, record),
    },
    {
      title: 'Chain',
      width: 120,
      dataIndex: 'chainIds',
      key: 'chainIds',
      render: (chainIds) => <ChainTags showIcon chainIds={chainIds || []} />,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      width: 295,
      key: 'quantity',
      render: renderQuantity,
    },
    {
      title: 'Percentage',
      width: 295,
      dataIndex: 'percentage',
      key: 'percentage',
      render: renderPercentage,
    },
    {
      title: 'Value',
      width: 293,
      dataIndex: 'value',
      key: 'value',
      render: renderValue,
    },
  ];

  return commonColumns;
}
