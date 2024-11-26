import { ColumnsType } from 'antd/es/table';
import { addSymbol, formatDate, thousandsNumber } from '@_utils/formatter';
import IconFont from '@_components/IconFont';
import { IContractDataItem } from '@_api/type';
import ContractToken from '@_components/ContractToken';
import { AddressType } from '@_types/common';
import EPTooltip from '@_components/EPToolTip';
import dayjs from 'dayjs';
import ChainTags from '@_components/ChainTags';

const renderContractToken = (text, record) => (
  <div className="flex items-center">
    <ContractToken
      showContractAddress
      address={text}
      showChainId={false}
      type={AddressType.Contract}
      chainIds={record.chainIds}
    />
  </div>
);

const renderContractName = (text) => (
  <div className="w-full max-w-[140px] truncate break-all">
    <EPTooltip mode="dark" title={text}>
      {text}
    </EPTooltip>
  </div>
);

const renderVersion = (version) => (version ? `V ${version}` : '-');

const renderBalance = (balance) => (typeof balance === 'number' && balance >= 0 ? addSymbol(balance) : '-');

const renderTxns = (txns) => (typeof txns === 'number' && txns >= 0 ? thousandsNumber(txns) : '-');

const renderLastUpdated = (text) => <div>{formatDate(dayjs(text).unix().valueOf(), 'Date Time (UTC)')}</div>;

export default function getColumns(): ColumnsType<IContractDataItem> {
  const commonColumns = [
    {
      title: 'Address',
      dataIndex: 'address',
      width: 210,
      key: 'address',
      render: (text, record) => renderContractToken(text, record),
    },
    {
      title: 'Contract Name',
      dataIndex: 'contractName',
      key: 'contractName',
      width: 173,
      render: renderContractName,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      width: 173,
      key: 'type',
    },
    {
      title: 'Version',
      dataIndex: 'contractVersion',
      key: 'contractVersion',
      width: 173,
      render: renderVersion,
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      width: 173,
      render: renderBalance,
    },
    {
      title: 'Txns',
      width: 138,
      dataIndex: 'txns',
      key: 'txns',
      render: renderTxns,
    },
    {
      title: (
        <div className="time flex cursor-pointer items-center">
          Last Updated (+UTC)
          <IconFont className="ml-1 text-base" type="arrow-down-wide-narrow" />
        </div>
      ),
      dataIndex: 'lastUpdateTime',
      key: 'lastUpdateTime',
      width: 196,
      render: renderLastUpdated,
    },
  ];

  const multiChainSpecificColumn = [
    {
      title: 'Chain',
      width: 140,
      dataIndex: 'chainIds',
      key: 'chainIds',
      render: (chainIds) => <ChainTags chainIds={chainIds} />,
    },
  ];

  return [
    { ...commonColumns[0] },
    multiChainSpecificColumn[0],
    { ...commonColumns[1] },
    { ...commonColumns[2] },
    { ...commonColumns[3] },
    { ...commonColumns[4] },
    { ...commonColumns[5] },
    { ...commonColumns[6] },
  ];
}
