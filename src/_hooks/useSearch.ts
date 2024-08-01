/*
 * @Author: aelf-lxy
 * @Date: 2023-08-11 15:07:01
 * @LastEditors: aelf-lxy xiyang.liu@aelf.io
 * @LastEditTime: 2023-08-16 19:07:43
 * @Description: hooks for Search Component
 */
import { useSearchContext } from '@_components/Search/SearchProvider';
import { setQueryResult, highlightPrev, highlightNext, setClear } from '@_components/Search/action';
import { TSingle, TSearchList } from '@_components/Search/type';
import { RefObject, useEffect, useMemo, useState } from 'react';
import animateScrollTo from 'animated-scroll-to';
import { useDebounce } from 'react-use';
import { fetchSearchData } from '@_api/fetchSearch';
import { useAppSelector } from '@_store';
import { TChainID } from '@_api/type';
import { getAddress } from '@_utils/formatter';
export const useUpdateDataByQuery = () => {
  const { state, dispatch } = useSearchContext();
  const { query, filterType } = state;
  const [loading, setLoading] = useState<boolean>(false);
  const { defaultChain } = useAppSelector((state) => state.getChainId);
  useDebounce(
    () => {
      if (!query) {
        return;
      }

      const formatData = (data: TSearchList) => {
        try {
          const arr: Partial<TSingle>[] = Object.values(data)
            .filter((item) => item && Array.isArray(item))
            .reduce((acc, ele) => {
              return acc.concat(ele);
            }, [] as Partial<TSingle>[])
            .map((ele, idx) => {
              if (typeof ele !== 'string') {
                ele.sortIdx = idx;
              }
              return ele;
            });
          return {
            dataWithOrderIdx: data,
            allList: arr,
          };
        } catch (e) {
          throw new Error(e as string);
        }
      };

      const fetchData = async () => {
        setLoading(true);
        const params = {
          filterType: filterType?.filterType,
          chainId: defaultChain as TChainID,
          keyword: getAddress(query.trim()),
          searchType: 0,
        };
        const res = await fetchSearchData(params);
        const result = formatData(res);
        setLoading(false);
        dispatch(setQueryResult(result));
      };
      if (typeof filterType === 'object' && filterType !== null) {
        const { limitNumber } = filterType;
        if (query.length >= (limitNumber || 0)) {
          fetchData();
        }
      } else {
        fetchData();
      }
    },
    300,
    [query, filterType],
  );

  return useMemo(() => {
    return {
      loading,
    };
  }, [loading]);
};

export const useSelected = (selectedItem: Partial<TSingle>, inputRef: RefObject<HTMLInputElement>) => {
  useEffect(() => {
    console.log('inputRef.current', inputRef.current);
    if (!inputRef.current) {
      return;
    }
    if (!selectedItem || Object.keys(selectedItem).length === 0) {
      inputRef.current.value = '';
    } else {
      inputRef.current.value = (selectedItem.address ||
        selectedItem.name ||
        selectedItem.transactionId ||
        selectedItem.blockHeight) as string;
    }
  }, [inputRef, selectedItem]);
};

export const useHighlight = (highLight, inputRef: RefObject<HTMLInputElement>) => {
  useEffect(() => {
    if (highLight && highLight.txt && inputRef.current)
      inputRef.current.value = highLight.txt.address || highLight.txt.name;
  }, [highLight, inputRef]);
};

export const useKeyEvent = (
  panelRef: RefObject<HTMLUListElement>,
  setActiveTabIdx: (val: number) => void,
  searchHandler: () => void,
) => {
  const { state, dispatch } = useSearchContext();
  const { highLight, queryResultData } = state;
  const { idx: highLightIdx } = highLight;
  const { allList = [] } = queryResultData;
  useEffect(() => {
    const moveToTarget = (idx: number, pNode: HTMLElement) => {
      if (idx < 0) {
        return;
      }
      const activeItemDOMNode = pNode?.querySelector(`[data-sort-idx="${idx}"]`);
      animateScrollTo(activeItemDOMNode as HTMLElement, {
        speed: 100,
        elementToScroll: pNode,
        verticalOffset: -100,
      });
    };
    if (panelRef.current && highLightIdx === 0) {
      moveToTarget(0, panelRef.current as HTMLElement);
    }
    if (panelRef.current && highLightIdx === allList.length - 1) {
      moveToTarget(allList.length - 1, panelRef.current as HTMLElement);
    }

    function keyupHandler(e: KeyboardEvent) {
      if (e.key === 'ArrowUp') {
        moveToTarget(highLightIdx, panelRef.current as HTMLElement);
        dispatch(highlightPrev());
      } else if (e.key === 'ArrowDown') {
        moveToTarget(highLightIdx, panelRef.current as HTMLElement);
        dispatch(highlightNext());
      } else if (e.key === 'Enter') {
        // dispatch(selectItem(allList[highLightIdx]));
        // searchHandler();
      } else if (e.key === 'Escape') {
        setActiveTabIdx(0);
        dispatch(setClear());
      }
    }

    document.addEventListener('keyup', keyupHandler);
    return () => {
      document.removeEventListener('keyup', keyupHandler);
    };
  }, [highLightIdx, allList, dispatch, panelRef, setActiveTabIdx, searchHandler]);
};
