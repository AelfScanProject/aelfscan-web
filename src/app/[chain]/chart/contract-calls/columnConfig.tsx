import { AddressType } from '@_types/common';
import { thousandsNumber } from '@_utils/formatter';
import { ColumnsType } from 'antd/es/table';
import { INodeBlockProduceData } from '../type';
import ContractToken from '@_components/ContractToken';

export default function getColumns({ chain }): ColumnsType<INodeBlockProduceData> {
  return [
    {
      title: '#',
      width: 80,
      dataIndex: 'rank',
      key: 'rank',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Contract',
      width: 316,
      dataIndex: 'contractAddress',
      key: 'contractAddress',
      render: (text) => <ContractToken address={text} chainId={chain} type={AddressType.address}></ContractToken>,
    },
    {
      title: 'Contract Name',
      width: 256,
      dataIndex: 'contractName',
      key: 'contractName',
      render: (name) => <span className="text-link">{name}</span>,
    },
    {
      title: 'Calls',
      width: 256,
      dataIndex: 'callCount',
      key: 'callCount',
      render: (text) => thousandsNumber(text),
    },
    {
      title: 'Percentage of Calls',
      width: 256,
      dataIndex: 'callRate',
      key: 'callRate',
      render: (text) => text + '%',
    },
    {
      title: 'Callers',
      width: 164,
      align: 'right',
      dataIndex: 'callAddressCount',
      key: 'callAddressCount',
      render: (text) => thousandsNumber(text),
    },
  ];
}
