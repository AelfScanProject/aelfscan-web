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
import { MULTI_CHAIN } from '@_utils/contant';
import TokenTableCell from '@_components/TokenTableCell';
import TokenImage from '@app/[chain]/tokens/_components/TokenImage';

const renderTransactionsView = (record) => (
  <TransactionsView record={record} custom={true} jumpChain={record.chainIds[0]} />
);

const renderTransactionId = (text, record) => (
  <div className="flex items-center">
    {record.status === TTransactionStatus.fail && <IconFont className="ml-1" type="question-circle-error" />}
    <EPTooltip title={text} mode="dark">
      <Link
        className="block w-[120px] truncate text-primary"
        href={`/${record.chainIds && record.chainIds[0]}/tx/${text}`}>
        {text}
      </Link>
    </EPTooltip>
    <Copy value={text} />
  </div>
);

const renderContractToken = (data, record) => (
  <ContractToken
    address={data.address || ''}
    type={data.addressType}
    name={data.name}
    chainIds={record.chainIds}
    showChainId={false}
    className="max-w-[148px]"
  />
);

export default function getColumns({ timeFormat, handleTimeChange, token }): ColumnsType<ITransferItem> {
  const commonColumns = [
    {
      title: (
        <EPTooltip mode="dark" title="See preview of the transaction details.">
          <IconFont className="ml-[6px] text-base" type="circle-help" />
        </EPTooltip>
      ),
      width: 60,
      dataIndex: '',
      key: 'view',
      render: renderTransactionsView,
    },
    {
      title: 'Chain',
      width: 140,
      dataIndex: 'chainIds',
      key: 'chainIds',
      render: (chainIds) => <ChainTags chainIds={chainIds || []} />,
    },
    {
      title: 'Txn Hash',
      dataIndex: 'transactionId',
      key: 'transactionId',
      width: 177,
      render: (text, record) => renderTransactionId(text, record),
    },
    {
      title: (
        <div className="cursor-pointer">
          <span>Method</span>
          <EPTooltip mode="dark" title="Function executed based on input data.">
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
        <div className="time cursor-pointer text-primary" onClick={handleTimeChange} onKeyDown={handleTimeChange}>
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
      width: 200,
      key: 'from',
      render: (data, record) => renderContractToken(data, record),
    },
    {
      title: '',
      key: 'from_to',
      width: 24,
      className: 'from_to-col',
      render: () => <IconFont className="text-[24px]" type="From-To" />,
    },
    {
      title: 'To',
      dataIndex: 'to',
      width: 200,
      key: 'to',
      render: (data, record) => renderContractToken(data, record),
    },
    {
      title: 'Amount',
      key: 'quantity',
      width: 177,
      dataIndex: 'quantity',
      render: (text) => thousandsNumber(text) + ' ' + token.symbol,
    },
    {
      title: 'Token',
      width: 175,
      key: 'token',
      dataIndex: 'token',
      render: () => {
        const { imageUrl, name, symbol } = token;
        return (
          <div className="flex items-center">
            <Link href={`/${MULTI_CHAIN}/token/${symbol}`}>
              <TokenTableCell
                token={{
                  name: name,
                  symbol,
                }}>
                <div className="flex shrink-0 items-center">
                  <TokenImage
                    token={{
                      name: name,
                      imageUrl: imageUrl,
                      symbol,
                    }}
                  />
                </div>
              </TokenTableCell>
            </Link>
          </div>
        );
      },
    },
  ];

  return commonColumns;
}
