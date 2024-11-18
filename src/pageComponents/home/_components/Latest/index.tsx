const clsPrefix = 'home-latest';
import './index.css';

import IconFont from '@_components/IconFont';
import Link from 'next/link';
import clsx from 'clsx';
import EPTooltip from '@_components/EPToolTip';
import { IBlocksResponseItem, ITopTokensItem, ITransactionsResponseItem } from '@_api/type';
import { divDecimals, formatDate } from '@_utils/formatter';
import ContractToken from '@_components/ContractToken';
import { useMD } from '@_hooks/useResponsive';
import { memo } from 'react';
import { MULTI_CHAIN } from '@_utils/contant';

interface IProps {
  isBlocks: boolean;
  iconType: string;
  title: string;
  tips?: string;
  data: IBlocksResponseItem[] | ITransactionsResponseItem[] | ITopTokensItem[];
}

function Latest({ isBlocks, data, iconType, title, tips }: IProps) {
  const isMD = useMD();
  const RewrdInfo = (ele) => {
    return (
      <span className="button">
        {ele.reward || ele.transactionFee ? (
          <>
            <span className="reward">{divDecimals(isBlocks ? ele.reward : ele.transactionFee)}</span>
            <span>ELF</span>
          </>
        ) : (
          '-'
        )}
      </span>
    );
  };

  return (
    <div className={clsx(clsPrefix, isMD && `${clsPrefix}-mobile`)}>
      <div className="title">{title}</div>
      <div className="content">
        {data?.map((ele) => {
          return isMD && !isBlocks ? (
            <div className="flex items-center gap-4 border-b border-border py-4">
              <div className="flex items-center">
                <IconFont
                  className="text-[40px]"
                  type={ele.chainIds[0] === 'AELF' ? 'mainChainLogo' : 'dappChainLogo'}></IconFont>
              </div>
              <div className="text-sm">
                <EPTooltip title={ele.transactionId} mode="dark" pointAtCenter={false}>
                  <Link
                    prefetch={false}
                    className="mb-2 hidden w-[140px] truncate !text-primary"
                    href={`/${ele.chainIds[0]}/tx/${ele.transactionId}`}>
                    {ele.transactionId}
                  </Link>
                </EPTooltip>
                <div className="from mb-1 flex items-center">
                  <span className="mr-1 font-medium">From:</span>
                  <ContractToken
                    address={ele?.from?.address}
                    showCopy={false}
                    type={ele.from?.addressType}
                    name={ele.from?.name}
                    chainIds={ele.chainIds}
                  />
                </div>
                <div className="to mb-1 flex items-center">
                  <span className="mr-1 font-medium">To:</span>
                  <ContractToken
                    address={ele.to?.address}
                    type={ele.to?.addressType}
                    name={ele.to?.name}
                    showCopy={false}
                    chainIds={ele.chainIds}
                  />
                </div>
                <div className="time mb-2 text-muted-foreground">{formatDate(ele.timestamp, 'Age')}</div>
                {RewrdInfo(ele)}
              </div>
            </div>
          ) : (
            <div className="item" key={ele.transactionId || ele.blockHeight || ele.symbol}>
              <div className="left">
                <IconFont type={ele.chainIds[0] === 'AELF' ? 'mainChainLogo' : 'dappChainLogo'}></IconFont>
                <div className="text">
                  <span className="height">
                    {isBlocks ? (
                      <Link prefetch={false} href={`/${ele.chainIds[0]}/block/${ele.blockHeight}`}>
                        {ele.blockHeight}
                      </Link>
                    ) : (
                      <EPTooltip title={ele.transactionId} mode="dark" pointAtCenter={false}>
                        <Link
                          prefetch={false}
                          className="!text-primary"
                          href={`/${ele.chainIds[0]}/tx/${ele.transactionId}`}>
                          {ele.transactionId}
                        </Link>
                      </EPTooltip>
                    )}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="time">{formatDate(ele.timestamp, 'Age')}</span>
                  </div>
                </div>
              </div>

              {isBlocks ? null : (
                <div className={clsx('middle')}>
                  <span className="from">
                    <span className="mr-1 font-medium">From:</span>
                    <ContractToken
                      address={ele?.from?.address}
                      showCopy={false}
                      type={ele.from?.addressType}
                      name={ele.from?.name}
                      chainIds={ele.chainIds}
                    />
                  </span>
                  <span className="to">
                    <span className="mr-1 font-medium">To:</span>
                    <ContractToken
                      address={ele.to?.address}
                      type={ele.to?.addressType}
                      name={ele.to?.name}
                      showCopy={false}
                      chainIds={ele.chainIds}
                    />
                    {isMD && RewrdInfo(ele)}
                  </span>
                </div>
              )}

              {(!isMD || isBlocks) && (
                <div className={clsx('right', isMD && '!w-auto !flex-auto')}>
                  {isBlocks ? (
                    <Link
                      prefetch={false}
                      className="text-base text-primary"
                      href={`/${ele.chainIds[0]}/block/${ele.blockHeight}?tab=transactions`}>
                      {ele.transactionCount} Txns
                    </Link>
                  ) : (
                    RewrdInfo(ele)
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className={clsx('link', isMD && !isBlocks && 'mt-6')}>
        <Link href={isBlocks ? `/${MULTI_CHAIN}/blocks` : `/${MULTI_CHAIN}/transactions`} prefetch={false}>
          <span className="px-1">View all {isBlocks ? 'blocks' : 'transactions'}</span>
          <IconFont className="text-base" type="arrow-right"></IconFont>
        </Link>
      </div>
    </div>
  );
}

export default memo(Latest);
