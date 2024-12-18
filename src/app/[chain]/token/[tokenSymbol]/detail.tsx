'use client';
import EPTabs from '@_components/EPTabs';
import HeadTitle from '@_components/HeaderTitle';
import { FontWeightEnum, Typography } from 'aelf-design';
import { TabsProps } from 'antd';
import { useCallback, useMemo, useRef, useState } from 'react';
import Holders from './_components/Holders';
import OverView from './_components/Overview';
import Transfers, { ITransfersRef } from './_components/Transfers';
import './index.css';
import { ITokenDetail, SearchType } from './type';
import { formatSearchValue, getSearchType } from './utils';

const { Title } = Typography;

interface IDetailProps {
  tokenDetail: ITokenDetail;
}

export default function Detail({ tokenDetail }: IDetailProps) {
  console.log(tokenDetail, 'tokenDetail');
  const [search, setSearch] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [searchType, setSearchType] = useState<SearchType>(SearchType.other);
  const transfersRef = useRef<ITransfersRef>(null);

  const onSearchInputChange = useCallback((value) => {
    setSearch(value);
  }, []);

  const onSearchChange = useCallback((val) => {
    setSearchText(val);
    const value = formatSearchValue(val);
    const searchType = getSearchType(value);
    transfersRef?.current?.setSearchStr(val);
    setSearchType(searchType);
  }, []);

  const items: TabsProps['items'] = useMemo(() => {
    const transfersItem = {
      key: '',
      label: 'Transfers',
      children: (
        <Transfers
          ref={transfersRef}
          search={search}
          searchText={searchText}
          token={tokenDetail.token}
          searchType={searchType}
          // SSRData={transfersList}
          onSearchChange={onSearchChange}
          onSearchInputChange={onSearchInputChange}
        />
      ),
    };

    const holdersItem = {
      key: 'holders',
      label: 'Holders',
      children: (
        <Holders
          searchType={searchType}
          search={search}
          searchText={searchText}
          onSearchChange={onSearchChange}
          onSearchInputChange={onSearchInputChange}
        />
      ),
    };
    if (searchType !== SearchType.other) {
      return [transfersItem];
    }

    return [transfersItem, holdersItem];
  }, [onSearchChange, onSearchInputChange, search, searchText, searchType, tokenDetail.token]);

  return (
    <div className="token-detail">
      <HeadTitle content={`${tokenDetail?.token?.name || '--'}`} adPage="tokendetail">
        <Title
          level={6}
          fontWeight={FontWeightEnum.Bold}
          className="ml-1 !text-[#858585]">{`(${tokenDetail?.token?.symbol || '--'})`}</Title>
      </HeadTitle>
      <OverView data={tokenDetail} />
      <EPTabs items={items} />
    </div>
  );
}
