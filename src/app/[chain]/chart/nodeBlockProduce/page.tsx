'use client';
import Table from '@_components/Table';
import Title from '../_components/title';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMobileAll } from '@_hooks/useResponsive';
import getColumns from './columnConfig';
import useSearchAfterParams from '@_hooks/useSearchAfterParams';
import { INodeBlockProduceData, INodeBlockProduceDataItem } from '../type';
import { useParams } from 'next/navigation';
import { getPageNumber } from '@_utils/formatter';
import { fetchNodeBlockProduce } from '@_api/fetchChart';
import { pageSizeOption } from '@_utils/contant';
import { updateQueryParams } from '@_utils/urlUtils';
import { Select, TableProps, message } from 'antd';
import { TokensListItemType } from '@_types/commonDetail';
import dayjs from 'dayjs';

function getPrevious24HourPeriodTimestamps() {
  const now = dayjs();
  const startDate = now.subtract(24, 'hour').valueOf();
  const endDate = now.valueOf();

  return {
    startDate,
    endDate,
  };
}

function getPrevious7DayPeriodTimestamps() {
  const now = dayjs();
  const startDate = now.subtract(7, 'day').valueOf();
  const endDate = now.valueOf();

  return {
    startDate,
    endDate,
  };
}

type OnChange = NonNullable<TableProps<TokensListItemType>['onChange']>;
type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;
export default function Page() {
  const isMobile = useMobileAll();
  const { defaultPage, defaultPageSize } = useSearchAfterParams(25, 'produce');
  const [currentPage, setCurrentPage] = useState<number>(Number(defaultPage));
  const [pageSize, setPageSize] = useState<number>(Number(defaultPageSize));
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [data, setData] = useState<INodeBlockProduceData[]>();
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});

  const [date, setDate] = useState<string>('7d');

  const { chain } = useParams();

  const fetchData = useCallback(async () => {
    try {
      const { startDate, endDate } =
        date === '24h' ? getPrevious24HourPeriodTimestamps() : getPrevious7DayPeriodTimestamps();
      const params = {
        // skipCount: getPageNumber(currentPage, pageSize),
        // maxResultCount: pageSize,
        chainId: chain as string,
        startDate: startDate,
        endDate: endDate,
        // orderBy: sortedInfo.order ? (sortedInfo.columnKey as string) : undefined,
        // sort: sortedInfo.order ? SortEnum[TableSortEnum[sortedInfo.order]] : undefined,
      };
      setLoading(true);
      const data: INodeBlockProduceDataItem = await fetchNodeBlockProduce(params);
      setTotal(data?.list.length);
      setData(data.list);
    } catch (error) {
      message.error(error as string);
    } finally {
      setLoading(false);
    }
  }, [chain, date]);

  const pageChange = (page: number) => {
    setCurrentPage(page);
    updateQueryParams({ p: page, ps: pageSize });
  };

  const pageSizeChange = (page, size) => {
    setPageSize(size);
    updateQueryParams({ p: page, ps: size });
    setCurrentPage(page);
  };

  const columns = useMemo(
    () => getColumns({ currentPage, pageSize, sortedInfo, chain }),
    [chain, currentPage, pageSize, sortedInfo],
  );

  const handleChange: OnChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter as Sorts);
  };

  const dateChange = (value: string) => {
    setCurrentPage(1);
    setDate(value);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return (
    <div>
      <Title title="Blocks Produces" hiddenBorder></Title>
      <Table
        headerLeftNode={
          <Select
            defaultValue="7d"
            style={{ width: 100 }}
            onChange={dateChange}
            options={[
              { value: '24h', label: '24h' },
              { value: '7d', label: '7d' },
            ]}
          />
        }
        hiddenTitle
        loading={loading}
        dataSource={data}
        columns={columns}
        isMobile={isMobile}
        rowKey={(item) => {
          return item.nftCollection?.symbol;
        }}
        total={total}
        options={pageSizeOption}
        pageSize={pageSize}
        pageNum={currentPage}
        onChange={handleChange}
        pageChange={pageChange}
        pageSizeChange={pageSizeChange}
      />
    </div>
  );
}
