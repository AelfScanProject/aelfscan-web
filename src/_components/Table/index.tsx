import EPSearch from '@_components/EPSearch';
import IconFont from '@_components/IconFont';
import { isReactNode } from '@_utils/typeUtils';
import { ISearchProps, ITableProps, Pagination, Table } from 'aelf-design';
import { SortOrder } from 'antd/es/table/interface';
import clsx from 'clsx';
import React, { ReactNode, useMemo } from 'react';
import CommonEmpty from './empty';
import './index.css';
import EPTooltip from '@_components/EPToolTip';
import MultiChainSelect from '@_components/ChainSelect/multiCain';
import { SelectProps } from 'antd';
import { usePad } from '@_hooks/useResponsive';

export interface ITableSearch extends Omit<ISearchProps, 'onPressEnter'> {
  value?: string;
  onSearchChange: (value: string) => void;
  onClear?: () => void;
  onPressEnter?: (value: string) => void;
  disabledTooltip?: boolean;
}

export interface IHeaderTitleProps {
  single?: {
    title: string;
  };
  multi?: {
    title: string;
    desc: string | boolean;
  };
}
export interface ICommonTableProps<T> extends ITableProps<T> {
  total: number;
  pageNum?: number;
  pageSize?: number;
  isMobile?: boolean;
  showTopSearch?: boolean;
  hiddenPagination?: boolean;
  hiddenTitle?: boolean;
  headerTitle?: IHeaderTitleProps | ReactNode;
  defaultCurrent?: number;
  className?: string;
  hideOnSinglePage?: boolean;
  showMultiChain?: boolean;
  topSearchProps?: ITableSearch;
  MultiChainSelectProps?: SelectProps;
  options?: any[];
  order?: SortOrder | undefined | null;
  field?: string | null;
  emptyType?: 'nodata' | 'search' | 'internet' | ReactNode | (() => ReactNode) | null;
  emptyText?: string;
  pageChange?: (page: number, pageSize?: number) => void;
  pageSizeChange?: (page: number, pageSize: number) => void;
  emptyPic?: string;
  showLast?: boolean;
  headerLeftNode?: ReactNode;
}

export type EmptyType = 'nodata' | 'search' | 'internet';
function emptyStatus({ emptyType, emptyText }) {
  let type: EmptyType;
  if (!emptyType) {
    type = 'nodata';
  } else if (emptyType === 'nodata' || emptyType === 'search' || emptyType === 'internet') {
    type = emptyType;
  } else if (typeof emptyType === 'function') {
    return emptyType();
  } else {
    return emptyType;
  }
  return <CommonEmpty type={type} desc={emptyText} />;
}
const MemoTable = React.memo(Table);
function HeaderTitle(props: IHeaderTitleProps): ReactNode {
  if (props.multi) {
    return (
      <>
        <div className="total-text text-sm font-normal leading-22 text-base-100">{props.multi.title}</div>
        <div className="bottom-text max-w-[600px] text-xs font-normal leading-5 text-base-200">{props.multi.desc}</div>
      </>
    );
  } else {
    return (
      <div className="single align-center flex">
        <IconFont className="text-xs" type="Rank" />
        <div className="total-tex ml-1 text-sm font-normal leading-22  text-base-100">{props.single?.title}</div>
      </div>
    );
  }
}
const scroll = { x: 'max-content' };
export default function TableApp({
  pageNum,
  pageSize,
  defaultCurrent,
  total,
  showTopSearch,
  topSearchProps,
  pageChange,
  emptyType,
  pageSizeChange,
  options,
  headerTitle,
  hiddenTitle,
  hiddenPagination,
  showMultiChain,
  showLast = true,
  hideOnSinglePage,
  emptyText,
  headerLeftNode,
  MultiChainSelectProps = {},
  ...params
}: ICommonTableProps<any>) {
  const { onSearchChange, disabledTooltip = true, ...searchProps } = topSearchProps || {};
  const locale = useMemo(() => {
    return {
      emptyText: emptyStatus({ emptyType, emptyText }),
    };
  }, [emptyType, emptyText]);

  const isPad = usePad();

  return (
    <div className={clsx('ep-table rounded-lg bg-white shadow-table', !showLast && 'ep-table-hidden-page')}>
      <div
        className={clsx(
          'ep-table-header',
          showTopSearch ? 'py-4' : 'p-4',
          `ep-table-header-${isPad ? 'mobile' : 'pc'}`,
        )}>
        <div className="header-left mr-4 flex flex-1 flex-col justify-between lg:flex-row lg:items-center">
          {!hiddenTitle && <div>{isReactNode(headerTitle) ? headerTitle : <HeaderTitle {...headerTitle} />}</div>}
          {headerLeftNode}
        </div>
        {!hiddenPagination && (
          <div
            className={clsx(
              'header-pagination flex w-full flex-col items-start gap-3 min-[769px]:w-auto  min-[769px]:flex-row min-[769px]:items-center',
              showTopSearch && '!flex-row gap-3 min-[769px]:!w-full min-[769px]:flex-row min-[993px]:!w-auto',
            )}>
            {showMultiChain && (
              <div className="min-w-[120px] max-w-[160px] min-[769px]:w-auto">
                <MultiChainSelect props={MultiChainSelectProps} className="min-w-[120px]" />
              </div>
            )}
            {showTopSearch ? (
              <EPTooltip
                title={disabledTooltip ? '' : topSearchProps?.placeholder}
                placement="topLeft"
                trigger={['focus']}
                pointAtCenter={false}
                mode="dark">
                <EPSearch
                  {...searchProps}
                  className={`${topSearchProps?.className} w-auto flex-1`}
                  onPressEnter={({ currentTarget }) => {
                    onSearchChange?.(currentTarget.value);
                    topSearchProps?.onPressEnter?.(currentTarget.value);
                  }}
                  onClear={() => {
                    topSearchProps?.onSearchChange('');
                    topSearchProps?.onClear?.();
                  }}
                />
              </EPTooltip>
            ) : (
              <Pagination
                current={pageNum}
                total={total}
                options={options}
                pageSize={pageSize}
                defaultPageSize={pageSize}
                defaultCurrent={defaultCurrent}
                showSizeChanger={false}
                showLast={showLast}
                hideOnSinglePage={hideOnSinglePage}
                pageChange={pageChange}
                pageSizeChange={pageSizeChange}
              />
            )}
          </div>
        )}
      </div>
      <MemoTable scroll={scroll} locale={locale} {...params} />
      {!hiddenPagination && (
        <div className="p-4">
          <Pagination
            current={pageNum}
            options={options}
            defaultPageSize={pageSize}
            total={total}
            pageSize={pageSize}
            showLast={showLast}
            hideOnSinglePage={hideOnSinglePage}
            defaultCurrent={defaultCurrent}
            pageChange={pageChange}
            pageSizeChange={pageSizeChange}
          />
        </div>
      )}
    </div>
  );
}
