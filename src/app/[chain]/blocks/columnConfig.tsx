import { addSymbol, divDecimals, formatDate } from '@_utils/formatter';
import addressFormat, { hiddenAddress } from '@_utils/urlUtils';
import Link from 'next/link';
import Copy from '@_components/Copy';
import ChainTags from '@_components/ChainTags';
import EPTooltip from '@_components/EPToolTip';

const getAddressLink = (address, record) => {
  const chain = record.chainIds && record.chainIds[0];
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
        className="block text-sm leading-[22px] !text-primary"
        href={`/multiChain/address/${addressFormat(address, chain)}`}>
        {record.producerName || addressFormat(hiddenAddress(address, 4, 4), chain)}
      </Link>
    </EPTooltip>
  );
};

const getBlockLink = (text, record) => (
  <Link
    className="block text-sm leading-[22px] !text-primary"
    href={`/${record.chainIds && record.chainIds[0]}/block/${text}`}>
    {text}
  </Link>
);

const getColumnsConfig = (handleTimeChange, timeFormat) =>
  [
    {
      title: 'Chain',
      width: 180,
      dataIndex: 'chainIds',
      key: 'chainIds',
      render: (chainIds) => <ChainTags chainIds={chainIds || []} />,
    },
    {
      title: 'Block',
      width: 160,
      dataIndex: 'blockHeight',
      key: 'blockHeight',
      render: (text, record) => getBlockLink(text, record),
    },
    {
      title: (
        <div className="time cursor-pointer font-medium !text-primary" onClick={handleTimeChange}>
          {timeFormat}
        </div>
      ),
      width: 230,
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text) => <div className="text-sm leading-[22px]">{formatDate(text, timeFormat)}</div>,
    },
    {
      title: 'Txn',
      width: 140,
      key: 'transactionCount',
      dataIndex: 'transactionCount',
      render: (text, record) => (
        <Link
          className="block text-sm leading-[22px] !text-primary"
          href={`/${record.chainIds && record.chainIds[0]}/block/${record.blockHeight}?tab=transactions`}>
          {text}
        </Link>
      ),
    },
    {
      title: 'Producer',
      key: 'producerAddress',
      width: 230,
      dataIndex: 'producerAddress',
      render: (address, record) => (
        <div className="flex items-center">
          {getAddressLink(address, record)}
          <Copy value={addressFormat(address, record.chainIds && record.chainIds[0])} />
        </div>
      ),
    },
    {
      title: 'Reward',
      width: 230,
      key: 'reward',
      dataIndex: 'reward',
      render: (reward) => <>{addSymbol(divDecimals(reward))}</>,
    },
    {
      title: 'Burnt Fees',
      width: 230,
      key: 'burntFees',
      dataIndex: 'burntFees',
      render: (value) => <>{addSymbol(divDecimals(value))}</>,
    },
  ].filter(Boolean);

export default function getColumns({ timeFormat, handleTimeChange }) {
  return getColumnsConfig(handleTimeChange, timeFormat);
}
