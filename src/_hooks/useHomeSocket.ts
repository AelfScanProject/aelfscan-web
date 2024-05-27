import { useEffect, useMemo, useState } from 'react';
import Socket from '@_socket';
import { IBlocksResponseItem, ITransactionsResponseItem, TChainID } from '@_api/type';
import { ITPSData } from '@pageComponents/home/_components/TPSChart';
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

  console.log('signalR----------refresh');
  const socket = Socket();

  const data: IIntervalData = useMemo(() => {
    return {
      blocks,
      blocksLoading,
      transactionsLoading,
      transactions,
      tpsData,
    };
  }, [blocks, blocksLoading, tpsData, transactions, transactionsLoading]);

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
      socket.registerHandler('ReceiveTransactionDataChart', (data) => {
        setTpsData(data);
      });
      socket.sendEvent('RequestLatestTransactions', { chainId: chain });
      socket.sendEvent('RequestLatestBlocks', { chainId: chain });
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
