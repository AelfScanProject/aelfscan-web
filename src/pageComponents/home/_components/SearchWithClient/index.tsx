'use client';
import Search from '@_components/Search';
import { Skeleton } from 'antd';
import { useAppSelector } from '@_store';

export default function SearchComp({ isMobile }: { isMobile: boolean }) {
  const { homeFilters } = useAppSelector((state) => state.getChainId);
  return homeFilters.length ? (
    <Search
      searchIcon={false}
      searchButton={true}
      label="homeSearch"
      searchValidator={isMobile ? undefined : homeFilters}
      placeholder={'Search by Address / Txn Hash / Block'}
      searchWrapClassNames="border-border !max-w-[780px] !w-full md:!w-[640px]"
      isMobile={isMobile}
    />
  ) : (
    <Skeleton.Input active />
  );
}
