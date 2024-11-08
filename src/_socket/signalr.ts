import { HubConnection, HubConnectionBuilder, HttpTransportType } from '@microsoft/signalr';
// import { IBidInfo, IBidInfosResponse } from './types';

type SignalRParams = {
  url: string;
};

// type ReceiveDataType = IBidInfo | IBidInfosResponse;

type HandlerFn = (data: any) => void;

const messageType: Array<string> = [
  'ReceiveLatestTransactions',
  'ReceiveBlockchainOverview',
  'ReceiveLatestBlocks',
  'ReceiveTransactionDataChart',
  'ReceiveBpProduce',
  'ReceiveMergeBlockInfo',
];

export default class SignalR {
  private connection: HubConnection | null;
  private url: string;
  private handlerMap: Map<string, Array<HandlerFn>>;
  private maxRetryCount: number;
  private retryCount: number;
  private heartBeatInterval: NodeJS.Timeout | null = null;

  constructor({ url }: SignalRParams, maxRetryCount: number = 3) {
    this.url = url;
    this.maxRetryCount = maxRetryCount;
    this.retryCount = 0;
    this.connection = new HubConnectionBuilder()
      .withUrl(this.url, {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .build();
    this.handlerMap = new Map();
  }

  initAndStart = () => {
    this.connection?.onclose((err) => {
      if (this.retryCount < this.maxRetryCount) {
        this.retryCount++;
        this.initAndStart();
      } else {
        console.log('Max retry attempts reached.');
      }
    });

    this.connection?.onreconnecting((err) => {
      console.log('signalR---onreconnecting', err);
    });

    this.connection?.onreconnected(() => {
      this.retryCount = 0;
    });
    this.listen();

    return new Promise((resolve, reject) => {
      this.connection
        ?.start()
        .then(() => {
          this.retryCount = 0; // Reset retry count on successful connection
          this.startHeartBeat();
          resolve(this.connection);
        })
        .catch((e) => {
          reject(e);
        });
    });
  };

  listen = () => {
    try {
      messageType.length &&
        messageType.forEach((name) => {
          this.connection?.on(name, (data) => {
            this.dispatchMessage(name, data);
          });
        });
    } catch (err) {
      console.log('listen err', err);
    }
  };

  registerHandler = (message: string, handler: HandlerFn) => {
    try {
      const handlers = this.handlerMap.get(message);
      if (handlers) {
        this.handlerMap.set(message, [...handlers, handler]);
      } else {
        this.handlerMap.set(message, [handler]);
      }
    } catch (err) {
      console.log('registerHandler err', err);
    }
  };

  unRegisterHandler = (message: string, handler: HandlerFn) => {
    try {
      const handlers = this.handlerMap.get(message);
      if (handlers) {
        this.handlerMap.set(
          message,
          handlers.filter((fn) => fn !== handler),
        );
      }
    } catch (err) {
      console.log('unsubscribe err', err);
    }
  };

  dispatchMessage = (message: string, data: any) => {
    try {
      const handlers = this.handlerMap.get(message);
      handlers &&
        handlers.forEach((handler) => {
          handler(data);
        });
    } catch (err) {
      console.log('dispatchMessage err', err);
    }
  };

  sendEvent = (name: string, ...rest: any[]) => {
    try {
      if (this.connection?.state === 'Connected') {
        if (rest.length === 0) {
          this.connection.invoke(name);
        } else if (rest.length === 1) {
          this.connection.invoke(name, rest[0]);
        } else if (rest.length === 2) {
          this.connection.invoke(name, rest[0], rest[1]);
        } else if (rest.length === 3) {
          this.connection.invoke(name, rest[0], rest[1], rest[2]);
        } else {
          console.log('too much params');
        }
      } else {
        console.log('Connection is not in a connected state');
      }
    } catch (err) {
      console.log('subscribeEvent err', err);
    }
  };

  startHeartBeat = () => {
    this.heartBeatInterval = setInterval(() => {
      if (this.connection?.state === 'Connected') {
        this.connection.send('Ping').catch((err) => {
          console.error('Heartbeat failed:', err);
        });
      }
    }, 30000); // Send a heartbeat every 30 seconds
  };

  stopHeartBeat = () => {
    if (this.heartBeatInterval) {
      clearInterval(this.heartBeatInterval);
      this.heartBeatInterval = null;
    }
  };

  destroy(): void {
    this.stopHeartBeat(); // Stop heartbeat when destroying
    // this.connection?.stop();
    this.handlerMap.clear();
  }
}
