import { useEffect, useMemo, useState } from 'react';
import { TChainID } from '@_api/type';
import SignalRManager from '@_socket';
import SignalR from '@_socket/signalr';

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

  const [socket, setSocket] = useState<SignalR | null>(null);

  useEffect(() => {
    SignalRManager.getInstance()
      .initSocket()
      .then((socketInstance) => {
        setSocket(socketInstance);
      });
  }, []);

  const data: IIntervalData = useMemo(() => {
    return {
      produces,
      loading,
    };
  }, [produces, loading]);

  useEffect(() => {
    function fetchAndReceiveWs() {
      if (!socket || !chain) {
        return;
      }
      socket.registerHandler('ReceiveBpProduce', (data) => {
        setProduces(data?.list || {});
        setLoading(false);
      });

      socket.sendEvent('RequestBpProduce', { chainId: chain });
    }

    fetchAndReceiveWs();

    return () => {
      socket?.sendEvent('UnsubscribeBpProduce', { chainId: chain });
      socket?.destroy();
    };
  }, [chain, socket]);

  return data;
};

export default useBlockchainOverview;
