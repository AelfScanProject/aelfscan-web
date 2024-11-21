/*
 * @author: Peterbjx
 * @Date: 2023-08-16 16:00:17
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-17 10:37:04
 * @Description: title
 */
'use client';
import { TChainID } from '@_api/type';
import ChainTags from '@_components/ChainTags';
import PageAd from '@_components/PageAd';
import { useMultiChain } from '@_hooks/useSelectChain';
import { Button } from 'aelf-design';
import clsx from 'clsx';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import React, { useMemo } from 'react';
export default function HeadTitle({
  content,
  children,
  className,
  adPage,
  mainLink,
  hiddenAds,
  sideLink,
}: {
  content: string;
  children?: React.ReactNode;
  className?: string;
  mainLink?: string;
  sideLink?: string;
  adPage: string;
  hiddenAds?: boolean;
}) {
  const { chain } = useParams<{ chain: TChainID }>();
  const params = useSearchParams();
  const chainId = params.get('chainId') as TChainID;
  const multi = useMultiChain();
  const chainIds = useMemo(() => {
    return [chain || chainId];
  }, [chain, chainId]);

  return (
    <>
      <div className={clsx('header-title flex flex-wrap items-center gap-4 bg-inherit pb-3 pt-8', !multi && '!gap-2')}>
        <div className={clsx('flex items-end text-xl font-bold not-italic text-foreground', className)}>
          {content}
          {children}
        </div>
      </div>
      {!hiddenAds && <PageAd adPage={adPage} />}
    </>
  );
}
