import { ColumnsType } from 'antd/es/table';
import { numberFormatter, thousandsNumber } from '@_utils/formatter';
import IconFont from '@_components/IconFont';
import EPTooltip from '@_components/EPToolTip';
import { IAccountsItem } from '@_api/type';
import ContractToken from '@_components/ContractToken';
import { AddressType } from '@_types/common';
import ChainTags from '@_components/ChainTags';
import { MULTI_CHAIN } from '@_utils/contant';

const renderRank = (currentPage, pageSize) => (text, record, index) => (currentPage - 1) * pageSize + index + 1;

const renderAddress = (text, record, chain) => (
  <div className="address flex items-center">
    <ContractToken
      showContractAddress={record.addressType === AddressType.Contract}
      address={text}
      type={record.addressType}
      chainId={chain}
    />
  </div>
);

const renderBalance = (balance) => numberFormatter(balance);

const renderPercentage = (percentage) => `${percentage}%`;

const renderTransactions = (transactionCount) => thousandsNumber(transactionCount);

const balanceTitle = (
  <div>
    <IconFont className="mr-1 text-xs" type="Rank" />
    Balance
  </div>
);

const percentageTitle = (
  <div>
    <span>Percentage</span>
    <EPTooltip title="The percentage of the circulating ELF supply held by the account" mode="dark">
      <IconFont className="ml-[6px] text-xs" type="question-circle" />
    </EPTooltip>
  </div>
);

const transfersTitle = (
  <div>
    <span>Transfers</span>
    <EPTooltip title="Total transactions related to the account" mode="dark">
      <IconFont className="ml-[6px] text-xs" type="question-circle" />
    </EPTooltip>
  </div>
);

export default function getColumns(currentPage, pageSize, chain): ColumnsType<IAccountsItem> {
  const commonColumns = [
    {
      title: '#',
      dataIndex: 'rank',
      width: '112px',
      render: renderRank(currentPage, pageSize),
    },
    {
      title: 'Address',
      dataIndex: 'address',
      render: (text, record) => renderAddress(text, record, chain),
    },
    {
      title: balanceTitle,
      dataIndex: 'balance',
      render: renderBalance,
    },
    {
      title: percentageTitle,
      dataIndex: 'percentage',
      render: renderPercentage,
    },
    {
      title: transfersTitle,
      dataIndex: 'transactionCount',
      render: renderTransactions,
    },
  ];

  return chain === MULTI_CHAIN
    ? [
        ...commonColumns.slice(0, 2),
        {
          title: 'Chain',
          width: 224,
          dataIndex: 'chainIds',
          key: 'chainIds',
          render: (chainIds) => <ChainTags chainIds={chainIds} />,
        },
        ...commonColumns.slice(2),
      ].map((col, index) => ({
        ...col,
        width: index === 1 ? '336px' : col.width || '208px',
      }))
    : commonColumns.map((col, index) => ({
        ...col,
        width: index === 1 ? '394px' : col.width || '224px',
      }));
}
