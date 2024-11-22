'use client';
import { IAddressResponse } from '@_types/commonDetail';
import HeadTitle from '@_components/HeaderTitle';
import { getAddress } from '@_utils/formatter';
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
import { useMobileAll } from '@_hooks/useResponsive';
import { useParams, useSearchParams } from 'next/navigation';
import { TChainID } from '@_api/type';
import { TablePageSize } from '../../_types/common';
import useSearchAfterParams from '@_hooks/useSearchAfterParams';
import AATransactionList from '@app/[chain]/transactions/aaList';
import addressFormat, { hiddenAddress } from '@_utils/urlUtils';
import NFTAssets from './components/Tokens/NFTAssets';
import Image from 'next/image';
import ContractSuccessIcon from 'public/image/contract-success.svg';
import { ITabsProps } from 'aelf-design';
import MultiChain from '@_components/ContractToken/multiChain';
import Link from 'next/link';
import { MULTI_CHAIN } from '@_utils/contant';

export default function AddressDetail({ SSRData }: { SSRData: IAddressResponse }) {
  const { chain, address } = useParams<{
    chain: TChainID;
    address: string;
  }>();

  const addressType = useMemo<number>(() => {
    return SSRData.addressType;
  }, [SSRData]);

  const isAddress = addressType === 0;
  const title = isAddress ? 'Account' : 'Contract';
  const { author, contractName, chainIds, addressTypeList, portfolio } = SSRData;

  console.log(SSRData, 'AddressDetail');

  const { defaultPage, defaultPageSize, defaultPageType } = useSearchAfterParams(TablePageSize.mini, 'transactions');

  const tabRef = useRef<EPTabsRef>(null);

  const Search = useSearchParams();

  let defaultTab = (Search.get('tab') as string) || 'transactions';

  const [isVerify, setIsVerify] = useState(false);

  const onTabClick = (key) => {
    tabRef.current?.setActiveKey(key);
  };

  const tokenTabItems: ITabsProps['items'] = [
    {
      key: 'Tokens',
      label: 'Tokens',
      children: <Tokens chainIds={chainIds} portfolio={portfolio} />,
    },
    {
      key: 'nfts',
      label: 'NFTs',
      children: <NFTAssets portfolio={portfolio} chainIds={chainIds} />,
    },
  ];

  const items: ITabsProps['items'] = [
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
  if (!isAddress) {
    defaultTab = Search.get('tab') || 'contract';
    tokenTabItems.push({
      key: 'MoreInfo',
      label: 'More Info',
      children: (
        <div className="flex gap-10 px-4 pb-6 pt-2">
          <div className="flex flex-col gap-[2px]">
            <div className="text-sm font-medium text-muted-foreground">Contract name</div>
            <div className="text-sm font-medium">{contractName || '-'}</div>
          </div>
          <div className="flex flex-col gap-[2px]">
            <div className="text-sm font-medium text-muted-foreground">Author</div>
            <div className="text-sm font-medium text-primary">
              <Link href={`/${MULTI_CHAIN}/address/${author}`}>
                {addressFormat(hiddenAddress(author), chainIds[0] || 'AELF')}
              </Link>
            </div>
          </div>
        </div>
      ),
    });
    items.push(
      {
        key: 'contract',
        label: (
          <div className="contract-title relative">
            <span>Contract</span>
            {isVerify && (
              <Image
                alt=""
                className="contract-icon absolute right-[-12px] top-[-3px]"
                src={ContractSuccessIcon}
                width={14}
                height={14}></Image>
            )}
          </div>
        ),
        children: <Contract isVerify={isVerify} chainIds={chainIds} setIsVerify={setIsVerify} />,
      },
      {
        key: 'events',
        label: 'Events',
        children: <Events chainIds={chainIds} />,
      },
      {
        key: 'history',
        label: 'History',
        children: <History SSRData={[]} chainIds={chainIds} onTabClick={onTabClick} />,
      },
    );
  }

  const isMobile = useMobileAll();

  return (
    <div className="address-detail">
      <div className="address-header">
        <HeadTitle className={isMobile && 'flex-col !items-start'} adPage={title + 'detail'} content={title}>
          <div className={clsx('code-box ml-2', isMobile && '!ml-0 flex flex-wrap items-center')}>
            <span className="inline-block flex-wrap break-all text-sm leading-5">
              {address}
              <MultiChain address={getAddress(address)} chainIds={chainIds} hidden={false} breakAll />
            </span>
          </div>
        </HeadTitle>
      </div>
      <div className="mt-2">
        <EPTabs items={tokenTabItems} memory={false} selectKey="Tokens" />
      </div>
      <div className="address-main mt-4">
        <EPTabs ref={tabRef} selectKey={defaultTab} items={items} />
      </div>
    </div>
  );
}
