import { useEffect, useMemo, useState } from 'react';
import Socket from '@_socket';
import { IBlocksResponseItem, ITransactionsResponseItem, TChainID } from '@_api/type';
import { ITPSData } from '@pageComponents/home/_components/TPSChart';
import { useAppDispatch } from '@_store';
import { setHomeBlocks, setHomeTransactions, setHomeTpsData } from '@_store/features/chainIdSlice';

interface IIntervalData {
  blocks: Array<IBlocksResponseItem>;
  transactions: ITransactionsResponseItem[];
  blocksLoading: boolean;
  transactionsLoading: boolean;
  tpsData: ITPSData | undefined;
}
const useHomeSocket = (chain: TChainID) => {
  const [blocks, setBlocks] = useState<Array<IBlocksResponseItem>>([]);
  const [transactions, setTransactions] = useState<ITransactionsResponseItem[]>([]);
  const [blocksLoading, setBlocksLoading] = useState<boolean>(true);
  const [transactionsLoading, setTransactionsLoading] = useState<boolean>(true);
  const [tpsData, setTpsData] = useState<ITPSData>();
  const [tpsLoading, setTpsLoading] = useState<boolean>(true);

  console.log('signalR----------refresh');
  const socket = Socket();

  const dispatch = useAppDispatch();

  const data: IIntervalData = useMemo(() => {
    return {
      blocks,
      blocksLoading,
      transactionsLoading,
      transactions,
      tpsData,
      tpsLoading,
    };
  }, [blocks, blocksLoading, tpsData, tpsLoading, transactions, transactionsLoading]);

  useEffect(() => {
    function fetchAndReceiveWs() {
      if (!socket) {
        return;
      }

      socket.registerHandler('ReceiveLatestBlocks', (data) => {
        setBlocks(data?.blocks || []);
        dispatch(
          setHomeBlocks({
            loading: false,
            data: data?.blocks || [],
          }),
        );
        setBlocksLoading(false);
      });
      socket.registerHandler('ReceiveLatestTransactions', (data) => {
        setTransactions(data.transactions || []);
        dispatch(
          setHomeTransactions({
            loading: false,
            data: data?.transactions || [],
          }),
        );
        setTransactionsLoading(false);
      });
      socket.registerHandler('ReceiveTransactionDataChart', (data) => {
        setTpsData(data);
        dispatch(
          setHomeTpsData({
            loading: false,
            data: data,
          }),
        );
        setTpsLoading(false);
      });
      socket.sendEvent('RequestLatestTransactions', { chainId: chain });
      socket.sendEvent('RequestLatestBlocks', { chainId: chain });
      socket.sendEvent('RequestTransactionDataChart', { chainId: chain });
    }

    fetchAndReceiveWs();

    return () => {
      console.log('signalR----destroy');
      socket?.sendEvent('UnsubscribeTransactionDataChart', { chainId: chain });
      socket?.sendEvent('UnsubscribeRequestLatestBlocks', { chainId: chain });
      socket?.sendEvent('UnsubscribeLatestTransactions', { chainId: chain });
      socket?.destroy();
    };
  }, [chain, socket]);

  return data;
};

export default useHomeSocket;
