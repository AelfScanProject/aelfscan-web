import { ColumnsType } from 'antd/es/table';
import { TokenTransfersItemType } from '@_types/commonDetail';
import { formatDate, numberFormatter } from '@_utils/formatter';
import Copy from '@_components/Copy';
import Link from 'next/link';
import IconFont from '@_components/IconFont';
import Method from '@_components/Method';
import ContractToken from '@_components/ContractToken';
import EPTooltip from '@_components/EPToolTip';
import { TransactionStatus } from '@_api/type';
import TransactionsView from '@_components/TransactionsView';
import TokenTableCell from '@_components/TokenTableCell';
import TokenImage from '@app/[chain]/tokens/_components/TokenImage';
import ChainTags from '@_components/ChainTags';
import './index.css';

const renderTransactionId = (text, records) => {
  const { chainId } = records;
  return (
    <div className="flex items-center">
      {records.status === TransactionStatus.Failed && <IconFont className="mr-1" type="question-circle-error" />}
      <EPTooltip title={text} mode="dark">
        <Link className="block w-[120px] truncate text-link" href={`/${chainId}/tx/${text}`}>
          {text}
        </Link>
      </EPTooltip>
      <Copy value={text}></Copy>
    </div>
  );
};

const renderTokenOrItem = (text, record, columnType) => {
  const { chainId, symbol, symbolImageUrl, symbolName } = record;
  return columnType === 'Token' ? (
    <div className="flex items-center">
      <Link href={`/${chainId}/token/${symbol}`}>
        <TokenTableCell
          token={{
            name: symbolName,
            symbol,
          }}
          length={7}>
          <TokenImage
            token={{
              name: symbolName,
              imageUrl: symbolImageUrl,
              symbol,
            }}
          />
        </TokenTableCell>
      </Link>
    </div>
  ) : (
    <div className="item-container flex items-center">
      <TokenImage token={{ name: symbolName, imageUrl: symbolImageUrl, symbol }} />
      <div className="info ml-1">
        <div className="name max-w-[139px] truncate text-xs leading-5 text-black">{symbolName}</div>
        <div className="message flex items-center leading-[18px]">
          <span className="font10px inline-block max-w-[149.39759px] truncate leading-[18px] text-base-200">
            {symbol}
          </span>
        </div>
      </div>
    </div>
  );
};

export default function getColumns({
  timeFormat,
  columnType,
  handleTimeChange,
  address,
  multi,
}): ColumnsType<TokenTransfersItemType> {
  const columns = [
    {
      title: (
        <EPTooltip title="See preview of the transaction details." mode="dark">
          <IconFont className="ml-[6px] cursor-pointer text-xs" type="question-circle" />
        </EPTooltip>
      ),
      width: 72,
      dataIndex: '',
      key: 'view',
      render: (record) => <TransactionsView record={record} custom />,
    },
    multi && {
      title: 'Chain',
      width: 144,
      dataIndex: 'chainIds',
      key: 'chainIds',
      render: (chainIds) => <ChainTags chainIds={chainIds || []} />,
    },
    {
      dataIndex: 'transactionId',
      width: 168,
      key: 'transactionId',
      title: 'Txn Hash',
      render: renderTransactionId,
    },
    {
      title: (
        <div className="cursor-pointer font-medium">
          <span>Method</span>
          <EPTooltip title="Function executed based on input data. " mode="dark">
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
      title: (
        <div
          className="time cursor-pointer font-medium text-link"
          onClick={handleTimeChange}
          onKeyDown={handleTimeChange}>
          {timeFormat}
        </div>
      ),
      width: 164,
      dataIndex: 'blockTime',
      key: 'blockTime',
      render: (text) => <div>{formatDate(text, timeFormat)}</div>,
    },
    {
      dataIndex: 'from',
      title: 'From',
      width: 196,
      render: (fromData, record) => {
        if (!fromData) return null;
        const { address } = fromData;
        return (
          <ContractToken address={address} name={fromData.name} chainId={record.chainId} type={fromData.addressType} />
        );
      },
    },
    {
      title: '',
      width: 52,
      dataIndex: 'transferStatus',
      key: 'transferStatus',
      render: (text, record) => (
        <div className="in-out-container">
          {address === record.from?.address ? (
            <div className="out-container">Out</div>
          ) : (
            <div className="in-container">In</div>
          )}
        </div>
      ),
    },
    {
      dataIndex: 'to',
      title: 'To',
      width: 196,
      render: (toData, record) => {
        if (!toData) return null;
        const { address } = toData;
        return (
          <ContractToken address={address} name={toData.name} chainId={record.chainId} type={toData.addressType} />
        );
      },
    },
    {
      title: 'Amount',
      width: 172,
      key: 'quantity',
      dataIndex: 'quantity',
      render: (text) => <span className="text-base-100">{numberFormatter(text, '')}</span>,
    },
    {
      title: columnType === 'Token' ? 'Token' : 'Item',
      width: 204,
      key: columnType === 'Token' ? 'token' : 'item',
      dataIndex: columnType === 'Token' ? 'token' : 'item',
      render: (text, record) => renderTokenOrItem(text, record, columnType),
    },
  ].filter(Boolean);

  return columns;
}
