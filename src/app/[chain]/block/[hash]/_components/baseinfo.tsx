/*
 * @author: Peterbjx
 * @Date: 2023-08-17 11:05:56
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-18 14:42:02
 * @Description: baseinfo
 */

import DetailContainer from '@_components/DetailContainer';
import { useMemo } from 'react';
import ConfirmStatus from '@_components/ConfirmedStatus';
import IconFont from '@_components/IconFont';
import { addSymbol, divDecimals, formatDate } from '@_utils/formatter';
import Copy from '@_components/Copy';
import JumpButton from '@_components/JumpButton';
import SizeBytes from '@_components/SizeBytes';
import addressFormat, { hiddenAddress } from '@_utils/urlUtils';
import { StatusEnum } from '@_types/status';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MULTI_CHAIN } from '@_utils/contant';
import EPTooltip from '@_components/EPToolTip';
export default function BaseInfo({ data, tabChange, jump }) {
  const { chain } = useParams();
  const isFirst = data?.preBlockHeight === 0;
  const isLast = data?.nextBlockHeight === 0;

  const renderInfo = useMemo(() => {
    return [
      {
        label: 'Blocks Height',
        tip: 'The number of blocks from the genesis block to the current one.',
        value: (
          <div className="flex items-center">
            <span className="mr-2">{data.blockHeight}</span>
            <JumpButton isFirst={isFirst} isLast={isLast} jump={jump} />
          </div>
        ),
      },
      {
        label: 'Status ',
        tip: 'The status of the block.',
        value: (
          <div className="flex">
            <ConfirmStatus status={data.confirmed ? StatusEnum.Confirmed : StatusEnum.Unconfrimed} />
          </div>
        ),
      },
      {
        label: 'Timestamp ',
        tip: 'The date and time at which the block is produced.',
        value: (
          <div className="value-timestamp">
            <IconFont className="mr-1 text-base" type="clock" />
            <span>
              {formatDate(data.timestamp, 'age')}({formatDate(data.timestamp, 'Date Time')})
            </span>
          </div>
        ),
      },
      {
        label: 'Transactions ',
        tip: 'The number of transactions in the block.',
        value: (
          <div>
            <span
              className=" cursor-pointer text-primary"
              onClick={() => {
                tabChange('transactions');
              }}>
              {data.total} transactions
            </span>
            <span className="ml-1">in this block</span>
          </div>
        ),
      },
      {
        label: 'Chain ID ',
        tip: 'The chain on which the block is produced.',
        value: <div>{data.chainId}</div>,
      },
      {
        label: 'divider1',
        value: 'divider',
      },
      {
        label: 'Producer ',
        tip: 'The producer of the block.',
        value: (
          <div>
            <EPTooltip
              pointAtCenter={false}
              title={addressFormat(data.producer?.address || '', chain as string)}
              mode="dark">
              <Link
                className="text-primary"
                href={`/${MULTI_CHAIN}/address/${addressFormat(data.producer?.address, chain as string)}`}>
                {data.producer?.name
                  ? data.producer?.name
                  : addressFormat(hiddenAddress(data.producer?.address), chain as string)}
              </Link>
            </EPTooltip>
            <Copy value={addressFormat(data.producer?.address, chain as string)} />
            <span className="ml-1">in 0.5 secs</span>
          </div>
        ),
      },
      {
        label: 'Block Reward ',
        tip: 'The block reward given by aelf network, unaffected by the specific transaction.',
        value: (
          <div className="flex items-center ">
            <span className="mr-1">{addSymbol(divDecimals(data.reward?.elfReward))}</span>
            {data.reward?.usdReward && <div className="text-muted-foreground"> (${data.reward?.usdReward})</div>}
          </div>
        ),
      },
      {
        label: 'Size ',
        tip: 'The size of the block.',
        value: <SizeBytes size={data.blockSize} />,
      },
      {
        label: 'divider2',
        value: 'divider',
      },
      {
        label: 'Burnt Fees ',
        tip: 'Each transaction will burn 10% of its Size Fee.',
        value: (
          <div className="flex items-center text-sm leading-[22px]">
            {(data.burntFee?.elfFee && <span className="mr-1">{addSymbol(divDecimals(data.burntFee?.elfFee))}</span>) ||
              '-'}
            {data.burntFee?.usdFee && <div className="text-muted-foreground"> (${data.burntFee?.usdFee})</div>}
          </div>
        ),
      },
    ];
  }, [data, isFirst, isLast, jump, chain, tabChange]);
  return <DetailContainer infoList={renderInfo} />;
}
