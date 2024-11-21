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
import { MULTI_CHAIN } from '@_utils/contant';

const renderTransactionId = (text, records) => {
  const { chainId } = records;
  return (
    <div className="flex items-center">
      {records.status === TransactionStatus.Failed && <IconFont className="mr-1" type="circle-help" />}
      <EPTooltip title={text} mode="dark">
        <Link className="block w-[120px] truncate text-primary" href={`/${chainId}/tx/${text}`}>
          {text}
        </Link>
      </EPTooltip>
      <Copy value={text}></Copy>
    </div>
  );
};

const renderTokenOrItem = (text, record, columnType) => {
  const { symbol, symbolImageUrl, symbolName } = record;
  return columnType === 'Token' ? (
    <div className="flex items-center">
      <Link href={`/${MULTI_CHAIN}/token/${symbol}`}>
        <TokenTableCell
          token={{
            name: symbolName,
            symbol,
          }}>
          <div className="flex shrink-0 items-center">
            <TokenImage
              token={{
                name: symbolName,
                imageUrl: symbolImageUrl,
                symbol,
              }}
            />
          </div>
        </TokenTableCell>
      </Link>
    </div>
  ) : (
    <div className="item-container flex items-center">
      <TokenImage width="40px" height="40px" token={{ name: symbolName, imageUrl: symbolImageUrl, symbol }} />
      <div className="info ml-1">
        <div className="name max-w-[139px] truncate text-sm">{symbolName}</div>
        <div className="message flex items-center leading-[18px]">
          <span className="inline-block max-w-[149.39759px] truncate text-sm  text-muted-foreground">{symbol}</span>
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
          <IconFont className="ml-[6px] cursor-pointer text-base" type="circle-help" />
        </EPTooltip>
      ),
      width: 60,
      dataIndex: '',
      key: 'view',
      render: (record) => <TransactionsView record={record} custom />,
    },
    multi && {
      title: 'Chain',
      width: 140,
      dataIndex: 'chainIds',
      key: 'chainIds',
      render: (chainIds) => <ChainTags chainIds={chainIds || []} />,
    },
    {
      dataIndex: 'transactionId',
      width: 177,
      key: 'transactionId',
      title: 'Txn Hash',
      render: renderTransactionId,
    },
    {
      title: (
        <div className="cursor-pointer font-medium">
          <span>Method</span>
          <EPTooltip title="Function executed based on input data. " mode="dark">
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
      title: (
        <div
          className="time cursor-pointer font-medium text-primary"
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
      dataIndex: 'from',
      title: 'From',
      width: 200,
      render: (fromData, record) => {
        if (!fromData) return null;
        const { address } = fromData;
        return (
          <ContractToken
            address={address}
            name={fromData.name}
            chainIds={record.chainIds}
            showChainId={false}
            type={fromData.addressType}
          />
        );
      },
    },
    {
      title: '',
      width: 50,
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
      width: 200,
      render: (toData, record) => {
        if (!toData) return null;
        const { address } = toData;
        return (
          <ContractToken
            address={address}
            showChainId={false}
            name={toData.name}
            chainIds={record.chainIds}
            type={toData.addressType}
          />
        );
      },
    },
    {
      title: 'Amount',
      width: 164,
      key: 'quantity',
      dataIndex: 'quantity',
      render: (text) => <span>{numberFormatter(text, '')}</span>,
    },
    {
      title: columnType === 'Token' ? 'Token' : 'Item',
      width: 164,
      key: columnType === 'Token' ? 'token' : 'item',
      dataIndex: columnType === 'Token' ? 'token' : 'item',
      render: (text, record) => renderTokenOrItem(text, record, columnType),
    },
  ].filter(Boolean);

  return columns;
}
