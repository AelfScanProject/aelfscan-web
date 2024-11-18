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
    chainIds={records?.chainIds && records?.chainIds.length > 0 ? records?.chainIds : [chainId]}
    type={data.addressType}
    showChainId={false}
  />
);

const getColumnsConfig = (timeFormat, handleTimeChange, type, chainId) =>
  [
    {
      title: (
        <EPTooltip title="See preview of the transaction details." mode="dark">
          <IconFont className="ml-[6px] cursor-pointer text-base" type="circle-help" />
        </EPTooltip>
      ),
      width: 60,
      dataIndex: '',
      key: 'view',
      render: (record) => <TransactionsView record={record} />,
    },
    {
      title: 'Chain',
      width: 140,
      dataIndex: 'chainIds',
      key: 'chainIds',
      render: (chainIds) => <ChainTags chainIds={chainIds} />,
    },
    {
      dataIndex: 'transactionId',
      width: 177,
      key: 'transactionId',
      title: 'Txn Hash',
      render: (text, records) => renderTransactionId(text, records, chainId),
    },
    {
      title: (
        <div className="cursor-pointer">
          <span>Method</span>
          <EPTooltip title="Function executed based on input data." mode="dark">
            <IconFont className="ml-1 text-base" type="circle-help" />
          </EPTooltip>
        </div>
      ),
      width: 130,
      dataIndex: 'method',
      key: 'method',
      render: (text) => <Method text={text} tip={text} />,
    },
    {
      title: 'Block',
      width: 140,
      dataIndex: 'blockHeight',
      hidden: type === 'block',
      key: 'blockHeight',
      render: (text, records) => (
        <Link
          className="block text-link"
          href={`/${(records?.chainIds && records?.chainIds[0]) || records.chainId}/block/${text}`}>
          {text}
        </Link>
      ),
    },
    {
      title: (
        <div className="time cursor-pointer text-primary" onClick={handleTimeChange} onKeyDown={handleTimeChange}>
          {timeFormat}
        </div>
      ),
      width: 116,
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text) => <div>{formatDate(text, timeFormat)}</div>,
    },
    {
      dataIndex: 'from',
      title: 'From',
      width: type === 'block' ? 200 : 220,
      render: (fromData, records) => renderContractToken(fromData, records, chainId),
    },
    {
      title: '',
      width: '24px',
      dataIndex: '',
      key: 'from_to',
      className: 'from_to-col',
      render: () => <IconFont className="text-[24px]" type="From-To" />,
    },
    {
      dataIndex: 'to',
      title: 'To',
      width: type === 'block' ? 200 : 293,
      render: (toData, records) => renderContractToken(toData, records, chainId),
    },
    {
      title: type === 'block' ? 'Amount' : 'Value',
      width: type === 'block' ? 177 : 100,
      key: 'transactionValue',
      dataIndex: 'transactionValue',
      render: (text) => (
        <span className="break-all text-base-100">{text || text === 0 ? addSymbol(divDecimals(text)) : '-'}</span>
      ),
    },
    {
      title: 'Txn Fee',
      width: type === 'block' ? 177 : 108,
      key: 'transactionFee',
      hidden: type !== 'block',
      dataIndex: 'transactionFee',
      render: (text) => <span className="break-all">{addSymbol(divDecimals(text))}</span>,
    },
  ].filter(Boolean);

export default function getColumns({ timeFormat, handleTimeChange, type, chainId = 'AELF' }) {
  return getColumnsConfig(timeFormat, handleTimeChange, type, chainId);
}
