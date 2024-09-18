const clsPrefix = 'home-latest';
import './index.css';

import IconFont from '@_components/IconFont';
import Link from 'next/link';
import addressFormat, { hiddenAddress } from '@_utils/urlUtils';
import clsx from 'clsx';
import EPTooltip from '@_components/EPToolTip';
import { IBlocksResponseItem, ITransactionsResponseItem } from '@_api/type';
import { divDecimals, formatDate, thousandsNumber } from '@_utils/formatter';
import { useAppSelector } from '@_store';
import ContractToken from '@_components/ContractToken';
import { useMD } from '@_hooks/useResponsive';
import { memo, useMemo } from 'react';
import BasicTag from '@_components/BasicTag';
import { MULTI_CHAIN } from '@_utils/contant';
import { ITokensItem } from '@pageComponents/home/page';
import { TokenTypeEnum } from '@app/[chain]/token/[tokenSymbol]/type';
import TokenTableCell from '@_components/TokenTableCell';
import TokenImage from '@app/[chain]/tokens/_components/TokenImage';

interface IProps {
  isBlocks: boolean;
  iconType: string;
  title: string;
  data: IBlocksResponseItem[] | ITransactionsResponseItem[] | ITokensItem[];
}

function Latest({ isBlocks, data, iconType, title }: IProps) {
  const isMD = useMD();
  const { defaultChain } = useAppSelector((state) => state.getChainId);

  const multi = useMemo(() => {
    return defaultChain === MULTI_CHAIN;
  }, [defaultChain]);
  const RewrdInfo = (ele) => {
    return multi && iconType === 'latest-tokens' ? (
      <div className="middle">
        <div>
          <div className="text-sm text-base-100">{thousandsNumber(ele.Holders)}</div>
          <div className="text-xs text-base-200">Holders</div>
        </div>
      </div>
    ) : (
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
        {data.map((ele) => {
          return (
            <div className="item" key={ele.transactionId || ele.blockHeight || ele.symbol}>
              {multi && iconType === 'latest-tokens' ? (
                <div className="left">
                  <Link
                    prefetch={false}
                    href={
                      ele.type === TokenTypeEnum.nft
                        ? `/nftItem?chainId=${ele.chainIds[0]}&itemSymbol=${ele.symbol}`
                        : `/${defaultChain}/token/${ele.symbol}`
                    }>
                    <TokenTableCell token={ele} subtitle={<BasicTag chainIds={ele.chainIds} />}>
                      <TokenImage className="!size-7" width="28px" height="28px" token={ele} />
                    </TokenTableCell>
                  </Link>
                </div>
              ) : (
                <div className="left">
                  <IconFont type={iconType}></IconFont>
                  <div className="text">
                    <span className="height">
                      {isBlocks ? (
                        <Link prefetch={false} href={`/${defaultChain}/block/${ele.blockHeight}`}>
                          {ele.blockHeight}
                        </Link>
                      ) : (
                        <EPTooltip title={ele.transactionId} mode="dark" pointAtCenter={false}>
                          <Link prefetch={false} href={`/${ele.chainIds[0]}/tx/${ele.transactionId}`}>
                            {ele.transactionId}
                          </Link>
                        </EPTooltip>
                      )}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="time">{formatDate(ele.timestamp, 'Age')}</span>
                      {multi && <BasicTag chainIds={ele.chainIds} />}
                    </div>
                  </div>
                </div>
              )}
              {multi && iconType === 'latest-tokens' ? (
                isMD ? (
                  <div className="mt-1 flex w-full items-center">
                    <div className="flex flex-1 items-center gap-2">
                      <div className="text-xs text-base-200">Transfers</div>
                      <div className="text-sm text-base-100">{thousandsNumber(ele.Transfers)}</div>
                    </div>
                    <div className="flex flex-1 items-center gap-2">
                      <div className="text-xs text-base-200">Holders</div>
                      <div className="text-sm text-base-100">{thousandsNumber(ele.Holders)}</div>
                    </div>
                  </div>
                ) : (
                  <div className="middle !flex-row !items-start !justify-start">
                    <div>
                      <div className="text-sm text-base-100">{thousandsNumber(ele.Transfers)}</div>
                      <div className="text-xs text-base-200">Transfers</div>
                    </div>
                  </div>
                )
              ) : (
                <div className="middle">
                  {isBlocks ? (
                    <>
                      <span className="producer inline-block truncate">
                        <span className="mr-1">Producer</span>
                        <EPTooltip title={ele.producerName} mode="dark" pointAtCenter={false}>
                          <Link
                            prefetch={false}
                            className="truncate"
                            href={`${defaultChain}/address/${addressFormat(ele.producerAddress, defaultChain)}`}>
                            {ele.producerName
                              ? ele.producerName
                              : `${addressFormat(hiddenAddress(ele.producerAddress || '', 4, 4), defaultChain)}`}
                          </Link>
                        </EPTooltip>
                      </span>
                      <span className="txns">
                        <Link prefetch={false} href={`/${defaultChain}/block/${ele.blockHeight}?tab=transactions`}>
                          {ele.transactionCount} txns
                        </Link>
                        <span className="time">in {formatDate(ele.timestamp, 'Age')}</span>
                        {isMD && RewrdInfo(ele)}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="from">
                        <span className="mr-1">From</span>
                        <ContractToken
                          address={ele?.from?.address}
                          showCopy={false}
                          type={ele.from?.addressType}
                          name={ele.from?.name}
                          chainId={defaultChain as string}
                        />
                      </span>
                      <span className="to">
                        <span className="mr-1">To</span>
                        <ContractToken
                          address={ele.to?.address}
                          type={ele.to?.addressType}
                          name={ele.to?.name}
                          showCopy={false}
                          chainId={defaultChain as string}
                        />
                        {isMD && RewrdInfo(ele)}
                      </span>
                    </>
                  )}
                </div>
              )}
              {!isMD && (
                <div className={`right ${iconType === 'latest-tokens' && '!items-start'}`}>{RewrdInfo(ele)}</div>
              )}
            </div>
          );
        })}
      </div>
      <div className="link">
        <Link
          href={
            multi && iconType === 'latest-tokens'
              ? `/${defaultChain}/tokens`
              : isBlocks
                ? `/${defaultChain}/blocks`
                : `/${defaultChain}/transactions`
          }
          prefetch={false}>
          View All {multi && iconType === 'latest-tokens' ? 'Tokens' : isBlocks ? 'Blocks' : 'Transactions'}
          <IconFont type="right-arrow-2"></IconFont>
        </Link>
      </div>
    </div>
  );
}

export default memo(Latest);
