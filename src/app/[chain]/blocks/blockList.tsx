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
import { MULTI_CHAIN, pageSizeOption } from '@_utils/contant';
import { fetchBlocks } from '@_api/fetchBlocks';
import { useParams } from 'next/navigation';
import { Spin } from 'antd';
import { getChainId, getPageNumber } from '@_utils/formatter';
import { useUpdateQueryParams } from '@_hooks/useUpdateQueryParams';
import { usePagination } from '@_hooks/usePagination';

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

export default function BlockList({ SSRData, defaultPage, defaultPageSize, defaultChain }) {
  const isMobile = useMobileAll();
  const [currentPage, setCurrentPage] = useState<number>(defaultPage);
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(SSRData.total);
  const [data, setData] = useState<IBlocksResponseItem[]>(SSRData.blocks);
  const { chain } = useParams<{ chain: TChainID }>();
  const updateQueryParams = useUpdateQueryParams();

  const [selectChain, setSelectChain] = useState(defaultChain);

  const fetchData = useCallback(
    async (page, size, chain) => {
      const isLast = isLastPage(total, size, page);
      const params = {
        chainId: getChainId(chain as string),
        skipCount: isLast ? 0 : getPageNumber(page, size),
        maxResultCount: size,
        isLastPage: isLast,
      };
      setLoading(true);
      try {
        updateQueryParams({ p: page, ps: size, chain: chain });
        const res: IBlocksResponse = await fetchBlocks(params);
        setTotal(res.total);
        setData(res.blocks);
      } catch (error) {
        setLoading(false);
      }
      setLoading(false);
    },
    [total, updateQueryParams],
  );

  const [timeFormat, setTimeFormat] = useState<string>('Age');
  const columns = useMemo<ColumnsType<IBlocksResponseItem>>(() => {
    return getColumns({
      timeFormat,
      handleTimeChange: () => {
        setTimeFormat(timeFormat === 'Age' ? 'Date Time (UTC)' : 'Age');
      },
      chainId: chain,
    });
  }, [chain, timeFormat]);

  const pageMaxBlock = data[0]?.blockHeight;
  const pageMinBlock = data[data.length - 1]?.blockHeight;

  const { pageChange, pageSizeChange, chainChange } = usePagination({
    setCurrentPage,
    setPageSize,
    fetchData,
    setSelectChain,
    selectChain,
    pageSize,
  });

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
          showMultiChain={chain === MULTI_CHAIN}
          MultiChainSelectProps={{
            value: selectChain,
            onChange: chainChange,
          }}
          loading={false}
          dataSource={data}
          columns={columns}
          isMobile={isMobile}
          rowKey={(record) => record.blockHeight + record?.chainIds?.join('')}
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
