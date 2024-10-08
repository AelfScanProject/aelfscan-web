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

export default function getColumns({ timeFormat, handleTimeChange, chain, multi }): ColumnsType<ITransferItem> {
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
          render: (record) => <TransactionsView record={record} custom={true} />,
        },
        {
          title: 'Chain',
          width: 144,
          dataIndex: 'chainIds',
          key: 'chainIds',
          render: (chainIds) => <ChainTags chainIds={chainIds || []} />,
        },
        {
          title: (
            <div className="cursor-pointer font-medium">
              <span>Txn Hash</span>
              <EPTooltip
                mode="dark"
                title="A TxHash or transaction hash is a unique 64 character identifier that is generated whenever a transaction is executed.">
                <IconFont className="ml-1" type="question-circle" />
              </EPTooltip>
            </div>
          ),
          width: 224,
          dataIndex: 'transactionId',
          key: 'transactionId',
          render: (text, record) => (
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
          ),
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
          width: 176,
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
          width: 176,
          dataIndex: 'blockTime',
          key: 'blockTime',
          render: (text) => {
            return <div>{formatDate(text, timeFormat)}</div>;
          },
        },
        {
          title: 'From',
          width: 196,
          dataIndex: 'from',
          key: 'from',
          render: (data, record) => {
            const { address, addressType } = data;
            return (
              <ContractToken
                address={address}
                type={addressType}
                chainId={(record.chainIds && record.chainIds[0]) || chain}
                chainIds={record.chainIds}
              />
            );
          },
        },
        {
          title: '',
          width: 40,
          dataIndex: '',
          key: 'from_to',
          render: () => <IconFont className="text-[24px]" type="fromto" />,
        },
        {
          title: 'To',
          dataIndex: 'to',
          key: 'to',
          width: 196,
          render: (data, record) => {
            const { address, addressType } = data;
            return (
              <ContractToken
                address={address || ''}
                type={addressType}
                chainId={(record.chainIds && record.chainIds[0]) || chain}
                chainIds={record.chainIds}
              />
            );
          },
        },
        {
          title: 'Quantity',
          key: 'quantity',
          dataIndex: 'quantity',
          width: 152,
          render: (text) => thousandsNumber(text),
        },
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
          render: (record) => <TransactionsView record={record} custom={true} />,
        },
        {
          title: (
            <div className="cursor-pointer font-medium">
              <span>Txn Hash</span>
              <EPTooltip
                mode="dark"
                title="A TxHash or transaction hash is a unique 64 character identifier that is generated whenever a transaction is executed.">
                <IconFont className="ml-1" type="question-circle" />
              </EPTooltip>
            </div>
          ),
          width: 208,
          dataIndex: 'transactionId',
          key: 'transactionId',
          render: (text, record) => (
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
          ),
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
          width: 168,
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
          width: 208,
          dataIndex: 'blockTime',
          key: 'blockTime',
          render: (text) => {
            return <div>{formatDate(text, timeFormat)}</div>;
          },
        },
        {
          title: 'From',
          width: 180,
          dataIndex: 'from',
          key: 'from',
          render: (data, record) => {
            const { address, addressType } = data;
            return <ContractToken address={address} type={addressType} chainId={chain} chainIds={record.chainIds} />;
          },
        },
        {
          title: '',
          width: 40,
          dataIndex: '',
          key: 'from_to',
          render: () => <IconFont className="text-[24px]" type="fromto" />,
        },
        {
          title: 'To',
          dataIndex: 'to',
          key: 'to',
          width: 180,
          render: (data, record) => {
            const { address, addressType } = data;
            return (
              <ContractToken address={address || ''} type={addressType} chainId={chain} chainIds={record.chainIds} />
            );
          },
        },
        {
          title: 'Quantity',
          key: 'quantity',
          dataIndex: 'quantity',
          width: 224,
          render: (text) => thousandsNumber(text),
        },
      ];
}
