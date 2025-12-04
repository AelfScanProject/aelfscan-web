import { ILogsProps } from '@_components/LogsContainer/type';
export interface IEvents {
  blockHeight: number;
  blockTime: string;
  chainId: string;
  contractAddress: string;
  eventName: string;
  id: string;
  index: number;
  indexed: string;
  methodName: string;
  nonIndexed: string;
  timeStamp: number;
  transactionId: string;
}
