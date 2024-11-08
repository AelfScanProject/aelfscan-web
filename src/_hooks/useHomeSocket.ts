import { useEffect, useMemo, useState } from 'react';
import SignalRManager from '@_socket';
import { IBlocksResponseItem, ITopTokensItem, ITransactionsResponseItem, TChainID } from '@_api/type';
import { ITPSData } from '@pageComponents/home/_components/TPSChart';
import { useAppDispatch } from '@_store';
import { setHomeBlocks, setHomeTransactions, setHomeTpsData, setHomeTokens } from '@_store/features/chainIdSlice';
import SignalR from '@_socket/signalr';
import { MULTI_CHAIN } from '@_utils/contant';

interface IIntervalData {
  blocks: Array<IBlocksResponseItem>;
  transactions: ITransactionsResponseItem[];
  blocksLoading: boolean;
  transactionsLoading: boolean;
  tpsData: ITPSData | undefined;
}
const useHomeSocket = (chain: TChainID) => {
  const [blocks, setBlocks] = useState<Array<IBlocksResponseItem>>([]);
  const [blocksLoading, setBlocksLoading] = useState<boolean>(true);
  const [transactions, setTransactions] = useState<ITransactionsResponseItem[]>([]);
  const [tokensLoading, setTokensLoading] = useState<boolean>(true);
  const [tokens, setTokens] = useState<ITopTokensItem[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState<boolean>(true);
  const [tpsData, setTpsData] = useState<ITPSData>();
  const [tpsLoading, setTpsLoading] = useState<boolean>(true);

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
      tpsData,
      tpsLoading,
      tokens,
      tokensLoading,
    };
  }, [blocks, blocksLoading, tokens, tokensLoading, tpsData, tpsLoading, transactions, transactionsLoading]);

  useEffect(() => {
    const selectChain = chain === MULTI_CHAIN ? '' : chain;
    function fetchAndReceiveWs() {
      if (!socket || !chain) {
        return;
      }
      socket.registerHandler('ReceiveMergeBlockInfo', (data) => {
        const { latestBlocks, latestTransactions, topTokens } = data;
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

        setTokens(topTokens || []);
        setTokensLoading(false);

        dispatch(
          setHomeTokens({
            loading: false,
            data: topTokens,
          }),
        );
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
      socket.sendEvent('RequestTransactionDataChart', { chainId: selectChain });
      socket.sendEvent('RequestMergeBlockInfo', { chainId: selectChain });
    }

    fetchAndReceiveWs();

    return () => {
      socket?.sendEvent('UnsubscribeTransactionDataChart', { chainId: selectChain });
      socket?.sendEvent('UnsubscribeMergeBlockInfo', { chainId: selectChain });
      socket?.destroy();
    };
  }, [chain, socket]);

  return data;
};

export default useHomeSocket;
