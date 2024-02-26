'use client';
import Table from '@_components/Table';
import getColumns from './columnConfig';
import { useMemo, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { TokenTransfersItemType } from '@_types/commonDetail';
import fetchData from './mock';
import { numberFormatter } from '@_utils/formatter';
import { useMobileContext } from '@app/pageProvider';
import useTableData from '@_hooks/useTable';
import useResponsive from '@_hooks/useResponsive';
export interface IResponseData {
  total: number;
  data: TokenTransfersItemType[];
}

export default function List({ SSRData }) {
  const { isMobile } = useResponsive();
  const disposeData = (data) => {
    return {
      total: data.total,
      list: [...data.data],
    };
  };
  const { loading, total, data, currentPage, pageSize, pageChange, pageSizeChange } = useTableData<
    TokenTransfersItemType,
    IResponseData
  >({
    SSRData: disposeData(SSRData),
    fetchData: fetchData,
    disposeData: disposeData,
  });
  const [timeFormat, setTimeFormat] = useState<string>('Age');
  const columns = useMemo<ColumnsType<TokenTransfersItemType>>(() => {
    return getColumns({
      timeFormat,
      columnType: 'Token',
      handleTimeChange: () => {
        setTimeFormat(timeFormat === 'Age' ? 'Date Time (UTC)' : 'Age');
      },
    });
  }, [timeFormat]);

  const singleTitle = useMemo(() => {
    return `A total of ${numberFormatter(String(total))} token transfers found`;
  }, [total]);

  return (
    <div>
      <Table
        headerTitle={{
          single: {
            title: singleTitle,
          },
        }}
        loading={loading}
        dataSource={data}
        columns={columns}
        isMobile={isMobile}
        rowKey="transactionHash"
        total={total}
        pageSize={pageSize}
        pageNum={currentPage}
        pageChange={pageChange}
        pageSizeChange={pageSizeChange}></Table>
    </div>
  );
}
