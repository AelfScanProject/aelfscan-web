import { ColumnsType } from 'antd/es/table';
import { numberFormatter, thousandsNumber } from '@_utils/formatter';
import IconFont from '@_components/IconFont';
import EPTooltip from '@_components/EPToolTip';
import { IAccountsItem } from '@_api/type';
import ContractToken from '@_components/ContractToken';
import { AddressType } from '@_types/common';

const renderRank = (currentPage, pageSize) => (text, record, index) => (currentPage - 1) * pageSize + index + 1;

const renderAddress = (text, record) => (
  <div className="address flex items-center">
    <ContractToken
      showContractAddress={record.addressType === AddressType.Contract}
      address={text}
      type={record.addressType}
      chainIds={record.chainIds}
    />
  </div>
);

const renderBalance = (balance) => numberFormatter(balance);

const renderPercentage = (percentage) => `${percentage}%`;

const renderTransactions = (transactionCount) => thousandsNumber(transactionCount);

const balanceTitle = (
  <div>
    Balance
    <IconFont className="ml-1 text-base" type="arrow-down-wide-narrow" />
  </div>
);

const percentageTitle = (
  <div>
    <span>Percentage</span>
    <EPTooltip title="The percentage of the circulating ELF supply held by the account" mode="dark">
      <IconFont className="ml-1 text-base" type="circle-help" />
    </EPTooltip>
  </div>
);

const transfersTitle = (
  <div>
    <span>Transfers</span>
    <EPTooltip title="Total transactions related to the account" mode="dark">
      <IconFont className="ml-1 text-base" type="circle-help" />
    </EPTooltip>
  </div>
);

export default function getColumns(currentPage, pageSize): ColumnsType<IAccountsItem> {
  const commonColumns = [
    {
      title: '#',
      dataIndex: 'rank',
      width: '100px',
      render: renderRank(currentPage, pageSize),
    },
    {
      title: 'Address',
      width: 325,
      dataIndex: 'address',
      render: (text, record) => renderAddress(text, record),
    },
    {
      title: balanceTitle,
      dataIndex: 'balance',
      width: 325,
      render: renderBalance,
    },
    {
      title: percentageTitle,
      dataIndex: 'percentage',
      width: 325,
      render: renderPercentage,
    },
    {
      title: transfersTitle,
      dataIndex: 'transactionCount',
      render: renderTransactions,
      width: 325,
    },
  ];

  return commonColumns;
}
