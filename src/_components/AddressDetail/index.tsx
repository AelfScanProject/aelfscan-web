'use client';
import { IAddressResponse, IAddressTokensDetail, IPortfolio } from '@_types/commonDetail';
import HeadTitle from '@_components/HeaderTitle';
import Copy from '@_components/Copy';
import IconFont from '../IconFont/index';
import QrCode from '@_components/QrCode';
import Overview from './components/overview';
import { fixedDecimals, formatDate, getAddress, numberFormatter, thousandsNumber } from '@_utils/formatter';
import EPTabs, { EPTabsRef } from '../EPTabs/index';
import TransactionList from '@app/[chain]/transactions/list';
import TokenTransfers from '@_components/TokenTransfers';
import NFTTransfers from '@_components/NFTTransfers';
import History from './components/History';
import { useMemo, useRef, useState } from 'react';
import Events from './components/Events';
import Contract from './components/Contract';
import Tokens from './components/Tokens';
import clsx from 'clsx';
import './index.css';
import EPTooltip from '@_components/EPToolTip';
import { useMobileAll } from '@_hooks/useResponsive';
import { useParams, useSearchParams } from 'next/navigation';
import { IPageBannerAdsDetail, TChainID } from '@_api/type';
import dayjs from 'dayjs';
import Link from 'next/link';
import ContractToken from '@_components/ContractToken';
import { AddressType, TablePageSize } from '../../_types/common';
import useSearchAfterParams from '@_hooks/useSearchAfterParams';
import AdsImage from '@_components/AdsImage';
import { useEffectOnce } from 'react-use';
import { fetchBannerAdsDetail } from '@_api/fetchSearch';
import AATransactionList from '@app/[chain]/transactions/aaList';
import addressFormat from '@_utils/urlUtils';
import { useMultiChain, useSideChain } from '@_hooks/useSelectChain';
import OverviewThreeCard from '@_components/OverviewCard/three';
import { IOverviewItem } from '@_components/OverviewCard/type';
import NFTAssets from './components/Tokens/NFTAssets';

export default function AddressDetail({ SSRData }: { SSRData: IAddressResponse }) {
  const { chain, address } = useParams<{
    chain: TChainID;
    address: string;
  }>();

  const addressType = useMemo<number>(() => {
    return SSRData.addressType;
  }, [SSRData]);

  const multi = useMultiChain();

  const isAddress = addressType === 0;
  const title = isAddress ? 'Address' : 'Contract';
  const {
    author,
    totalValueOfUsd,
    totalValueOfElf,
    totalValueOfUsdChangeRate,
    contractName,
    tokenHoldings,
    elfBalanceOfUsd,
    elfBalance,
    chainIds,
    elfPriceInUsd,
    lastTransactionSend,
    addressTypeList,
    firstTransactionSend,
    contractTransactionHash,
    portfolio,
  } = SSRData;

  console.log(SSRData, 'AddressDetail');

  const { defaultPage, defaultPageSize, defaultPageType } = useSearchAfterParams(TablePageSize.mini, 'transactions');
  const OverviewInfo = useMemo(() => {
    return [
      {
        label: 'ELF BALANCE',
        value: (
          <div>
            <IconFont className="mr-1" type="Aelf-transfer" />
            <span>{typeof elfBalance === 'number' ? numberFormatter(elfBalance) : '-'}</span>
          </div>
        ),
      },
      {
        label: 'ELF VALUE IN USD',
        value: (
          <span>
            {elfBalanceOfUsd ? (
              <span>
                <span className="mr-1 inline-block text-sm leading-[22px]">{`$${thousandsNumber(elfBalanceOfUsd)}`}</span>
                <span className="inline-block">{`(@ $${elfPriceInUsd}/ELF)`}</span>
              </span>
            ) : (
              '-'
            )}
          </span>
        ),
      },
      {
        label: 'TOKEN HOLDINGS',
        value: <span className="inline-block leading-[22px]">{thousandsNumber(tokenHoldings)} Tokens</span>,
      },
    ];
  }, [elfBalance, elfBalanceOfUsd, elfPriceInUsd, tokenHoldings]);

  const sideChain = useSideChain();

  const addressMoreInfo = useMemo(() => {
    return [
      {
        label: 'LAST TXN SENT',
        value: lastTransactionSend ? (
          <div className="flex items-center">
            <EPTooltip mode="dark" title={lastTransactionSend?.transactionId}>
              <Link className="h-[22px]" href={`/${chain}/tx/${lastTransactionSend?.transactionId}}`}>
                <span className="inline-block max-w-[120px] truncate text-sm leading-[22px] text-link">
                  {lastTransactionSend?.transactionId}
                </span>
              </Link>
            </EPTooltip>
            <span className="inline-block text-base-100">
              from {formatDate(dayjs(lastTransactionSend.blockTime).unix().valueOf(), 'Age')}
            </span>
          </div>
        ) : (
          'N/A'
        ),
      },
      {
        label: 'FIRST TXN SENT',
        value: firstTransactionSend ? (
          <div className="flex items-center">
            <EPTooltip mode="dark" title={firstTransactionSend?.transactionId}>
              <Link className="h-[22px]" href={`/${chain}/tx/${firstTransactionSend?.transactionId}}`}>
                <span className="inline-block max-w-[120px] truncate text-sm leading-[22px] text-link">
                  {firstTransactionSend?.transactionId}
                </span>
              </Link>
            </EPTooltip>
            <span className="inline-block text-base-100">
              from {formatDate(dayjs(firstTransactionSend.blockTime).unix().valueOf(), 'Age')}
            </span>
          </div>
        ) : (
          'N/A'
        ),
      },
    ];
  }, [chain, firstTransactionSend, lastTransactionSend]);
  const MultiChainInfo = useMemo(() => {
    const chainId = chain === 'AELF' ? sideChain : 'AELF';
    return [
      {
        label: 'Multichain Portfolio',
        value:
          portfolio?.total.usdValue || portfolio?.total.usdValue === 0 ? (
            <span className="inline-block leading-[22px]">${portfolio?.total.usdValue}</span>
          ) : (
            '--'
          ),
      },
      {
        label: 'Multichain',
        value:
          chainIds && chainIds.length > 1 ? (
            <div className="flex items-center">
              <Link className="h-[22px]" href={`/${chainId}/address/${addressFormat(getAddress(address), chainId)}}`}>
                <span className="inline-block max-w-[120px] truncate text-sm leading-[22px] text-link">
                  {chain !== 'AELF' ? 'aelf MainChain' : 'aelf dAppChain'}
                </span>
              </Link>
              <span className="ml-1 inline-block text-base-100">
                (${chain === 'AELF' ? portfolio?.sideChain?.usdValue : portfolio?.mainChain?.usdValue})
              </span>
            </div>
          ) : (
            '--'
          ),
      },
    ];
  }, [address, chain, sideChain, portfolio, chainIds]);
  const contractInfo = useMemo(() => {
    return [
      {
        label: 'CONTRACT NAME',
        value: contractName,
      },
      {
        label: 'AUTHOR',
        value: author ? (
          <div className="flex items-center text-sm leading-[22px]">
            <ContractToken address={author} type={AddressType.address} showCopy={false} chainId={chain} />
            <span className="mx-1">at txn</span>
            <span className="inline-block max-w-[120px] truncate text-link">
              {contractTransactionHash && contractTransactionHash.slice(0, 15) + '....'}
            </span>
          </div>
        ) : (
          '-'
        ),
      },
    ];
  }, [author, chain, contractName, contractTransactionHash]);

  const tabRef = useRef<EPTabsRef>(null);

  const Search = useSearchParams();

  let defaultTab = (Search.get('tab') as string) || '';

  const onTabClick = (key) => {
    tabRef.current?.setActiveKey(key);
  };
  const items = [
    {
      key: '',
      label: 'Tokens',
      children: (
        <Tokens
          tokenDetail={
            {
              totalValueOfUsd,
              totalValueOfElf,
              totalValueOfUsdChangeRate,
            } as IAddressTokensDetail
          }
        />
      ),
    },
    {
      key: 'nfts',
      label: 'NFTs',
      children: <NFTAssets />,
    },
    {
      key: 'transactions',
      label: 'Transactions',
      children: addressTypeList.includes('PortKey') ? (
        <AATransactionList />
      ) : (
        <TransactionList
          showHeader={false}
          SSRData={{ total: 0, data: [] }}
          defaultPage={defaultPage}
          defaultPageSize={defaultPageSize}
          defaultPageType={defaultPageType}
          defaultChain={chain}
        />
      ),
    },
    {
      key: 'tokentransfers',
      label: 'Token Transfers',
      children: <TokenTransfers />,
    },
    {
      key: 'nfttransfers',
      label: 'NFT Transfers',
      children: <NFTTransfers showHeader={false} />,
    },
  ];
  if (!isAddress && !multi) {
    defaultTab = defaultTab || 'contract';
    items.push(
      {
        key: 'contract',
        label: 'Contract',
        children: <Contract />,
      },
      {
        key: 'events',
        label: 'Events',
        children: <Events />,
      },
      {
        key: 'history',
        label: 'History',
        children: <History SSRData={[]} onTabClick={onTabClick} />,
      },
    );
  }

  const [adsData, setAdsData] = useState<IPageBannerAdsDetail>();

  useEffectOnce(() => {
    fetchBannerAdsDetail({ label: 'Addressdetail' })
      .then((res) => {
        setAdsData(res);
      })
      .catch(() => {
        setAdsData(undefined);
      });
  });

  const isMobile = useMobileAll();

  const multiTokenDetail = (data?: IPortfolio): IOverviewItem[][] => {
    return [
      [
        {
          key: 'value',
          label: 'Total Value',
          format: thousandsNumber,
          render: (text, record) => (
            <div className="text-sm font-medium leading-[22px] text-base-100">${data?.total.usdValue}</div>
          ),
        },
        {
          key: 'token',
          label: 'Total Token',
          render: (text, record) => (
            <div className="text-sm font-medium leading-[22px] text-base-100">{data?.total.count} Tokens</div>
          ),
        },
      ],
      [
        {
          key: 'mainValue',
          label: 'aelf MainChain Value',
          render: (text, record) => (
            <div className="text-sm font-medium leading-[22px] text-base-100">
              ${data?.mainChain?.usdValue}
              <span className="ml-1 inline-block text-sm font-normal leading-[22px] text-base-200">
                ({fixedDecimals(data?.mainChain?.usdValuePercentage)}%)
              </span>
            </div>
          ),
        },
        {
          key: 'mainToken',
          label: 'aelf MainChain Token',
          render: (text, record) => (
            <div className="text-sm font-medium leading-[22px] text-base-100">{data?.mainChain?.count} Tokens</div>
          ),
        },
      ],
      [
        {
          key: 'sideValue',
          label: 'aelf dAppChain Value',
          render: (text, record) => (
            <div className="text-sm font-medium leading-[22px] text-base-100">
              ${data?.sideChain?.usdValue}
              <span className="ml-1 inline-block text-sm font-normal leading-[22px] text-base-200">
                ({fixedDecimals(data?.sideChain?.usdValuePercentage)}%)
              </span>
            </div>
          ),
        },
        {
          key: 'sideToken',
          label: 'aelf dAppChain Token',
          render: (text, record) => (
            <div className="text-sm font-medium leading-[22px] text-base-100">{data?.sideChain?.count} Tokens</div>
          ),
        },
      ],
    ];
  };

  const multiDetailItems = multiTokenDetail(portfolio);
  return (
    <div className="address-detail">
      <div className="address-header">
        <HeadTitle
          className={isMobile && 'flex-col !items-start'}
          adPage={title + 'detail'}
          content={title}
          mainLink={
            multi && chainIds?.includes('AELF') ? `/AELF/address/${addressFormat(getAddress(address), 'AELF')}` : ''
          }
          sideLink={
            multi && chainIds?.includes(sideChain)
              ? `/${sideChain}/address/${addressFormat(getAddress(address), sideChain)}`
              : ''
          }>
          <div className={clsx('code-box ml-2', isMobile && '!ml-0 flex flex-wrap items-center')}>
            <span className="inline-block break-all text-sm leading-[22px] ">
              {address}
              <Copy className="!ml-2" value={address} />
              <EPTooltip
                placement="bottom"
                mode="light"
                getPopupContainer={(node) => node}
                trigger="click"
                title={<QrCode value={address} />}>
                <IconFont className="ml-2 cursor-pointer text-sm" type="QR-Code" />
              </EPTooltip>
            </span>
          </div>
        </HeadTitle>
      </div>
      {multi ? (
        <OverviewThreeCard items={multiDetailItems} dataSource={SSRData} title="Portfolio" />
      ) : (
        <div className={clsx(isMobile && 'flex-col', 'address-overview flex gap-4')}>
          <Overview title="Overview" className="flex-1" items={OverviewInfo} />
          <Overview title="MoreInfo" className="flex-1" items={isAddress ? addressMoreInfo : contractInfo} />
          {!multi && isAddress && <Overview title="Multichain Info" className="flex-1" items={MultiChainInfo} />}
        </div>
      )}
      {adsData && adsData.adsBannerId && (
        <div className="mt-4">
          <AdsImage adPage="Addressdetail" adsItem={adsData} />
        </div>
      )}
      <div className="address-main mt-4">
        <EPTabs ref={tabRef} selectKey={defaultTab} items={items} />
      </div>
    </div>
  );
}
