import EPTooltip from '@_components/EPToolTip';
import IconFont from '@_components/IconFont';
import { AddressType } from '@_types/common';
import { thousandsNumber } from '@_utils/formatter';
import { ColumnsType } from 'antd/es/table';
import { INodeBlockProduceData } from '../type';
import EPSortIcon from '@_components/EPSortIcon';
import ContractToken from '@_components/ContractToken';

export default function getColumns({ currentPage, pageSize, sortedInfo, chain }): ColumnsType<INodeBlockProduceData> {
  return [
    {
      title: '#',
      width: 80,
      dataIndex: 'rank',
      key: 'rank',
      render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: 'Name',
      width: 176,
      dataIndex: 'nodeName',
      key: 'nodeName',
      render: (name) => <span className="text-link">{name}</span>,
    },
    {
      title: 'Address',
      width: 216,
      dataIndex: 'nodeAddress',
      key: 'nodeAddress',
      render: (text) => <ContractToken address={text} chainId={chain} type={AddressType.address}></ContractToken>,
    },
    {
      title: 'Cycle',
      width: 216,
      // sorter: true,
      // showSorterTooltip: false,
      // sortIcon: ({ sortOrder }) => <EPSortIcon sortOrder={sortOrder} />,
      // sortOrder: sortedInfo?.columnKey === 'totalCycle' ? sortedInfo.order : null,
      dataIndex: 'totalCycle',
      key: 'totalCycle',
      render: (text) => thousandsNumber(text),
    },
    {
      title: (
        <div className="flex cursor-pointer items-center font-medium">
          <span>Cycle Rate</span>
          <EPTooltip
            title="Cycle Rate = Actual number of cycles participating in block production / Expected number of cycles participating in block production"
            mode="dark">
            <IconFont className="ml-1 text-xs" type="question-circle" />
          </EPTooltip>
        </div>
      ),
      width: 116,
      // sorter: true,
      // showSorterTooltip: false,
      // sortIcon: ({ sortOrder }) => <EPSortIcon sortOrder={sortOrder} />,
      // sortOrder: sortedInfo?.columnKey === 'cycleRate' ? sortedInfo.order : null,
      dataIndex: 'cycleRate',
      key: 'cycleRate',
      render: (text) => text + '%',
    },
    {
      title: 'Blocks',
      width: 216,
      // sorter: true,
      // showSorterTooltip: false,
      // sortIcon: ({ sortOrder }) => <EPSortIcon sortOrder={sortOrder} />,
      // sortOrder: sortedInfo?.columnKey === 'blocks' ? sortedInfo.order : null,
      dataIndex: 'blocks',
      key: 'blocks',
      render: (text) => thousandsNumber(text),
    },
    {
      title: 'Missed Blocks',
      width: 216,
      // sorter: true,
      // showSorterTooltip: false,
      // sortIcon: ({ sortOrder }) => <EPSortIcon sortOrder={sortOrder} />,
      // sortOrder: sortedInfo?.columnKey === 'missedBlocks' ? sortedInfo.order : null,
      dataIndex: 'missedBlocks',
      key: 'missedBlocks',
      render: (text) => thousandsNumber(text),
    },
    {
      title: (
        <div className="flex cursor-pointer items-center font-medium">
          <span>Blocks Rate</span>
          <EPTooltip
            title="Block rate = Actual number of blocks produced / Expected number of blocks produced"
            mode="dark">
            <IconFont className="ml-1 text-xs" type="question-circle" />
          </EPTooltip>
        </div>
      ),
      width: 124,
      // sorter: true,
      // showSorterTooltip: false,
      // sortIcon: ({ sortOrder }) => <EPSortIcon sortOrder={sortOrder} />,
      // sortOrder: sortedInfo?.columnKey === 'blocksRate' ? sortedInfo.order : null,
      dataIndex: 'blocksRate',
      key: 'blocksRate',
      render: (text) => text + '%',
    },
  ];
}
