import { ColumnsType } from 'antd/es/table';
import { addSymbol, formatDate, thousandsNumber } from '@_utils/formatter';
import IconFont from '@_components/IconFont';
import { IContractDataItem } from '@_api/type';
import ContractToken from '@_components/ContractToken';
import { AddressType } from '@_types/common';
import EPTooltip from '@_components/EPToolTip';
import dayjs from 'dayjs';
import ChainTags from '@_components/ChainTags';
import { MULTI_CHAIN } from '@_utils/contant';

const renderContractToken = (text, record, chain) => (
  <div className="flex items-center">
    <ContractToken
      showContractAddress
      address={text}
      type={AddressType.Contract}
      chainId={record.chainIds?.[0] || chain}
    />
  </div>
);

const renderContractName = (text) => (
  <div className="w-full max-w-[208px] truncate break-all">
    <EPTooltip mode="dark" title={text}>
      {text}
    </EPTooltip>
  </div>
);

const renderVersion = (version) => (version ? `V ${version}` : '-');

const renderBalance = (balance) => (typeof balance === 'number' && balance >= 0 ? addSymbol(balance) : '-');

const renderTxns = (txns) => (typeof txns === 'number' && txns >= 0 ? thousandsNumber(txns) : '-');

const renderLastUpdated = (text) => <div>{formatDate(dayjs(text).unix().valueOf(), 'Date Time (UTC)')}</div>;

export default function getColumns(chain): ColumnsType<IContractDataItem> {
  const commonColumns = [
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      render: (text, record) => renderContractToken(text, record, chain),
    },
    {
      title: 'Contract Name',
      dataIndex: 'contractName',
      key: 'contractName',
      render: renderContractName,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Version',
      dataIndex: 'contractVersion',
      key: 'contractVersion',
      render: renderVersion,
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      render: renderBalance,
    },
    {
      title: 'Txns',
      dataIndex: 'txns',
      key: 'txns',
      render: renderTxns,
    },
    {
      title: (
        <div className="time cursor-pointer">
          <IconFont className="mr-1 text-xs" type="Rank" />
          Last Updated At (+UTC)
        </div>
      ),
      dataIndex: 'lastUpdateTime',
      key: 'lastUpdateTime',
      render: renderLastUpdated,
    },
  ];

  const multiChainSpecificColumn = [
    {
      title: 'Chain',
      width: 144,
      dataIndex: 'chainIds',
      key: 'chainIds',
      render: (chainIds) => <ChainTags chainIds={chainIds} />,
    },
  ];

  return chain === MULTI_CHAIN
    ? [
        { ...commonColumns[0], width: 224 },
        multiChainSpecificColumn[0],
        { ...commonColumns[1], width: 208 },
        { ...commonColumns[2], width: 168 },
        { ...commonColumns[3], width: 120 },
        { ...commonColumns[4], width: 224 },
        { ...commonColumns[5], width: 112 },
        { ...commonColumns[6], width: 208 },
      ]
    : [
        { ...commonColumns[0], width: 208 },
        { ...commonColumns[1], width: 208 },
        { ...commonColumns[2], width: 152 },
        { ...commonColumns[3], width: 152 },
        { ...commonColumns[4], width: 208 },
        { ...commonColumns[5], width: 96 },
        { ...commonColumns[6], width: 208 },
      ];
}
