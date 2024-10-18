import { addSymbol, divDecimals, formatDate } from '@_utils/formatter';
import Link from 'next/link';
import IconFont from '@_components/IconFont';
import Method from '@_components/Method';
import ContractToken from '@_components/ContractToken';
import TransactionsView from '@_components/TransactionsView';
import { TransactionStatus } from '@_api/type';
import EPTooltip from '@_components/EPToolTip';
import Copy from '@_components/Copy';
import ChainTags from '@_components/ChainTags';
import { MULTI_CHAIN } from '@_utils/contant';

const renderTransactionId = (text, records, chainId) => (
  <div className="flex items-center">
    {records.status === TransactionStatus.Failed && <IconFont className="mr-1" type="question-circle-error" />}
    <EPTooltip title={text} mode="dark">
      <Link
        className="block w-[120px] truncate text-link"
        href={`/${(records?.chainIds && records?.chainIds[0]) || chainId}/tx/${text}`}>
        {text}
      </Link>
    </EPTooltip>
    <Copy value={text} />
  </div>
);

const renderContractToken = (data, records, chainId) => (
  <ContractToken
    address={data.address}
    name={data.name}
    chainId={(records?.chainIds && records?.chainIds[0]) || chainId}
    type={data.addressType}
  />
);

const getColumnsConfig = (timeFormat, handleTimeChange, chainId, type, isMultiChain) =>
  [
    {
      title: (
        <EPTooltip title="See preview of the transaction details." mode="dark">
          <IconFont className="ml-[6px] cursor-pointer text-xs" type="question-circle" />
        </EPTooltip>
      ),
      width: 72,
      dataIndex: '',
      key: 'view',
      render: (record) => <TransactionsView record={record} />,
    },
    isMultiChain && {
      title: 'Chain',
      width: 100,
      dataIndex: 'chainIds',
      key: 'chainIds',
      render: (chainIds) => <ChainTags chainIds={chainIds} />,
    },
    {
      dataIndex: 'transactionId',
      width: 168,
      key: 'transactionId',
      title: 'Txn Hash',
      render: (text, records) => renderTransactionId(text, records, chainId),
    },
    {
      title: (
        <div className="cursor-pointer font-medium">
          <span>Method</span>
          <EPTooltip title="Function executed based on input data." mode="dark">
            <IconFont className="ml-1 text-xs" type="question-circle" />
          </EPTooltip>
        </div>
      ),
      width: 128,
      dataIndex: 'method',
      key: 'method',
      render: (text) => <Method text={text} tip={text} />,
    },
    {
      title: 'Block',
      width: 112,
      dataIndex: 'blockHeight',
      hidden: type === 'block',
      key: 'blockHeight',
      render: (text, records) => (
        <Link
          className="block text-link"
          href={`/${(records?.chainIds && records?.chainIds[0]) || chainId}/block/${text}`}>
          {text}
        </Link>
      ),
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
      width: 144,
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text) => <div>{formatDate(text, timeFormat)}</div>,
    },
    {
      dataIndex: 'from',
      title: 'From',
      width: 196,
      render: (fromData, records) => renderContractToken(fromData, records, chainId),
    },
    {
      title: '',
      width: 40,
      dataIndex: '',
      key: 'from_to',
      render: () => <IconFont className="text-[24px]" type="fromto" />,
    },
    {
      dataIndex: 'to',
      title: 'To',
      render: (toData, records) => renderContractToken(toData, records, chainId),
    },
    {
      title: 'Value',
      width: isMultiChain ? 128 : 148,
      key: 'transactionValue',
      dataIndex: 'transactionValue',
      render: (text) => (
        <span className="break-all text-base-100">{text || text === 0 ? addSymbol(divDecimals(text)) : '-'}</span>
      ),
    },
    {
      title: 'Txn Fee',
      width: isMultiChain ? 108 : 158,
      key: 'transactionFee',
      dataIndex: 'transactionFee',
      render: (text) => <span className="break-all text-base-200">{addSymbol(divDecimals(text))}</span>,
    },
  ].filter(Boolean);

export default function getColumns({ timeFormat, handleTimeChange, chainId = 'AELF', type }) {
  const isMultiChain = chainId === MULTI_CHAIN;
  return getColumnsConfig(timeFormat, handleTimeChange, chainId, type, isMultiChain);
}
