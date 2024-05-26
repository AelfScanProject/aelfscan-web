'use client';
import Search from '@_components/Search';
import { useRouter } from 'next/navigation';
import useSearchFilter from '@_hooks/useSearchFilters';
import { Skeleton } from 'antd';

export default function SearchComp({ isMobile }: { isMobile: boolean }) {
  const router = useRouter();
  const { options, loading } = useSearchFilter();
  // function onSearchButtonClickHandler(queryTxt) {
  //   router.push(`/search/${queryTxt}`);
  // }
  return !loading ? (
    <Search
      searchIcon={false}
      searchButton={true}
      searchValidator={isMobile ? undefined : options}
      placeholder={'Search by Address / Txn Hash / Block'}
      isMobile={isMobile}
    />
  ) : (
    <Skeleton.Input active />
  );
}
