import { useEffect, useMemo, useState } from 'react';
import SignalRManager from '@_socket';
import { IBlocksResponseItem, ITransactionsResponseItem } from '@_api/type';
import { useAppDispatch } from '@_store';
import { setHomeBlocks, setHomeTransactions } from '@_store/features/chainIdSlice';
import SignalR from '@_socket/signalr';

interface IIntervalData {
  blocks: Array<IBlocksResponseItem>;
  transactions: ITransactionsResponseItem[];
  blocksLoading: boolean;
  transactionsLoading: boolean;
}
const useHomeSocket = () => {
  const [blocks, setBlocks] = useState<Array<IBlocksResponseItem>>([]);
  const [blocksLoading, setBlocksLoading] = useState<boolean>(true);
  const [transactions, setTransactions] = useState<ITransactionsResponseItem[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState<boolean>(true);

  const [socket, setSocket] = useState<SignalR | null>(null);

  useEffect(() => {
    SignalRManager.getInstance()
      .initSocket()
      .then((socketInstance) => {
        setSocket(socketInstance);
      });
  }, []);

  const dispatch = useAppDispatch();

  const data: IIntervalData = useMemo(() => {
    return {
      blocks,
      blocksLoading,
      transactionsLoading,
      transactions,
    };
  }, [blocks, blocksLoading, transactions, transactionsLoading]);

  useEffect(() => {
    const selectChain = '';
    function fetchAndReceiveWs() {
      if (!socket) {
        return;
      }
      socket.registerHandler('ReceiveMergeBlockInfo', (data) => {
        const { latestBlocks, latestTransactions } = data;
        const blocks = latestBlocks?.blocks || [];
        const transactions = latestTransactions?.transactions || [];
        setBlocks(blocks);
        setBlocksLoading(false);
        dispatch(
          setHomeBlocks({
            loading: false,
            data: blocks,
          }),
        );

        setTransactions(transactions);
        setTransactionsLoading(false);
        dispatch(
          setHomeTransactions({
            loading: false,
            data: transactions,
          }),
        );
      });

      socket.sendEvent('RequestMergeBlockInfo', { chainId: selectChain });
    }

    fetchAndReceiveWs();

    return () => {
      socket?.sendEvent('UnsubscribeMergeBlockInfo', { chainId: selectChain });
      socket?.destroy();
    };
  }, [socket]);

  return data;
};

export default useHomeSocket;
