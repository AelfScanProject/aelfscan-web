import { PageTypeEnum } from '@_types';
import { useParams, useSearchParams } from 'next/navigation';

const useSearchAfterParams = (defaultSize, tabName) => {
  const { chain } = useParams<{ chain: string }>();
  const searchParams = useSearchParams();
  const activeTab = (searchParams.get('tab') as string) === tabName;
  const defaultPage = Number((activeTab && (searchParams.get('p') as string)) || 1);
  const defaultPageSize = Number((activeTab && (searchParams.get('ps') as string)) || defaultSize);
  const defaultChain: string = searchParams.get('chain') || searchParams.get('chainId') || chain;
  const defaultPageType = Number(
    (activeTab && searchParams.get('pageType')) || PageTypeEnum.NEXT,
  ) as unknown as PageTypeEnum;
  const defaultSearchAfter = searchParams.get('searchAfter');
  return {
    activeTab,
    defaultPage,
    defaultPageSize,
    defaultPageType,
    defaultSearchAfter,
    defaultChain,
  };
};

export default useSearchAfterParams;
