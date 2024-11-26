import React, { ReactNode } from 'react';
import { Card, Spin } from 'antd';
import './index.css';
import EPSearch from '@_components/EPSearch';
import clsx from 'clsx';
import { isReactNode } from '@_utils/typeUtils';
import { InventoryItem } from '../type';
import { ITableSearch } from '@_components/Table';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import EPTooltip from '@_components/EPToolTip';
import { useMobileAll } from '@_hooks/useResponsive';
import NFTImage from '@_components/NFTImage';
import CommonEmpty from '@_components/Table/empty';
import { MULTI_CHAIN } from '@_utils/contant';
import Pagination from '@_components/Table/pagination';

export interface IHeaderTitleProps {
  single?: {
    title: string;
  };
  multi?: {
    title: string;
    desc: string | boolean;
  };
}

export interface Props {
  dataSource: InventoryItem[];
  total: number;
  pageNum?: number;
  pageSize?: number;
  isMobile?: boolean;
  showTopSearch?: boolean;
  headerTitle?: IHeaderTitleProps | ReactNode;
  defaultCurrent?: number;
  className?: string;
  topSearchProps?: ITableSearch;
  loading?: boolean;
  emptyType?: 'nodata' | 'search' | 'internet' | ReactNode | (() => ReactNode) | null;
  emptyText?: string;
  pageChange?: (page: number, pageSize?: number) => void;
  pageSizeChange?: (value: number, size: number) => void;
  headerLeftNode?: ReactNode;
  options?: any;
}

export type EmptyType = 'nodata' | 'search' | 'internet';

interface NftCardListProps {
  list: InventoryItem[];
}
function NftCardList(props: NftCardListProps) {
  const { list } = props;
  return (
    <div className="collection-detail-inventory">
      {list.map((itemObj, index) => {
        return (
          <div key={index} className="collection-detail-inventory-item">
            <Link href={`/nftItem?chainId=${MULTI_CHAIN}&&itemSymbol=${itemObj?.item?.symbol}`}>
              <Card hoverable cover={<NFTImage className="!rounded-lg object-cover" src={itemObj?.item?.imageUrl} />}>
                <div>
                  <span className="text-sm">Symbol: </span>
                  <span className="text-sm">{itemObj.item.symbol}</span>
                </div>
                <div className="item-center flex text-sm">
                  <div className="shrink-0 text-sm">Last traded: </div>
                  {itemObj.lastSalePrice === -1 ? (
                    <span>N/A</span>
                  ) : itemObj.lastTransactionId ? (
                    <EPTooltip
                      mode="dark"
                      title={`Click to see transaction with last sale price of $${itemObj.lastSalePriceInUsd} (${itemObj.lastSalePrice} ${itemObj.lastSaleAmountSymbol})`}>
                      <Link
                        className="inline-block truncate text-primary"
                        href={`/${itemObj?.chainIds && itemObj?.chainIds[0]}/tx/${itemObj.lastTransactionId}`}>
                        <span className="mx-1">${itemObj.lastSalePriceInUsd}</span>
                        <span>
                          ({itemObj.lastSalePrice} {itemObj.lastSaleAmountSymbol})
                        </span>
                      </Link>
                    </EPTooltip>
                  ) : (
                    <span className="inline-block truncate text-sm">
                      <span> ${itemObj.lastSalePriceInUsd}</span>
                      <span>
                        ({itemObj.lastSalePrice} {itemObj.lastSaleAmountSymbol})
                      </span>
                    </span>
                  )}
                </div>
              </Card>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
const MemoNftCardList = React.memo(NftCardList);
function HeaderTitle(props: IHeaderTitleProps): ReactNode {
  if (props.multi) {
    return (
      <>
        <div className="total-text text-sm font-normal leading-22 text-base-100">{props.multi.title}</div>
        <div className="bottom-text text-xs font-normal leading-5 text-base-200">{props.multi.desc}</div>
      </>
    );
  } else {
    return (
      <div className="single align-center flex">
        <div className="total-tex ml-1 text-sm font-normal leading-22  text-base-100 ">{props.single?.title}</div>
      </div>
    );
  }
}

export default function CardList({
  loading = false,
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
  emptyText,
  headerLeftNode,
  dataSource,
  ...params
}: Props) {
  const isMobile = useMobileAll();
  const { disabledTooltip = true } = topSearchProps || {};
  return (
    <Spin spinning={loading}>
      <div className="ep-table rounded-lg bg-white shadow-table">
        <div
          className={clsx(
            'ep-table-header',
            showTopSearch ? 'py-4' : 'p-4',
            `ep-table-header-${isMobile ? 'mobile' : 'pc'}`,
          )}>
          <div className="header-left">
            {isReactNode(headerTitle) ? headerTitle : <HeaderTitle {...headerTitle} />}
            {headerLeftNode}
          </div>
          <div className="header-pagination">
            {showTopSearch ? (
              <EPTooltip
                title={disabledTooltip ? '' : topSearchProps?.placeholder}
                placement="topLeft"
                trigger={['focus']}
                pointAtCenter={false}
                mode="dark">
                <EPSearch
                  {...topSearchProps}
                  onPressEnter={({ currentTarget }) => {
                    topSearchProps?.onSearchChange(currentTarget.value);
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
                pageChange={pageChange}
                pageSizeChange={pageSizeChange}
              />
            )}
          </div>
        </div>
        {dataSource.length ? <MemoNftCardList list={dataSource} /> : <CommonEmpty type="nodata" />}

        <div className="p-4">
          <Pagination
            current={pageNum}
            options={options}
            defaultPageSize={pageSize}
            total={total}
            pageSize={pageSize}
            defaultCurrent={defaultCurrent}
            pageChange={pageChange}
            pageSizeChange={pageSizeChange}
          />
        </div>
      </div>
    </Spin>
  );
}
