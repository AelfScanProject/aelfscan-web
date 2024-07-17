/*
 * @Author: aelf-lxy
 * @Date: 2023-08-03 14:20:36
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-17 15:12:38
 * @Description: Search component
 */
'use client';
// import request from '@_api';
import { useState, useRef, MouseEvent, memo, isValidElement, useMemo } from 'react';
import clsx from 'clsx';
import Panel from './Panel';
import SearchSelect from './Select';
import { useUpdateDataByQuery, useSelected, useHighlight } from '@_hooks/useSearch';
import { ISearchProps } from './type';
import { useSearchContext } from './SearchProvider';
import { setQuery, setClear } from './action';
import { Button } from 'aelf-design';
import IconFont from '@_components/IconFont';
import { useAppSelector } from '@_store';
import { TChainID } from '@_api/type';
import { fetchSearchData } from '@_api/fetchSearch';
import { useRouter } from 'next/navigation';
import addressFormat from '@_utils/urlUtils';
import { AddressType } from '@_types/common';
import { getAddress } from '@_utils/formatter';
import { Spin } from 'antd';

const randomId = () => `searchbox-${(0 | (Math.random() * 6.04e7)).toString(36)}`;

const Search = ({
  lightMode,
  isMobile,
  searchValidator,
  placeholder,
  searchButton,
  onSearchButtonClickHandler,
  searchIcon,
  enterIcon,
  deleteIcon,
  searchWrapClassNames,
  searchInputClassNames,
}: ISearchProps) => {
  // Global state from context
  const { state, dispatch } = useSearchContext();
  const { query, selectedItem, highLight, filterType, queryResultData, canShowListBox } = state;

  // Component state
  const [hasFocus, setHasFocus] = useState<boolean>(false);
  const { defaultChain } = useAppSelector((state) => state.getChainId);
  // DOM references
  const queryInput = useRef<HTMLInputElement>(null);
  const { dataWithOrderIdx } = queryResultData;
  // Calculated states
  const isExpanded = useMemo(() => {
    return hasFocus && canShowListBox && dataWithOrderIdx && !dataWithOrderIdx?.transaction && !dataWithOrderIdx?.block;
  }, [canShowListBox, dataWithOrderIdx, hasFocus]);

  const hasClearButton = !!query && deleteIcon;
  const hasEnterButton = !!query && enterIcon;

  const { loading } = useUpdateDataByQuery();
  useSelected(selectedItem, queryInput);
  // useHighlight(highLight, queryInput);

  function cancelBtnHandler(e: MouseEvent<HTMLElement>) {
    e.preventDefault();
    queryInput.current!.value = '';
    dispatch(setClear());
  }

  const router = useRouter();

  const onSearchHandler = async () => {
    if (dataWithOrderIdx.transaction) {
      const { transactionId, blockHeight } = dataWithOrderIdx.transaction;
      router.push(`/${defaultChain}/tx/${transactionId}?blockHeight=${blockHeight}`);
    } else if (dataWithOrderIdx.block) {
      const { blockHeight } = dataWithOrderIdx.block;
      router.push(`/${defaultChain}/block/${blockHeight}`);
    } else {
      const params = {
        filterType: filterType?.filterType,
        chainId: defaultChain as TChainID,
        keyword: getAddress(query.trim()),
        searchType: 0,
      };
      const res = await fetchSearchData(params);
      const { tokens, nfts, accounts, contracts } = res;
      if (tokens.length) {
        router.push(`/${defaultChain}/token/${tokens[0].symbol}`);
      } else if (nfts.length) {
        if (nfts[0]?.type === 2) {
          // collection
          router.push(`/nft?chainId=${defaultChain}&&collectionSymbol=${nfts[0].symbol}`);
        } else {
          return `/nftItem?chainId=${defaultChain}&&itemSymbol=${nfts[0].symbol}`;
        }
      } else if (accounts.length) {
        router.push(
          `/${defaultChain}/address/${addressFormat((accounts[0] as string) || '', defaultChain)}/${AddressType.address}`,
        );
      } else if (contracts.length) {
        router.push(
          `/${defaultChain}/address/${addressFormat(contracts[0].address || '', defaultChain)}/${AddressType.Contract}`,
        );
      } else {
        router.push(`/${defaultChain}/search/${query.trim()}`);
      }
    }

    // onSearchButtonClickHandler && onSearchButtonClickHandler(queryInput.current!.value);
  };

  function renderButton() {
    if (!searchButton) {
      return null;
    }
    if (isValidElement(searchButton)) {
      return <div onClick={onSearchHandler}>{searchButton}</div>;
    }
    return (
      <Button
        loading={loading}
        className="search-button"
        type="primary"
        icon={<IconFont className="size-4" type="search" />}
        onClick={onSearchHandler}
      />
    );
  }

  return (
    <div
      className={clsx('searchbox-wrap', searchWrapClassNames, lightMode && 'searchbox-wrap-light')}
      aria-expanded={isExpanded}>
      <SearchSelect searchValidator={searchValidator} />
      <div className="search-input-wrap">
        {searchIcon && (
          <div className="search-input-query-icon">
            <IconFont type="search" />
          </div>
        )}
        <input
          className={clsx('search-input', searchInputClassNames, isMobile && 'search-input-mobile')}
          ref={queryInput}
          placeholder={placeholder}
          onFocus={() => {
            setHasFocus(true);
          }}
          onBlur={() => {
            setHasFocus(false);
          }}
          onChange={(e) => {
            dispatch(setQuery(e.target.value));
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !loading) {
              onSearchHandler();
            }
          }}
        />
        {hasClearButton && (
          <div className="search-input-clear" onMouseDown={cancelBtnHandler}>
            <IconFont type="clear" />
          </div>
        )}
        {hasEnterButton && (
          <div className="search-input-enter" onClick={onSearchHandler}>
            <IconFont className="size-3" type="Union" />
          </div>
        )}
      </div>
      {renderButton()}
      {isExpanded && <Panel id={randomId()} searchHandler={onSearchHandler} />}
    </div>
  );
};
export default memo(Search);
