import { useEffect, useMemo, useState } from 'react';
import { IBlockchainOverviewResponse, TChainID } from '@_api/type';
import { useAppDispatch } from '@_store';
import { setTokenInfo } from '@_store/features/chainIdSlice';
import SignalR from '@_socket/signalr';
import SignalRManager from '@_socket';
import { MULTI_CHAIN } from '@_utils/contant';
interface IIntervalData {
  overviewLoading: boolean;
  BlockchainOverview: IBlockchainOverviewResponse | undefined;
}
const useBlockchainOverview = (chain: TChainID) => {
  const [BlockchainOverview, setBlockchainOverview] = useState<IBlockchainOverviewResponse>();
  const [overviewLoading, setOverviewLoading] = useState<boolean>(true);

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
      BlockchainOverview,
      overviewLoading,
    };
  }, [BlockchainOverview, overviewLoading]);

  useEffect(() => {
    const selectChain = chain === MULTI_CHAIN ? '' : chain;
    function fetchAndReceiveWs() {
      if (!socket || !chain) {
        return;
      }
      socket.registerHandler('ReceiveBlockchainOverview', (data) => {
        setBlockchainOverview(data || {});
        dispatch(setTokenInfo(data));
        setOverviewLoading(false);
      });

      socket.sendEvent('RequestBlockchainOverview', { chainId: selectChain });
    }

    fetchAndReceiveWs();

    return () => {
      socket?.sendEvent('UnsubscribeBlockchainOverview', { chainId: selectChain });
      socket?.destroy();
    };
  }, [chain, socket]);

  return data;
};

export default useBlockchainOverview;
