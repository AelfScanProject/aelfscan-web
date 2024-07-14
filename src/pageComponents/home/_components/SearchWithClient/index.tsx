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
      searchValidator={isMobile ? undefined : homeFilters}
      placeholder={'Search by Address / Txn Hash / Block'}
      isMobile={isMobile}
    />
  ) : (
    <Skeleton.Input active />
  );
}
