import AddressWithCopy from '@_components/AddressWithCopy';
import { thousandsNumber } from '@_utils/formatter';
import { DescriptionsProps } from 'antd';
import Link from 'next/link';
import { TTransferSearchData } from '../../type';

export function getSearchByHolderItems(
  address: string,
  isMobile: boolean,
  sourceData?: TTransferSearchData,
): DescriptionsProps['items'] {
  const spanWith2col = isMobile ? 4 : 2;
  const spanWith1col = isMobile ? 4 : 1;
  const marginTop = isMobile ? 16 : 0;
  return [
    {
      key: 'desc',
      label: 'Filtered by Token Holder',
      children: <AddressWithCopy address={address} />,
      labelStyle: {
        color: '#252525',
        fontWeight: 500,
      },
      span: spanWith2col,
    },
    {
      key: 'balance',
      label: 'BALANCE',
      children: thousandsNumber(sourceData?.balance as number),
      labelStyle: {
        marginTop,
      },
      span: spanWith1col,
    },
    {
      key: 'value',
      label: 'VALUE',
      children: thousandsNumber(sourceData?.value as number),
      labelStyle: {
        marginTop,
      },
      span: spanWith1col,
    },
  ];
}

export function getSearchByHashItems(
  address: string,
  isMobile: boolean,
  chain,
  blockHeight,
): DescriptionsProps['items'] {
  const spanWith2col = isMobile ? 4 : 2;
  return [
    {
      key: 'desc',
      label: 'Filtered by Token Txn Hash',
      labelStyle: {
        color: '#252525',
        fontWeight: 500,
      },
      children: (
        <Link
          className="block w-[400px] truncate text-link"
          href={`/${chain}/tx/${address}?blockHeight=${blockHeight}`}>
          {address}
        </Link>
      ),
      span: spanWith2col,
    },
  ];
}
