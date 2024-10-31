import Table from '@_components/Table';
import { useCallback, useMemo, useRef, useState } from 'react';
import { IEvents } from './type';
import { ColumnsType } from 'antd/es/table';
import { Descriptions, DescriptionsProps } from 'antd';

import getColumns from './columnConfig';
import './index.css';
import { useDebounce, useEffectOnce } from 'react-use';
import { useMobileAll } from '@_hooks/useResponsive';
import { fetchContractEvents } from '@_api/fetchContact';
import { getAddress, getPageNumber } from '@_utils/formatter';
import { useParams } from 'next/navigation';
import { TChainID } from '@_api/type';
import useSearchAfterParams from '@_hooks/useSearchAfterParams';
import { useUpdateQueryParams } from '@_hooks/useUpdateQueryParams';
import Link from 'next/link';
const labelStyle: React.CSSProperties = {
  color: '#858585',
  fontSize: '14px',
  lineHeight: '22px',
};

const contentStyle: React.CSSProperties = {
  color: '#252525',
  fontSize: '14px',
  lineHeight: '22px',
};

export default function Events() {
  const { defaultPage, defaultPageSize } = useSearchAfterParams(10, 'events');
  const [currentPage, setCurrentPage] = useState<number>(defaultPage);
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<IEvents[]>();
  const [timeFormat, setTimeFormat] = useState<string>('Date Time (UTC)');
  const [searchText, setSearchText] = useState<string>();
  const { chain, address } = useParams();
  const mountRef = useRef(false);
  const updateQueryParams = useUpdateQueryParams();

  const [searchType, setSearchType] = useState<string>('');

  const getData = useCallback(
    async (page: number, pageSize: number, search) => {
      const params = {
        chainId: chain as TChainID,
        skipCount: getPageNumber(page, pageSize),
        maxResultCount: pageSize,
        blockHeight: !isNaN(Number(search)) ? Number(search) : search || null,
        contractAddress: address && getAddress(address as string),
      };
      setLoading(true);
      try {
        if (mountRef.current) {
          updateQueryParams({
            p: page,
            ps: pageSize,
            tab: 'events',
          });
        }
      } catch (error) {
        console.log(error, 'error.rr');
      }
      try {
        const data = await fetchContractEvents(params);
        setData(data.list);
        setTotal(data.total);
      } finally {
        mountRef.current = true;
        setLoading(false);
      }
    },
    [address, chain],
  );

  useEffectOnce(() => {
    getData(currentPage, pageSize, searchText);
  });

  const columns = useMemo<ColumnsType<IEvents>>(() => {
    return getColumns({
      timeFormat,
      handleTimeChange: () => {
        setTimeFormat(timeFormat === 'Age' ? 'Date Time (UTC)' : 'Age');
      },
      chainId: chain,
    });
  }, [chain, timeFormat]);

  const pageChange = async (page: number) => {
    setLoading(true);
    setCurrentPage(page);
    getData(page, pageSize, searchText);
  };

  const pageSizeChange = async (page, size) => {
    setLoading(true);
    setPageSize(size);
    setCurrentPage(page);
    getData(page, size, searchText);
  };
  const searchChange = async (value) => {
    if (value) {
      setSearchType('block');
    } else {
      setSearchType('');
    }
    setLoading(true);
    setCurrentPage(1);
    getData(1, pageSize, value);
  };

  const isMobile = useMobileAll();

  const searchByBlock = useMemo(() => {
    const spanWith2col = isMobile ? 4 : 2;
    return [
      {
        key: 'desc',
        label: 'Filtered by BlockNo',
        labelStyle: {
          color: '#252525',
          fontWeight: 500,
        },
        children: (
          <Link className="block w-[400px] truncate text-link" href={`/${chain}/block/${searchText}`}>
            {searchText}
          </Link>
        ),
        span: spanWith2col,
      },
    ];
  }, [chain, isMobile, searchText]);

  return (
    <div className="event-container">
      {searchType === 'block' && data?.length !== 0 && searchText && !loading && (
        <div className="mx-4 mb-2 border-b border-b-[#e6e6e6] pb-4">
          <Descriptions
            contentStyle={contentStyle}
            labelStyle={labelStyle}
            colon={false}
            layout="vertical"
            column={4}
            items={searchByBlock}
          />
        </div>
      )}
      <Table
        loading={loading}
        headerTitle={
          <div className="tips">
            Tips：Contract events are developer-defined mechanisms that allow users to observe and understand specific
            operations within a contract. These operations can include changes in state, user interactions, and
            important notifications. By examining events, users can gain valuable insights into the contract&apos;s
            internal workings, including event names, parameters, transaction hashes, block numbers, and other pertinent
            data.
          </div>
        }
        topSearchProps={{
          value: searchText,
          placeholder: 'Search blockNo',
          onChange: ({ currentTarget }) => {
            const { value: inputValue } = currentTarget;
            const reg = /^-?\d*(\.\d*)?$/;
            if (reg.test(inputValue) || inputValue === '' || inputValue === '-') {
              setSearchText(inputValue);
            }
          },
          onSearchChange: () => {
            // searchChange();
          },
          onPressEnter: (value) => {
            searchChange(value);
          },
          onClear: () => {
            searchChange(null);
          },
        }}
        showTopSearch
        dataSource={data}
        columns={columns}
        isMobile={isMobile}
        options={[10, 25]}
        rowKey="id"
        total={total}
        pageSize={pageSize}
        pageNum={currentPage}
        pageChange={pageChange}
        pageSizeChange={pageSizeChange}></Table>
    </div>
  );
}
