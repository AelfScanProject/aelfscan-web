'use client';
import { IAddressResponse, IAddressTokensDetail } from '@_types/commonDetail';
import HeadTitle from '@_components/HeaderTitle';
import Copy from '@_components/Copy';
import IconFont from '../IconFont/index';
import QrCode from '@_components/QrCode';
import Overview from './components/overview';
import { formatDate, numberFormatter, thousandsNumber } from '@_utils/formatter';
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

export default function AddressDetail({ SSRData }: { SSRData: IAddressResponse }) {
  const { chain, address } = useParams<{
    chain: TChainID;
    address: string;
  }>();

  const addressType = useMemo<number>(() => {
    return SSRData.addressType;
  }, [SSRData]);
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
    elfPriceInUsd,
    lastTransactionSend,
    addressTypeList,
    firstTransactionSend,
    contractTransactionHash,
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
  if (!isAddress) {
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
  return (
    <div className="address-detail">
      <div className="address-header">
        <HeadTitle className={isMobile && 'flex-col !items-start'} adPage={title + 'detail'} content={title}>
          <div className={clsx('code-box ml-2', isMobile && '!ml-0 flex flex-wrap items-center')}>
            <span className="break-all text-sm leading-[22px] ">
              {address}
              <Copy className="!ml-4" value={address} />
              <EPTooltip
                placement="bottom"
                mode="light"
                getPopupContainer={(node) => node}
                trigger="click"
                title={<QrCode value={address} />}>
                <IconFont className="ml-4 cursor-pointer text-xs" type="QR-Code" />
              </EPTooltip>
            </span>
          </div>
        </HeadTitle>
      </div>
      <div className={clsx(isMobile && 'flex-col', 'address-overview flex')}>
        <Overview title="Overview" className={clsx(isMobile && '!mr-0 mb-4', 'mr-4 flex-1')} items={OverviewInfo} />
        <Overview title="MoreInfo" className="flex-1" items={isAddress ? addressMoreInfo : contractInfo} />
      </div>
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
