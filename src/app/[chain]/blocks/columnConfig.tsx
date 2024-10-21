import { addSymbol, divDecimals, formatDate } from '@_utils/formatter';
import addressFormat, { hiddenAddress } from '@_utils/urlUtils';
import Link from 'next/link';
import Copy from '@_components/Copy';
import { MULTI_CHAIN } from '@_utils/contant';
import ChainTags from '@_components/ChainTags';
import EPTooltip from '@_components/EPToolTip';

const getAddressLink = (address, chainId, record) => {
  const chain = record.chainIds ? record.chainIds[0] : chainId;
  return (
    <EPTooltip
      title={
        record.producerName ? (
          <div>
            <div>Producer Name: {record.producerName}</div>
            <div>({addressFormat(address, chain)})</div>
          </div>
        ) : (
          addressFormat(address || '', chain)
        )
      }
      mode="dark"
      pointAtCenter={false}>
      <Link
        className="block text-sm leading-[22px] text-link"
        href={`/${chain}/address/${addressFormat(address, chain)}`}>
        {record.producerName || addressFormat(hiddenAddress(address, 4, 4), chain)}
      </Link>
    </EPTooltip>
  );
};

const getBlockLink = (text, chainId, record) => (
  <Link
    className="block text-sm leading-[22px] text-link"
    href={`/${record.chainIds ? record.chainIds[0] : chainId}/block/${text}`}>
    {text}
  </Link>
);

const getColumnsConfig = (chainId, isMultiChain, handleTimeChange, timeFormat) =>
  [
    {
      title: isMultiChain ? 'Chain' : 'Block',
      width: isMultiChain ? 144 : 96,
      dataIndex: isMultiChain ? 'chainIds' : 'blockHeight',
      key: isMultiChain ? 'chainIds' : 'blockHeight',
      render: isMultiChain
        ? (chainIds) => <ChainTags chainIds={chainIds || []} />
        : (text, record) => getBlockLink(text, chainId, record),
    },
    isMultiChain && {
      title: 'Block',
      width: 112,
      dataIndex: 'blockHeight',
      key: 'blockHeight',
      render: (text, record) => getBlockLink(text, chainId, record),
    },
    {
      title: (
        <div className="time cursor-pointer font-medium text-link" onClick={handleTimeChange}>
          {timeFormat}
        </div>
      ),
      width: 208,
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text) => <div className="text-sm leading-[22px]">{formatDate(text, timeFormat)}</div>,
    },
    {
      title: 'Txn',
      width: isMultiChain ? 160 : 208,
      key: 'transactionCount',
      dataIndex: 'transactionCount',
      render: (text, record) => (
        <Link
          className="block text-sm leading-[22px] text-link"
          href={`/${record.chainIds ? record.chainIds[0] : chainId}/block/${record.blockHeight}?tab=transactions`}>
          {text}
        </Link>
      ),
    },
    {
      title: 'Producer',
      key: 'producerAddress',
      width: isMultiChain ? 272 : 320,
      dataIndex: 'producerAddress',
      render: (address, record) => (
        <div className="flex items-center">
          {getAddressLink(address, chainId, record)}
          <Copy value={addressFormat(address, record.chainIds ? record.chainIds[0] : chainId)} />
        </div>
      ),
    },
    {
      title: 'Reward',
      width: 208,
      key: 'reward',
      dataIndex: 'reward',
      render: (reward) => <>{addSymbol(divDecimals(reward))}</>,
    },
    {
      title: 'Burnt Fees',
      width: 208,
      key: 'burntFees',
      dataIndex: 'burntFees',
      render: (value) => <>{addSymbol(divDecimals(value))}</>,
    },
  ].filter(Boolean);

export default function getColumns({ timeFormat, handleTimeChange, chainId }) {
  const isMultiChain = chainId === MULTI_CHAIN;
  return getColumnsConfig(chainId, isMultiChain, handleTimeChange, timeFormat);
}
