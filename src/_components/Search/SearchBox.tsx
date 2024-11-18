/*
 * @Author: aelf-lxy
 * @Date: 2023-08-03 14:20:36
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-17 15:12:38
 * @Description: Search component
 */
'use client';
// import request from '@_api';
import { useState, useRef, MouseEvent, memo, isValidElement, useMemo, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import Panel from './Panel';
import SearchSelect from './Select';
import { useUpdateDataByQuery, useSelected } from '@_hooks/useSearch';
import { ISearchProps } from './type';
import { useSearchContext } from './SearchProvider';
import { setQuery, setClear } from './action';
import { Button } from 'aelf-design';
import IconFont from '@_components/IconFont';
import { IPageAdsDetail } from '@_api/type';
import { fetchAdsDetail, fetchSearchData } from '@_api/fetchSearch';
import { useRouter } from 'next/navigation';
import { getAddress, getChainId } from '@_utils/formatter';
import { AdTracker } from '@_utils/ad';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useDebounceFn } from 'ahooks';
import { MULTI_CHAIN } from '@_utils/contant';

const randomId = () => `searchbox-${(0 | (Math.random() * 6.04e7)).toString(36)}`;

const Search = ({
  lightMode,
  isMobile,
  searchValidator,
  placeholder,
  searchButton,
  searchIcon,
  enterIcon,
  deleteIcon,
  label,
  searchWrapClassNames,
  searchInputClassNames,
}: ISearchProps) => {
  // Global state from context
  const { state, dispatch } = useSearchContext();
  const { query, selectedItem, filterType, queryResultData, canShowListBox } = state;

  // Component state
  const [hasFocus, setHasFocus] = useState<boolean>(false);
  // const { defaultChain } = useAppSelector((state) => state.getChainId);
  // const defaultChain = useCurrentPageChain();

  // DOM references
  const queryInput = useRef<HTMLInputElement>(null);
  const { dataWithOrderIdx } = queryResultData;

  const [adsDetail, setAdsDetail] = useState<IPageAdsDetail>();
  // Calculated states
  const isExpanded = useMemo(() => {
    if (adsDetail?.adsId) {
      return hasFocus;
    } else {
      return hasFocus && query && canShowListBox && dataWithOrderIdx;
    }
  }, [adsDetail, canShowListBox, dataWithOrderIdx, hasFocus, query]);

  useEffect(() => {
    fetchAdsDetail({ label: label }).then((res) => {
      setAdsDetail(res);
    });
  }, [label]);

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

  const onSearchHandler = useCallback(async () => {
    if (!dataWithOrderIdx) return;
    if (dataWithOrderIdx?.transaction) {
      const { transactionId, chainIds } = dataWithOrderIdx.transaction;
      router.push(`/${chainIds && chainIds[0]}/tx/${transactionId}`);
    } else {
      const params = {
        filterType: filterType?.filterType,
        chainId: getChainId(MULTI_CHAIN || ''),
        keyword: getAddress(query.trim()),
        searchType: 0,
      };
      const res = await fetchSearchData(params);
      const { tokens, nfts, accounts, contracts, blocks } = res;
      if (tokens.length) {
        router.push(`/${MULTI_CHAIN}/token/${tokens[0].symbol}`);
      } else if (nfts.length) {
        if (nfts[0]?.type === 2) {
          // collection
          router.push(`/nft?chainId=${MULTI_CHAIN}&&collectionSymbol=${nfts[0].symbol}`);
        } else {
          return `/nftItem?chainId=${MULTI_CHAIN}&&itemSymbol=${nfts[0].symbol}`;
        }
      } else if (accounts.length) {
        router.push(`/${MULTI_CHAIN}/address/${accounts[0].address}`);
      } else if (contracts.length) {
        router.push(`/${MULTI_CHAIN}/address/${contracts[0].address}`);
      } else if (blocks.length) {
        router.push(`/${blocks[0]?.chainIds && blocks[0]?.chainIds[0]}/block/${blocks[0].blockHeight}`);
      } else {
        router.push(`/${MULTI_CHAIN}/search/${query.trim()}`);
      }
    }
  }, [dataWithOrderIdx, filterType, query, router]);

  const keyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' && !loading) {
        onSearchHandler();
      }
    },
    [loading, onSearchHandler],
  );

  const { run: keyDownDebounce } = useDebounceFn(keyDown, { wait: 300 });

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

  const handleJump = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      AdTracker.trackEvent('ads-click', {
        date: dayjs(new Date()).format('YYYY-MM-DD'),
        pageName: label,
        adsId: adsDetail?.adsId,
        adsName: adsDetail?.adsText,
      });
      window.open(adsDetail?.clickLink);
      e.preventDefault();
      e.stopPropagation();
    },

    [adsDetail, label],
  );

  return (
    <div
      className={clsx('searchbox-wrap', searchWrapClassNames, lightMode && 'searchbox-wrap-light')}
      aria-expanded={isExpanded}>
      <div className="h-full">
        <SearchSelect searchValidator={searchValidator} />
      </div>
      <div className={clsx('search-input-wrap', searchInputClassNames, !searchValidator && '!rounded-md')}>
        {searchIcon && (
          <div className="search-input-query-icon">
            <IconFont type="search" />
          </div>
        )}
        <input
          className={clsx('search-input', isMobile && 'search-input-mobile')}
          ref={queryInput}
          placeholder={placeholder}
          onFocus={() => {
            setHasFocus(true);
          }}
          onBlur={() => {
            AdTracker.trackEvent('search-blur');
            setHasFocus(false);
          }}
          onChange={(e) => {
            dispatch(setQuery(e.target.value));
          }}
          onKeyDown={keyDownDebounce}
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
      {isExpanded && (
        <Panel
          id={randomId()}
          loading={loading}
          classNames={`${searchButton && '!w-[calc(100%-48px)]'}`}
          searchHandler={onSearchHandler}>
          {adsDetail?.adsId && (
            <div className={`flex border-b border-solid border-white p-4 ${query && '!border-border'}`}>
              <div className="text-sm font-medium leading-[22px] text-base-100">
                <Image
                  src={adsDetail.logo}
                  width={20}
                  height={20}
                  className="mr-2 inline-block size-5 rounded-full"
                  alt=""
                />
                <a
                  className="mr-2 text-sm font-medium !text-muted-foreground"
                  href={adsDetail.clickLink}
                  target="_blank"
                  onMouseDown={handleJump}
                  rel="noreferrer">
                  {adsDetail.adsText}
                </a>
                <span className="inline-block rounded bg-secondary px-1 py-[2px] text-xs text-secondary-foreground">
                  Sponsored
                </span>
              </div>
            </div>
          )}
        </Panel>
      )}
    </div>
  );
};
export default memo(Search);
