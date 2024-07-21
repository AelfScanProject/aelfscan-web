import { useEffect, useMemo, useState } from 'react';
import Socket from '@_socket';
import { TChainID } from '@_api/type';

export interface IProduces {
  blockCount: number;
  missedCount: number;
  producerName: string;
  order: number;
  isMinning: boolean;
  producerAddress: string;
}

interface IIntervalData {
  loading: boolean;
  produces: IProduces[] | undefined;
}
const useBlockchainOverview = (chain: TChainID) => {
  const [produces, setProduces] = useState<IProduces[]>();
  const [loading, setLoading] = useState<boolean>(true);

  console.log('signalR----------refresh');
  const socket = Socket();

  const data: IIntervalData = useMemo(() => {
    return {
      produces,
      loading,
    };
  }, [produces, loading]);

  useEffect(() => {
    function fetchAndReceiveWs() {
      if (!socket) {
        return;
      }
      socket.registerHandler('ReceiveBpProduce', (data) => {
        console.log(data, 'ReceiveBpProduce');
        setProduces(data?.list || {});
        setLoading(false);
      });

      socket.sendEvent('RequestBpProduce', { chainId: chain });
    }

    fetchAndReceiveWs();

    return () => {
      console.log('signalR----destroy');
      socket?.sendEvent('UnsubscribeBpProduce', { chainId: chain });
      socket?.destroy();
    };
  }, [chain, socket]);

  return data;
};

export default useBlockchainOverview;
