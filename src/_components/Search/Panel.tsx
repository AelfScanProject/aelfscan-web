'use client';

import { MouseEvent, memo, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import animateScrollTo from 'animated-scroll-to';
import { useSearchContext } from './SearchProvider';
import Item from './Item';
import { TSearchPanelProps, TSingle, TType } from './type';
import { useKeyEvent } from '@_hooks/useSearch';
import { useThrottleFn } from 'ahooks';
import IconFont from '@_components/IconFont';
import { Spin } from 'antd';
function Panel({ id, searchHandler, children, loading }: TSearchPanelProps) {
  // Global state from context
  const { state } = useSearchContext();
  const { query, queryResultData } = state;
  const { allList = [], dataWithOrderIdx } = queryResultData;
  // Component state
  const panelRef = useRef<HTMLUListElement>(null);
  const anchorArr = useRef<HTMLParagraphElement[]>([]);
  const [activeTabIdx, setActiveTabIdx] = useState<number>(0);

  useKeyEvent(panelRef, setActiveTabIdx, searchHandler);

  useEffect(() => {
    anchorArr.current = Array.from(panelRef.current?.querySelectorAll<HTMLParagraphElement>('p') || []);
  }, [allList]);

  useEffect(() => {
    if (!query) {
      setActiveTabIdx(0);
    }
  }, [query]);
  const { run: scrollHandler } = useThrottleFn(
    () => {
      if (!panelRef.current) {
        return;
      }

      const y: number = panelRef.current.scrollTop;
      const scrollTopArr: number[] = anchorArr.current.map((item) => item.offsetTop);
      let tmpActiveIdx = -1;
      if (
        // highlight the last item if bottom is reached
        y >= scrollTopArr[scrollTopArr.length - 1]
      ) {
        tmpActiveIdx = scrollTopArr.length - 1;
      } else {
        tmpActiveIdx = scrollTopArr.findIndex((_, idx, arr) => {
          return y >= arr[idx] && y < arr[idx + 1];
        });
      }
      setActiveTabIdx(tmpActiveIdx);
    },
    {
      leading: true,
      trailing: true,
      wait: 100,
    },
  );

  useEffect(() => {
    const dom = panelRef.current;
    if (!dom) {
      return;
    }
    dom.addEventListener('scroll', scrollHandler);
    return () => {
      dom.removeEventListener('scroll', scrollHandler);
    };
  }, [scrollHandler, allList]);

  function tabMouseDownHandler(e: MouseEvent, idx: number) {
    e.preventDefault();
    panelRef.current?.removeEventListener('scroll', scrollHandler);
    setActiveTabIdx(idx);
    const node = anchorArr.current[idx];

    animateScrollTo(node, { speed: 100, elementToScroll: panelRef.current as HTMLElement }).then(() => {
      setTimeout(() => {
        panelRef.current?.addEventListener('scroll', scrollHandler);
      }, 50);
    });
  }

  const previewData = useMemo<[string, any][]>(() => {
    if (!dataWithOrderIdx) return [];
    return Object.entries(dataWithOrderIdx).filter(([filterType, list]) => list && Array.isArray(list));
  }, [dataWithOrderIdx]);

  console.log(dataWithOrderIdx, 'dataWithOrderIdx');

  // if (!query) {
  //   return null;
  // }

  if (allList.length === 0 && !loading) {
    return (
      <div className="search-result-panel">
        <div>{children}</div>
        {query && !dataWithOrderIdx?.transaction && !dataWithOrderIdx?.block && (
          <div className="search-result-empty">
            <IconFont type="result-empty" className="mr-1 size-3" />
            <span>Sorry, search not found.</span>
          </div>
        )}
        {(dataWithOrderIdx?.transaction || dataWithOrderIdx?.block) && (
          <ul className="search-result-ul">
            <div className="search-result-ul-wrap">
              <p className="search-result-ul-title">{dataWithOrderIdx?.transaction ? 'transaction' : 'block'}</p>
              <Item
                key={`item${dataWithOrderIdx?.transaction ? 'transaction' : 'block'}`}
                searchType={dataWithOrderIdx?.transaction ? ('transaction' as TType) : ('block' as TType)}
                index={1}
                item={dataWithOrderIdx?.transaction || dataWithOrderIdx?.block}
              />
            </div>
          </ul>
        )}
      </div>
    );
  }

  return (
    <div id={id} className="search-result-panel">
      <div>{children}</div>
      {query && (
        <Spin spinning={loading}>
          <div className="border-b border-color-divider">
            <div className="flex gap-2 p-4">
              {previewData.map(([searchType, list], idx) => {
                return (
                  <div
                    className={clsx('search-result-panel-anchor', activeTabIdx === idx && 'selected')}
                    key={searchType + idx}
                    onMouseDown={(e) => tabMouseDownHandler(e, idx)}>
                    <span>{searchType}</span>
                    <span>{`(${list?.length})`}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <ul className="search-result-ul" ref={panelRef}>
            {previewData.map(([searchType, searchData]: [string, any], pIdx: number) => {
              return (
                <div key={searchType + pIdx} className="search-result-ul-wrap">
                  <p className="search-result-ul-title">{searchType}</p>
                  {searchData.map((item: Partial<TSingle>, index: number) => (
                    <Item
                      key={`item${index}`}
                      searchType={searchType as TType}
                      index={item.sortIdx as number}
                      item={item}
                    />
                  ))}
                </div>
              );
            })}
          </ul>
          <div className="search-result-bottom">
            <div className="flex gap-4">
              <div className="search-result-bottom-button-wrap">
                <div className="search-result-bottom-button">
                  <IconFont className="size-3" type="Down" />
                </div>
                <div className="search-result-bottom-button">
                  <IconFont className="size-3" type="Up" />
                </div>
                <span>Navigator</span>
              </div>
              <div className="search-result-bottom-button-wrap">
                <div className="search-result-bottom-button !w-9">
                  <span>Esc</span>
                </div>
                <span>Close</span>
              </div>
            </div>
            <div>
              <div className="search-result-bottom-button-wrap">
                <div className="search-result-bottom-button !w-9">
                  <IconFont className="size-3" type="Union" />
                </div>
                <span>Enter</span>
              </div>
            </div>
          </div>
        </Spin>
      )}
    </div>
  );
}

export default memo(Panel);
