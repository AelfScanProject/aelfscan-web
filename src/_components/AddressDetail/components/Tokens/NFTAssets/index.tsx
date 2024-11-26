import Table from '@_components/Table';
import { useCallback, useEffect, useRef, useState } from 'react';
import getColumns from './columnConfig';
import './index.css';
import { IPortfolio, NftsItemType } from '@_types/commonDetail';
import { fetchAccountsDetailNFTAssets } from '@_api/fetchContact';
import { useParams } from 'next/navigation';
import { getAddress, getChainId, getPageNumber } from '@_utils/formatter';
import { Skeleton, TableProps } from 'antd';
import { SortEnum, TableSortEnum } from '@_types/common';
import useRefreshDetail from '../hooks/useRefreshDetail';
import TokensValue from '../TokenValue';
import { TChainID } from '@_api/type';
import SwitchButton from '../SwitchButton';
import RefreshButtonCom from '../RefreshButtonCom';
import clsx from 'clsx';
import { MULTI_CHAIN } from '@_utils/contant';
import { useAddressContext } from '@_components/AddressDetail/AddressContext';
import { useBreakpointMD } from '@_hooks/useResponsive';

type OnChange = NonNullable<TableProps<NftsItemType>['onChange']>;
type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

export default function NFTAssets({ portfolio, chainIds }: { portfolio: IPortfolio; chainIds: TChainID[] }) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<NftsItemType[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [SearchFetchText, setSearchFetchText] = useState<string>('');
  const { address, chain } = useParams();
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});

  const mountedRef = useRef(true);

  const { isAddress } = useAddressContext();

  const [height, setHeight] = useState(0);
  const [viewHeight, setViewHeight] = useState('0px');

  const [selectChain, setSelectChain] = useState(isAddress ? MULTI_CHAIN : (chain as string));

  const isMd = useBreakpointMD();

  const fetchData = useCallback(async () => {
    try {
      const params = {
        skipCount: getPageNumber(currentPage, pageSize),
        maxResultCount: pageSize,
        chainId: getChainId(selectChain),
        address: getAddress(address as string),
        fuzzySearch: SearchFetchText,
        orderInfos: sortedInfo.order
          ? [{ orderBy: sortedInfo.columnKey as string, sort: SortEnum[TableSortEnum[sortedInfo.order]] }]
          : [],
      };
      setLoading(true);
      const data = await fetchAccountsDetailNFTAssets(params);
      setTotal(data.total);
      setData(data.list);
      setHeight(data.list.length === 0 ? (isMd ? 550 : 433) : 172 + (isMd ? 30 : 0) + data.list.length * 64);
      setLoading(false);
      mountedRef.current = false;
    } catch {
      setHeight(isMd ? 550 : 433);
      mountedRef.current = false;
    } finally {
      setLoading(false);
    }
  }, [SearchFetchText, address, selectChain, currentPage, pageSize, sortedInfo, isMd]);

  const columns = getColumns(sortedInfo);

  const pageChange = (page: number) => {
    setCurrentPage(page);
  };

  const pageSizeChange = (page, size) => {
    setPageSize(size);
    setCurrentPage(page);
  };

  const chainChange = (value) => {
    setCurrentPage(1);
    setSelectChain(value);
  };

  const searchChange = (value) => {
    setSearchFetchText(value);
  };

  const handleChange: OnChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter as Sorts);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const { data: detailData, loading: detailLoading, refreshData } = useRefreshDetail(portfolio);

  const { totalNftCount, mainNftCount, sideNftCount } = detailData;

  const [hidden, setHidden] = useState(false);

  const [hiddenLoading, setHiddenLoading] = useState(false);

  const hiddenBlock = () => {
    if (hiddenLoading) return;
    if (!hidden) {
      setHidden(!hidden);
      setViewHeight(`${height}px`);
      setHiddenLoading(true);
      setTimeout(() => {
        setHiddenLoading(false);
        setViewHeight('auto');
      }, 300);
    } else {
      setViewHeight(`${height}px`);
      setTimeout(() => {
        setHidden(!hidden);
        setViewHeight('0px');
      }, 100);
    }
  };

  return (
    <div className="asset-list">
      {mountedRef.current ? (
        <Skeleton />
      ) : (
        <div className="asset-list-header flex flex-col  gap-4 px-4 pb-6 pt-2 md:flex-row md:items-center md:gap-6 min-[1025px]:gap-6">
          <div>
            <TokensValue
              total={totalNftCount}
              main={mainNftCount}
              side={sideNftCount}
              loading={detailLoading}
              chainIds={chainIds}
              suffix="NFTs"
              title="Total NFT assets"
            />
          </div>
          <div className="flex items-center gap-4 md:gap-6 min-[1025px]:gap-6">
            <RefreshButtonCom onClick={refreshData} />
            <SwitchButton
              hidden={hidden}
              buttonProps={{
                onClick: hiddenBlock,
              }}
            />
          </div>
          <div></div>
        </div>
      )}

      <div
        style={{
          height: viewHeight,
        }}
        className={clsx(
          'table-container p-0',
          hidden ? `visible overflow-visible` : 'invisible h-0 min-h-0 overflow-hidden',
          'transition-height ease-[cubic-bezier(0.4, 0, 0.2, 1)] delay-0 duration-300',
        )}>
        <Table
          loading={loading}
          showTopSearch
          headerTitle={{
            multi: {
              title: `NFT Assets(${total})`,
              desc: '',
            },
          }}
          topSearchProps={{
            value: searchText,
            placeholder: 'Search Token Name  Token Symbol',
            onChange: ({ currentTarget }) => {
              setSearchText(currentTarget.value);
            },
            onSearchChange: (value) => {
              searchChange(value);
            },
          }}
          bordered={false}
          showMultiChain={isAddress}
          MultiChainSelectProps={{
            value: selectChain,
            onChange: chainChange,
          }}
          onChange={handleChange}
          options={[10, 20]}
          dataSource={data}
          hideOnSinglePage={true}
          columns={columns}
          rowKey={(record) => record.token?.symbol + record?.chainIds?.join('')}
          total={total}
          pageSize={pageSize}
          pageNum={currentPage}
          pageChange={pageChange}
          pageSizeChange={pageSizeChange}></Table>
      </div>
    </div>
  );
}
