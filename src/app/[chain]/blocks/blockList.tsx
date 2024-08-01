/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 14:57:13
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-16 17:02:47
 * @Description: BlockList
 */
'use client';
import HeadTitle from '@_components/HeaderTitle';
import Table from '@_components/Table';
import getColumns from './columnConfig';
import { useCallback, useMemo, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { useMobileAll } from '@_hooks/useResponsive';
import { IBlocksResponse, IBlocksResponseItem, TChainID } from '@_api/type';
import { pageSizeOption } from '@_utils/contant';
import { fetchBlocks } from '@_api/fetchBlocks';
import { useParams } from 'next/navigation';
import { Spin } from 'antd';
import { getPageNumber } from '@_utils/formatter';
import { updateQueryParams } from '@_utils/urlUtils';

export enum pageType {
  first,
  prev,
  next,
  last,
}

export interface IBlocksData {
  total: number;
  blocks: IBlocksResponseItem[];
}

function isLastPage(totalItems, itemsPerPage, currentPage) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  return currentPage >= totalPages;
}

export default function BlockList({ SSRData, defaultPage, defaultPageSize }) {
  const isMobile = useMobileAll();
  const [currentPage, setCurrentPage] = useState<number>(defaultPage);
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(SSRData.total);
  const [data, setData] = useState<IBlocksResponseItem[]>(SSRData.blocks);
  const { chain } = useParams<{ chain: TChainID }>();
  const fetchData = useCallback(
    async (page, size) => {
      const isLast = isLastPage(total, size, page);
      const params = {
        chainId: chain,
        skipCount: isLast ? 0 : getPageNumber(page, size),
        maxResultCount: size,
        isLastPage: isLast,
      };
      setLoading(true);
      try {
        const res: IBlocksResponse = await fetchBlocks(params);
        setTotal(res.total);
        setData(res.blocks);
      } catch (error) {
        setLoading(false);
      }
      setLoading(false);
    },
    [chain, total],
  );

  const [timeFormat, setTimeFormat] = useState<string>('Age');
  const columns = useMemo<ColumnsType<IBlocksResponseItem>>(() => {
    return getColumns({
      timeFormat,
      handleTimeChange: () => {
        setTimeFormat(timeFormat === 'Age' ? 'Date Time (UTC)' : 'Age');
      },
      chianId: chain,
    });
  }, [chain, timeFormat]);

  const pageMaxBlock = data[0]?.blockHeight;
  const pageMinBlock = data[data.length - 1]?.blockHeight;

  const pageChange = (page: number) => {
    setCurrentPage(page);
    updateQueryParams({ p: page, ps: pageSize });
    fetchData(page, pageSize);
  };

  const pageSizeChange = (page: number, pageSize: number) => {
    setPageSize(pageSize);
    setCurrentPage(page);
    updateQueryParams({ p: page, ps: pageSize });
    fetchData(page, pageSize);
  };

  const multiTitle = useMemo(() => {
    return `Total of ${total} blocks`;
  }, [total]);

  return (
    <div>
      <HeadTitle content="Blocks" adPage="blocks"></HeadTitle>
      <Spin spinning={loading}>
        <Table
          headerTitle={{
            multi: {
              title: multiTitle,
              desc: `(Showing blocks between #${pageMinBlock} to #${pageMaxBlock})`,
            },
          }}
          loading={false}
          dataSource={data}
          columns={columns}
          isMobile={isMobile}
          rowKey="blockHeight"
          total={total}
          options={pageSizeOption}
          pageSize={pageSize}
          pageNum={currentPage}
          pageChange={pageChange}
          pageSizeChange={pageSizeChange}></Table>
      </Spin>
    </div>
  );
}
