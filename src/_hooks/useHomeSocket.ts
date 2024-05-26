import { useEffect, useMemo, useState } from 'react';
import Socket from '@_socket';
import { IBlockchainOverviewResponse, IBlocksResponseItem, ITransactionsResponseItem, TChainID } from '@_api/type';
import { ITPSData } from '@pageComponents/home/_components/TPSChart';
import { useAppDispatch } from '@_store';
import { setTokenInfo } from '@_store/features/chainIdSlice';
interface IIntervalData {
  blocks: Array<IBlocksResponseItem>;
  transactions: ITransactionsResponseItem[];
  blocksLoading: boolean;
  transactionsLoading: boolean;
  overviewLoading: boolean;
  BlockchainOverview: IBlockchainOverviewResponse | undefined;
  tpsData: ITPSData | undefined;
}
const useHomeSocket = (chain: TChainID) => {
  const [blocks, setBlocks] = useState<Array<IBlocksResponseItem>>([]);
  const [BlockchainOverview, setBlockchainOverview] = useState<IBlockchainOverviewResponse>();
  const [transactions, setTransactions] = useState<ITransactionsResponseItem[]>([]);
  const [blocksLoading, setBlocksLoading] = useState<boolean>(true);
  const [transactionsLoading, setTransactionsLoading] = useState<boolean>(true);
  const [overviewLoading, setOverviewLoading] = useState<boolean>(true);
  const [tpsData, setTpsData] = useState<ITPSData>();

  console.log('signalR----------refresh');
  const socket = Socket();

  const dispatch = useAppDispatch();

  const data: IIntervalData = useMemo(() => {
    return {
      blocks,
      blocksLoading,
      transactionsLoading,
      transactions,
      BlockchainOverview,
      overviewLoading,
      tpsData,
    };
  }, [blocks, blocksLoading, tpsData, transactions, transactionsLoading, BlockchainOverview, overviewLoading]);

  useEffect(() => {
    function fetchAndReceiveWs() {
      if (!socket) {
        return;
      }

      socket.registerHandler('ReceiveLatestBlocks', (data) => {
        setBlocks(data?.blocks || []);
        setBlocksLoading(false);
      });
      socket.registerHandler('ReceiveLatestTransactions', (data) => {
        setTransactions(data.transactions || []);
        setTransactionsLoading(false);
      });
      socket.registerHandler('ReceiveBlockchainOverview', (data) => {
        setBlockchainOverview(data || {});
        dispatch(setTokenInfo(data));
        setOverviewLoading(false);
      });
      socket.registerHandler('ReceiveTransactionDataChart', (data) => {
        setTpsData(data);
      });
      socket.sendEvent('RequestLatestTransactions', { chainId: chain });
      socket.sendEvent('RequestLatestBlocks', { chainId: chain });
      socket.sendEvent('RequestBlockchainOverview', { chainId: chain });
      socket.sendEvent('RequestTransactionDataChart', { chainId: chain });
    }

    fetchAndReceiveWs();

    return () => {
      console.log('signalR----destroy');
      socket?.destroy();
      // socket?.sendEvent('UnSubscribeLatestTransactions');
      // socket?.sendEvent('UnSubscribeLatestBlocks');
    };
  }, [chain, socket]);

  return data;
};

export default useHomeSocket;
