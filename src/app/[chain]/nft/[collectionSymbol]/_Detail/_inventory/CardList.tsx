import React, { ReactNode } from 'react';
import { Card, Spin } from 'antd';
import './index.css';
import { Pagination } from 'aelf-design';
import EPSearch from '@_components/EPSearch';
import clsx from 'clsx';
import { isReactNode } from '@_utils/typeUtils';
import { InventoryItem } from '../type';
import { ITableSearch } from '@_components/Table';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import EPTooltip from '@_components/EPToolTip';
import { useMobileAll } from '@_hooks/useResponsive';
import NFTImage from '@_components/NFTImage';

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
  const { chain, collectionSymbol } = useParams();
  const { list } = props;
  return (
    <div className="collection-detail-inventory">
      {list.map((itemObj, index) => {
        return (
          <div key={index} className="collection-detail-inventory-item">
            <Link href={`/${chain}/nft/${collectionSymbol}/${itemObj?.item?.symbol}`}>
              <Card hoverable cover={<NFTImage className="rounded object-cover" src={itemObj?.item?.imageUrl} />}>
                <div>
                  <span className="text-xs leading-5 text-base-200">Symbol:</span>
                  <span className="ml-1 text-xs leading-5 text-base-100">{itemObj.item.symbol}</span>
                </div>
                <div className="item-center flex text-xs leading-5">
                  <div className="w-[58px] text-base-200">Last Sale:</div>
                  {itemObj.lastSalePrice === -1 ? (
                    <span className="text-base-100">N/A</span>
                  ) : (
                    <EPTooltip
                      mode="dark"
                      title={`Click to see transaction with last sale price of $${itemObj.lastSalePriceInUsd} (${itemObj.lastSalePrice} ${itemObj.lastSaleAmountSymbol})`}>
                      <Link
                        className="inline-block truncate"
                        href={`/${chain}/tx/${itemObj.lastTransactionId}?blockHeight=${itemObj.blockHeight}`}>
                        <span className="mx-1">${itemObj.lastSalePriceInUsd}</span>
                        <span>
                          ({itemObj.lastSalePrice} {itemObj.lastSaleAmountSymbol})
                        </span>
                      </Link>
                    </EPTooltip>
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
        <MemoNftCardList list={dataSource} />
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
