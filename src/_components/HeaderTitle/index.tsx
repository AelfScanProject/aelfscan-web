/*
 * @author: Peterbjx
 * @Date: 2023-08-16 16:00:17
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-17 10:37:04
 * @Description: title
 */
import { TChainID } from '@_api/type';
import ChainTags from '@_components/ChainTags';
import PageAd from '@_components/PageAd';
import { useMultiChain, useSideChain } from '@_hooks/useSelectChain';
import { Button } from 'aelf-design';
import clsx from 'clsx';
import { useParams } from 'next/navigation';
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
  const sideChain = useSideChain();
  const { chain } = useParams<{ chain: TChainID }>();
  const multi = useMultiChain();
  const chainIds = useMemo(() => {
    return [chain];
  }, [chain]);
  return (
    <>
      <div className={clsx('header-title flex flex-wrap items-center gap-4 bg-inherit py-5', !multi && '!gap-2')}>
        <div className={clsx('flex items-end text-xl font-medium not-italic text-base-100', className)}>
          {content}
          {children}
        </div>
        <div className="flex items-center gap-2">
          {!multi && <ChainTags chainIds={chainIds} className="border-D0 leading-[18px]" />}
          {mainLink && (
            <Button className="!h-7 !px-2" size="small" ghost type="primary">
              View on MainChain
            </Button>
          )}
          {sideLink && (
            <Button className="!h-7 !px-2" size="small" ghost type="primary">
              View on SideChain({sideChain})
            </Button>
          )}
        </div>
      </div>
      {!hiddenAds && <PageAd adPage={adPage} />}
    </>
  );
}
