import { useEffect, useMemo, useState } from 'react';
import Socket from '@_socket';
import { IBlockchainOverviewResponse, TChainID } from '@_api/type';
import { useAppDispatch } from '@_store';
import { setTokenInfo } from '@_store/features/chainIdSlice';
interface IIntervalData {
  overviewLoading: boolean;
  BlockchainOverview: IBlockchainOverviewResponse | undefined;
}
const useBlockchainOverview = (chain: TChainID) => {
  const [BlockchainOverview, setBlockchainOverview] = useState<IBlockchainOverviewResponse>();
  const [overviewLoading, setOverviewLoading] = useState<boolean>(true);

  console.log('signalR----------refresh');
  const socket = Socket();

  const dispatch = useAppDispatch();

  const data: IIntervalData = useMemo(() => {
    return {
      BlockchainOverview,
      overviewLoading,
    };
  }, [BlockchainOverview, overviewLoading]);

  useEffect(() => {
    function fetchAndReceiveWs() {
      if (!socket) {
        return;
      }
      socket.registerHandler('ReceiveBlockchainOverview', (data) => {
        console.log(data, 'useBlockchainOverview');
        setBlockchainOverview(data || {});
        dispatch(setTokenInfo(data));
        setOverviewLoading(false);
      });

      socket.sendEvent('RequestBlockchainOverview', { chainId: chain });
    }

    fetchAndReceiveWs();

    return () => {
      console.log('signalR----destroy');
      socket?.destroy();
      // socket?.sendEvent('UnSubscribeLatestTransactions');
      // socket?.sendEvent('UnSubscribeLatestBlocks');
    };
  }, [chain, dispatch, socket]);

  return data;
};

export default useBlockchainOverview;
