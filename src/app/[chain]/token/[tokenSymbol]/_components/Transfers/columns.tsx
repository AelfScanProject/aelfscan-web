import ContractToken from '@_components/ContractToken';
import Copy from '@_components/Copy';
import EPTooltip from '@_components/EPToolTip';
import IconFont from '@_components/IconFont';
import Method from '@_components/Method';
import TransactionsView from '@_components/TransactionsView';
import { TTransactionStatus } from '@_types/common';
import { formatDate, thousandsNumber } from '@_utils/formatter';
import { ColumnsType } from 'antd/es/table';
import Link from 'next/link';
import { ITransferItem } from '../../type';
import ChainTags from '@_components/ChainTags';

const renderTransactionsView = (record) => <TransactionsView record={record} custom={true} />;

const renderTransactionId = (text, record, chain) => (
  <div className="flex items-center">
    {record.status === TTransactionStatus.fail && <IconFont className="ml-1" type="question-circle-error" />}
    <EPTooltip title={text} mode="dark">
      <Link
        className="block w-[120px] truncate text-link"
        href={`/${(record.chainIds && record.chainIds[0]) || chain}/tx/${text}`}>
        {text}
      </Link>
    </EPTooltip>
    <Copy value={text} />
  </div>
);

const renderContractToken = (data, record, chain) => (
  <ContractToken
    address={data.address || ''}
    type={data.addressType}
    name={data.name}
    chainId={(record.chainIds && record.chainIds[0]) || chain}
    chainIds={record.chainIds}
  />
);

const renderQuantity = (text) => thousandsNumber(text);

export default function getColumns({ timeFormat, handleTimeChange, chain, multi }): ColumnsType<ITransferItem> {
  const commonColumns = [
    {
      title: 'Txn Hash',
      dataIndex: 'transactionId',
      key: 'transactionId',
      render: (text, record) => renderTransactionId(text, record, chain),
    },
    {
      title: (
        <div className="cursor-pointer font-medium">
          <span>Method</span>
          <EPTooltip mode="dark" title="Function executed based on input data.">
            <IconFont className="ml-1" type="question-circle" />
          </EPTooltip>
        </div>
      ),
      dataIndex: 'method',
      key: 'method',
      render: (text) => <Method text={text} tip={text} />,
    },
    {
      title: (
        <div
          className="time cursor-pointer font-medium text-link"
          onClick={handleTimeChange}
          onKeyDown={handleTimeChange}>
          {timeFormat}
        </div>
      ),
      dataIndex: 'blockTime',
      key: 'blockTime',
      render: (text) => <div>{formatDate(text, timeFormat)}</div>,
    },
    {
      title: 'From',
      dataIndex: 'from',
      key: 'from',
      render: (data, record) => renderContractToken(data, record, chain),
    },
    {
      title: '',
      key: 'from_to',
      render: () => <IconFont className="text-[24px]" type="fromto" />,
    },
    {
      title: 'To',
      dataIndex: 'to',
      key: 'to',
      render: (data, record) => renderContractToken(data, record, chain),
    },
    {
      title: 'Quantity',
      key: 'quantity',
      dataIndex: 'quantity',
      render: renderQuantity,
    },
  ];

  return multi
    ? [
        {
          title: (
            <EPTooltip mode="dark" title="See preview of the transaction details.">
              <IconFont className="ml-[6px] text-xs" type="question-circle" />
            </EPTooltip>
          ),
          width: 40,
          dataIndex: '',
          key: 'view',
          render: renderTransactionsView,
        },
        {
          title: 'Chain',
          width: 144,
          dataIndex: 'chainIds',
          key: 'chainIds',
          render: (chainIds) => <ChainTags chainIds={chainIds || []} />,
        },
        { ...commonColumns[0], width: 224 },
        { ...commonColumns[1], width: 176 },
        { ...commonColumns[2], width: 176 },
        { ...commonColumns[3], width: 196 },
        { ...commonColumns[4], width: 40 },
        { ...commonColumns[5], width: 196 },
        { ...commonColumns[6], width: 152 },
      ]
    : [
        {
          title: (
            <EPTooltip mode="dark" title="See preview of the transaction details.">
              <IconFont className="ml-[6px] text-xs" type="question-circle" />
            </EPTooltip>
          ),
          width: 72,
          dataIndex: '',
          key: 'view',
          render: renderTransactionsView,
        },
        { ...commonColumns[0], width: 208 },
        { ...commonColumns[1], width: 168 },
        { ...commonColumns[2], width: 208 },
        { ...commonColumns[3], width: 180 },
        { ...commonColumns[4], width: 40 },
        { ...commonColumns[5], width: 180 },
        { ...commonColumns[6], width: 224 },
      ];
}
