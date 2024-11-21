import IconFont from '@_components/IconFont';
import Method from '@_components/Method';
import { formatDate } from '@_utils/formatter';
import Link from 'next/link';
import { IEvents } from './type';
import { ColumnsType } from 'antd/es/table';
import LogItems from '@_components/LogsContainer/logItems';
import EPTooltip from '@_components/EPToolTip';
import Copy from '@_components/Copy';

export default function getColumns({ timeFormat, handleTimeChange }): ColumnsType<IEvents> {
  return [
    {
      dataIndex: 'transactionId',
      width: 177,
      key: 'transactionId',
      title: (
        <div className="flex items-center font-medium">
          <span>Txn Hash</span>
        </div>
      ),
      render: (text, records) => {
        return (
          <div className="flex items-center">
            <EPTooltip title={text} mode="dark">
              <Link className="block w-[120px] truncate text-primary" href={`/${records.chainId}/tx/${text}`}>
                {text}
              </Link>
            </EPTooltip>
            <Copy value={text}></Copy>
          </div>
        );
      },
    },
    {
      title: 'Block',
      width: 140,
      dataIndex: 'blockHeight',
      key: 'blockHeight',
      render: (text, records) => (
        <Link className="block  text-primary" href={`/${records.chainId}/block/${text}`}>
          {text}
        </Link>
      ),
    },
    {
      title: (
        <div
          className="time flex cursor-pointer items-center font-medium text-primary"
          onClick={handleTimeChange}
          onKeyDown={handleTimeChange}>
          {timeFormat}
        </div>
      ),
      width: 168,
      dataIndex: 'timeStamp',
      key: 'timeStamp',
      render: (text) => {
        return <div className="">{formatDate(Math.floor(text / 1000), timeFormat)}</div>;
      },
    },
    {
      title: 'Method',
      width: 200,
      dataIndex: 'methodName',
      key: 'methodName',
      render: (text) => <Method text={text} tip={text} />,
    },
    {
      title: 'Logs',
      width: 672,
      dataIndex: 'logs',
      key: 'logs',
      render: (text, record) => (
        <LogItems
          data={{
            address: record.contractAddress,
            eventName: record.eventName,
            contractInfo: {
              name: record.eventName,
              address: record.contractAddress,
              addressType: 1,
              isManager: true,
              isProducer: true,
            },
            indexed: record.indexed,
            nonIndexed: record.nonIndexed,
          }}
        />
      ),
    },
  ];
}
