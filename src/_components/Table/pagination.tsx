import { Select } from 'antd';
import { Button } from 'aelf-design';
import type { PaginationProps } from 'antd';
import './pagination.css';
import { useEffect, useMemo, useState } from 'react';
import { debounce } from 'lodash';
import IconFont from '@_components/IconFont';

export interface IEpPaginationProps extends PaginationProps {
  current?: number;
  pageSize?: number;
  isMobile?: boolean;
  defaultCurrent?: number;
  total: number;
  defaultPageSize?: number;
  showSizeChanger?: boolean;
  pageChange?: (page: number, pageSize?: number) => void;
  pageSizeChange?: (value: number) => void;
  options?: Options[];
}

export type Options = number[];

export interface IPaginationProps {
  current?: number;
  pageSize?: number;
  hideOnSinglePage?: boolean;
  defaultCurrent?: number;
  total: number;
  defaultPageSize?: number;
  showSizeChange?: boolean;
  showSizeChanger?: boolean;
  showPageAndSize?: boolean;
  showLast?: boolean;
  showFirst?: boolean;
  pageChange?: (page: number, pageSize?: number) => void;
  onChange?: (page: number, pageSize: number) => void;
  pageSizeChange?: (page: number, pageSize: number) => void;
  options?: Options;
}

export default function Pagination({
  current,
  pageSize = 10,
  defaultCurrent = 1,
  defaultPageSize = 10,
  total,
  showSizeChange = true,
  showLast = true,
  showFirst = true,
  showSizeChanger = true,
  hideOnSinglePage,
  showPageAndSize = true,
  options = [10, 20, 50],
  pageChange,
  onChange,
  pageSizeChange,
}: IPaginationProps) {
  // Component state
  const [pageNum, setPageNum] = useState<number>(defaultCurrent);
  const [pageSizeValue, setPageSizeValue] = useState<number>(defaultPageSize);

  // Calculated states
  const totalPage = Math.floor((total + pageSizeValue - 1) / pageSizeValue) || 1;
  const isFirstPage = pageNum === 1;
  const isLastPage = pageNum >= totalPage;

  // Effect
  useEffect(() => {
    if (current) {
      setPageNum(current);
    }
  }, [current]);
  useEffect(() => {
    if (pageSize) {
      setPageSizeValue(pageSize);
    }
  }, [pageSize]);

  // Methods
  const prevChange = () => {
    const page = pageNum === 1 ? pageNum : pageNum - 1;
    setPageNum(page);
    pageChange?.(page);
    onChange?.(page, pageSizeValue);
  };
  const runPrevChange = debounce(prevChange, 300, {
    leading: true,
    trailing: false,
  });

  const nextChange = () => {
    const page = pageNum === totalPage ? totalPage : pageNum + 1;
    setPageNum(page);
    pageChange?.(page);
    onChange?.(page, pageSizeValue);
  };
  const runNextChange = debounce(nextChange, 300, {
    leading: true,
    trailing: false,
  });

  const jumpFirst = () => {
    setPageNum(1);
    pageChange?.(1, pageSizeValue);
    onChange?.(1, pageSizeValue);
  };
  const debounceJumpFirst = debounce(jumpFirst, 300, {
    leading: true,
    trailing: false,
  });

  const jumpLast = () => {
    setPageNum(totalPage);
    pageChange?.(totalPage, pageSizeValue);
    onChange?.(totalPage, pageSizeValue);
  };
  const debounceJumpLast = debounce(jumpLast, 300, {
    leading: true,
    trailing: false,
  });

  const sizeChange = (value: number) => {
    setPageNum(1);
    setPageSizeValue(value);
    pageSizeChange?.(1, value);
    onChange?.(1, value);
  };

  const pagesizeOptions = useMemo(() => {
    return options.map((item) => {
      return { label: item, value: item };
    });
  }, [options]);

  // hidden pagination Render
  if (hideOnSinglePage && total <= options[0]) {
    return null;
  }

  return (
    <div className="ep-pagination">
      <div>
        {showSizeChange && showSizeChanger && (
          <>
            <span className="text-sm font-medium leading-6">Rows per page</span>
            <Select
              defaultValue={pageSizeValue}
              value={pageSizeValue}
              className=""
              popupClassName=""
              popupMatchSelectWidth={false}
              suffixIcon={<IconFont width={16} height={16} type="chevrons-up-down" />}
              options={pagesizeOptions}
              onChange={sizeChange}
            />
          </>
        )}
      </div>
      <div className="flex flex-row-reverse items-center gap-4 min-[769px]:flex-row">
        {showPageAndSize && (
          <div className="text-sm font-medium leading-6">{`Page ${current || pageNum} of ${totalPage}`}</div>
        )}
        <div className="flex items-center gap-2">
          {showFirst && (
            <div>
              <Button
                disabled={isFirstPage}
                icon={<IconFont type="chevrons-left" />}
                size="small"
                type="primary"
                ghost
                onClick={debounceJumpFirst}></Button>
            </div>
          )}
          <div>
            <Button
              disabled={isFirstPage}
              type="primary"
              size="small"
              ghost
              onClick={runPrevChange}
              icon={<IconFont type="chevron-left" />}
            />
          </div>
          <div>
            <Button
              type="primary"
              size="small"
              ghost
              disabled={isLastPage}
              onClick={runNextChange}
              icon={<IconFont type="chevron-right" />}
            />
          </div>
          {showLast && (
            <div>
              <Button
                disabled={isLastPage}
                icon={<IconFont type="chevrons-right" />}
                className=""
                type="primary"
                size="small"
                ghost
                onClick={debounceJumpLast}></Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
