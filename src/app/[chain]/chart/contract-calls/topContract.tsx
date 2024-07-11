'use client';
import Table from '@_components/Table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMobileAll } from '@_hooks/useResponsive';
import getColumns from './columnConfig';
import { IContractCallItem, ITopContractCalls } from '../type';
import { useParams } from 'next/navigation';
import { fetchTopContractCall } from '@_api/fetchChart';
import { pageSizeOption } from '@_utils/contant';
import { Select, message } from 'antd';

export default function Page() {
  const isMobile = useMobileAll();
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [data, setData] = useState<IContractCallItem[]>();

  const [date, setDate] = useState<string>('7d');

  const { chain } = useParams();

  const fetchData = useCallback(async () => {
    try {
      const dateInterval = date === '24h' ? 1 : 7;
      const params = {
        chainId: chain as string,
        dateInterval,
      };
      setLoading(true);
      const data: ITopContractCalls = await fetchTopContractCall(params);
      setTotal(data?.list.length);
      setData(data.list);
    } catch (error) {
      message.error(error as string);
    } finally {
      setLoading(false);
    }
  }, [chain, date]);

  const columns = useMemo(() => getColumns({ chain }), [chain]);

  const dateChange = (value: string) => {
    setDate(value);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return (
    <div>
      <div className="py-6 text-[20px] font-medium leading-[28px]">Top contract calls</div>
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
        hiddenPagination
        hiddenTitle
        loading={loading}
        dataSource={data}
        columns={columns}
        isMobile={isMobile}
        rowKey="contractAddress"
        total={total}
        options={pageSizeOption}
      />
    </div>
  );
}
