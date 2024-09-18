/*
 * @author: Peterbjx
 * @Date: 2023-08-16 16:00:17
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-17 10:37:04
 * @Description: title
 */
import PageAd from '@_components/PageAd';
import { useSideChain } from '@_hooks/useSelectChain';
import { Button } from 'aelf-design';
import clsx from 'clsx';
import React from 'react';
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
  const chain = useSideChain();
  return (
    <>
      <div className={clsx('header-title flex flex-wrap items-center gap-4 bg-inherit py-5')}>
        <div className={clsx('flex items-end text-xl font-medium not-italic text-base-100', className)}>
          {content}
          {children}
        </div>
        <div className="flex items-center gap-2">
          {mainLink && (
            <Button className="!h-7 !px-2" size="small" ghost type="primary">
              View on MainChain
            </Button>
          )}
          {sideLink && (
            <Button className="!h-7 !px-2" size="small" ghost type="primary">
              View on SideChain({chain})
            </Button>
          )}
        </div>
      </div>
      {!hiddenAds && <PageAd adPage={adPage} />}
    </>
  );
}
