import IconFont from '@_components/IconFont';
import Method from '@_components/Method';
import { formatDate } from '@_utils/formatter';
import Link from 'next/link';
import { IEvents } from './type';
import { ColumnsType } from 'antd/es/table';
import LogItems from '@_components/LogsContainer/logItems';

export default function getColumns({ timeFormat, handleTimeChange }): ColumnsType<IEvents> {
  return [
    {
      dataIndex: 'txnHash',
      width: 208,
      key: 'txnHash',
      title: (
        <div className="flex items-center font-medium">
          <span>Txn Hash</span>
          <IconFont className="ml-1 text-xs" type="question-circle" />
        </div>
      ),
      render: (text) => {
        return (
          <div className="flex items-center">
            <Link className="block w-[120px] truncate text-xs leading-5 text-link" href={`tx/${text}`}>
              {text}
            </Link>
          </div>
        );
      },
    },
    {
      title: 'Block',
      width: 128,
      dataIndex: 'blockHeight',
      key: 'blockHeight',
      render: (text) => (
        <Link className="block text-xs leading-5 text-link" href={`block/${text}`}>
          {text}
        </Link>
      ),
    },
    {
      title: (
        <div
          className="time flex cursor-pointer items-center font-medium text-link"
          onClick={handleTimeChange}
          onKeyDown={handleTimeChange}>
          <IconFont className="mr-1 text-xs" type="Rank" />
          {timeFormat}
        </div>
      ),
      width: 208,
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text) => {
        return <div className="text-xs leading-5">{formatDate(text, timeFormat)}</div>;
      },
    },
    {
      title: 'Method',
      width: 128,
      dataIndex: 'method',
      key: 'method',
      render: (text) => <Method text={text} tip={text} />,
    },
    {
      title: (
        <div>
          <IconFont className="mr-1 text-xs leading-5" type="log" />
          <span>Logs</span>
        </div>
      ),
      width: 672,
      dataIndex: 'logs',
      key: 'logs',
      // render: (text) => <LogItems data={text} />,
      render: (text) => <div>code</div>,
    },
  ];
}
