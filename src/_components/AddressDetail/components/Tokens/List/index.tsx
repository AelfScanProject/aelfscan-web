import Table from '@_components/Table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import getColumns from './columnConfig';
import './index.css';
import { IPortfolio, TokensListItemType } from '@_types/commonDetail';
import { useMD, useMobileAll } from '@_hooks/useResponsive';
import { getAddress, getChainId, getPageNumber, numberFormatter, thousandsNumber } from '@_utils/formatter';
import { useParams } from 'next/navigation';
import { fetchAccountsDetailTokens } from '@_api/fetchContact';
import { TableProps } from 'antd';
import { Switch } from 'aelf-design';
import { SortEnum, TableSortEnum } from '@_types/common';
import { useAddressContext } from '@_components/AddressDetail/AddressContext';
import { MULTI_CHAIN } from '@_utils/contant';
import { TChainID } from '@_api/type';
import useRefreshDetail from '../hooks/useRefreshDetail';
import TokensValue from '../TokenValue';
import SwitchButton from '../SwitchButton';
import RefreshButtonCom from '../RefreshButtonCom';

type OnChange = NonNullable<TableProps<TokensListItemType>['onChange']>;
type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

export default function TokensList({ portfolio, chainIds }: { portfolio: IPortfolio; chainIds: TChainID[] }) {
  const isMobile = useMobileAll();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [showELF, setShowELF] = useState<boolean>(false);
  const [data, setData] = useState<TokensListItemType[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [SearchFetchText, setSearchFetchText] = useState<string>('');
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});

  const { data: detailData, loading: detailLoading, refreshData } = useRefreshDetail(portfolio);

  const {
    totalTokenValue,
    totalTokenCount,
    mainTokenCount,
    sideTokenCount,
    mainTokenValue,
    sideTokenValue,
    totalTokenValueOfElf,
  } = detailData;

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

  const { isAddress } = useAddressContext();

  const { chain, address } = useParams();

  const [selectChain, setSelectChain] = useState(isAddress ? MULTI_CHAIN : (chain as string));

  const [height, setHeight] = useState(0);
  const [viewHeight, setViewHeight] = useState('0px');

  const isMd = useMD();

  const fetchData = useCallback(async () => {
    try {
      const params = {
        skipCount: getPageNumber(currentPage, pageSize),
        maxResultCount: pageSize,
        chainId: getChainId(selectChain),
        address: getAddress(address as string),
        orderBy: sortedInfo.order ? (sortedInfo.columnKey as string) : undefined,
        sort: sortedInfo.order ? SortEnum[TableSortEnum[sortedInfo.order]] : undefined,
        fuzzySearch: SearchFetchText,
      };
      setLoading(true);
      const data = await fetchAccountsDetailTokens(params);
      setTotal(data.total);
      setData(data.list);
      setHeight(
        data.list.length === 0
          ? isMd
            ? 530
            : 440
          : (data.total < pageSize ? 144 : 182) + (isMd ? 88 : 0) + data.list.length * 50,
      );
      setLoading(false);
    } catch (e) {
      console.log(e);
      setHeight(isMd ? 530 : 440);
    } finally {
      setLoading(false);
    }
  }, [SearchFetchText, address, selectChain, currentPage, pageSize, sortedInfo.columnKey, sortedInfo.order, isMd]);

  const columns = getColumns(sortedInfo, chain, showELF);

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

  const searchChange = useCallback((value) => {
    setSearchFetchText(value);
  }, []);

  const handleChange: OnChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter as Sorts);
  };
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const desc = useMemo(() => {
    return `Total Value : ${showELF ? numberFormatter(totalTokenValueOfElf || '-') : `$${thousandsNumber(totalTokenValue)}`}`;
  }, [showELF, totalTokenValue, totalTokenValueOfElf]);

  return (
    <div className="token-container">
      <div className="token-header  flex flex-col  gap-4 px-4 pb-6 pt-2 min-769:flex-row min-769:items-center min-769:gap-6 min-[1025px]:gap-6">
        <TokensValue
          total={totalTokenValue}
          main={mainTokenValue}
          side={sideTokenValue}
          title="Total value"
          chainIds={chainIds}
          loading={detailLoading}
          dolar={true}
        />
        <TokensValue
          total={totalTokenCount}
          main={mainTokenCount}
          side={sideTokenCount}
          title="Total token"
          suffix="Tokens"
          chainIds={chainIds}
          loading={detailLoading}
        />
        <div className="flex items-center gap-4 min-769:gap-6 min-[1025px]:gap-6">
          <RefreshButtonCom onClick={refreshData} />
          <SwitchButton
            hidden={hidden}
            buttonProps={{
              onClick: hiddenBlock,
            }}
          />
        </div>
      </div>
      <div
        style={{
          height: viewHeight,
        }}
        className={`${hidden ? 'visible overflow-visible' : 'invisible h-0 min-h-0 overflow-hidden'} transition-height ease-[cubic-bezier(0.4, 0, 0.2, 1)] delay-0 duration-300`}>
        <div className="token-list pb-2">
          <div className="table-container">
            <Table
              showTopSearch
              headerTitle={{
                multi: {
                  title: `Tokens`,
                  desc: desc,
                },
              }}
              bordered={false}
              showMultiChain={isAddress}
              MultiChainSelectProps={{
                value: selectChain,
                onChange: chainChange,
              }}
              topSearchProps={{
                value: searchText,
                placeholder: 'Search by Name/Symbol',
                className: '!w-auto !min-w-[176px]',
                onChange: ({ currentTarget }) => {
                  setSearchText(currentTarget.value);
                },
                onSearchChange: (value) => {
                  searchChange(value);
                },
              }}
              tokenPage
              headerLeftNode={
                <div className="flex items-center">
                  <span className="mr-2 text-xs leading-5 text-base-100">Show value in ELF</span>
                  <Switch checked={showELF} onChange={setShowELF} />
                </div>
              }
              onChange={handleChange}
              loading={loading}
              options={[10, 20]}
              hideOnSinglePage={true}
              dataSource={data}
              columns={columns}
              isMobile={isMobile}
              rowKey={(record) => {
                return record.token?.symbol + record?.chainIds?.join('');
              }}
              total={total}
              pageSize={pageSize}
              pageNum={currentPage}
              pageChange={pageChange}
              pageSizeChange={pageSizeChange}></Table>
          </div>
        </div>
      </div>
    </div>
  );
}
