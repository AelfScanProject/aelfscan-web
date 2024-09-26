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
export default function getColumns(chain): ColumnsType<IContractDataItem> {
  return chain === MULTI_CHAIN
    ? [
        {
          title: 'Address',
          width: 224,
          dataIndex: 'address',
          key: 'address',
          render: (text, record) => (
            <div className="flex items-center">
              <ContractToken
                showContractAddress
                address={text}
                type={AddressType.Contract}
                chainId={record.chainIds[0] || chain}
              />
            </div>
          ),
        },
        {
          title: 'Chain',
          width: 144,
          dataIndex: 'chainIds',
          key: 'chainIds',
          render: (chainIds) => <ChainTags chainIds={chainIds} />,
        },
        {
          title: 'Contract Name',
          width: '208px',
          dataIndex: 'contractName',
          key: 'contractName',
          render: (text) => (
            <div className="w-full max-w-[208px] truncate break-all">
              {' '}
              <EPTooltip mode="dark" title={text}>
                {text}
              </EPTooltip>
            </div>
          ),
        },
        {
          title: 'Type',
          width: 168,
          dataIndex: 'type',
          key: 'type',
        },
        {
          title: 'Version',
          dataIndex: 'contractVersion',
          key: 'contractVersion',
          width: 120,
          render(version) {
            return version ? `V ${version}` : '-';
          },
        },
        {
          title: 'Balance',
          dataIndex: 'balance',
          width: 224,
          key: 'balance',
          render(balance) {
            return typeof balance === 'number' && balance >= 0 ? addSymbol(balance) : '-';
          },
        },
        {
          title: 'Txns',
          width: 112,
          key: 'txns',
          dataIndex: 'txns',
          render(txns) {
            return typeof txns === 'number' && txns >= 0 ? thousandsNumber(txns) : '-';
          },
        },
        {
          title: (
            <div className="time cursor-pointer">
              <IconFont className="mr-1 text-xs " type="Rank" />
              Last Updated At (+UTC)
            </div>
          ),
          width: 208,
          dataIndex: 'lastUpdateTime',
          key: 'lastUpdateTime',
          render: (text) => {
            return <div>{`${formatDate(dayjs(text).unix().valueOf(), 'Date Time (UTC)')}`}</div>;
          },
        },
      ]
    : [
        {
          title: 'Address',
          width: 208,
          dataIndex: 'address',
          key: 'address',
          render: (text, record) => (
            <div className="flex items-center">
              <ContractToken
                showContractAddress
                address={text}
                type={AddressType.Contract}
                chainId={chain}
                chainIds={record.chainIds}
              />
            </div>
          ),
        },
        {
          title: 'Contract Name',
          width: '208px',
          dataIndex: 'contractName',
          key: 'contractName',
          render: (text) => (
            <div className="w-full max-w-[208px] truncate break-all">
              {' '}
              <EPTooltip mode="dark" title={text}>
                {text}
              </EPTooltip>
            </div>
          ),
        },
        {
          title: 'Type',
          width: 152,
          dataIndex: 'type',
          key: 'type',
        },
        {
          title: 'Version',
          dataIndex: 'contractVersion',
          key: 'contractVersion',
          width: 152,
          render(version) {
            return version ? `V ${version}` : '-';
          },
        },
        {
          title: 'Balance',
          dataIndex: 'balance',
          width: 208,
          key: 'balance',
          render(balance) {
            return typeof balance === 'number' && balance >= 0 ? addSymbol(balance) : '-';
          },
        },
        {
          title: 'Txns',
          width: 96,
          key: 'txns',
          dataIndex: 'txns',
          render(txns) {
            return typeof txns === 'number' && txns >= 0 ? thousandsNumber(txns) : '-';
          },
        },
        {
          title: (
            <div className="time cursor-pointer">
              <IconFont className="mr-1 text-xs " type="Rank" />
              Last Updated At (+UTC)
            </div>
          ),
          width: 208,
          dataIndex: 'lastUpdateTime',
          key: 'lastUpdateTime',
          render: (text) => {
            return <div>{`${formatDate(dayjs(text).unix().valueOf(), 'Date Time (UTC)')}`}</div>;
          },
        },
      ];
}
