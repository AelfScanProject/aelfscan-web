import { TChainID } from '@_api/type';
import { ReactNode } from 'react';

export interface IHIGHLIGHTDataItem {
  hiddenTitle?: boolean;
  text: string | ReactNode;
  hidden?: boolean;
  key: string;
}

interface IDailyTransactionsDataItem {
  date: number;
  transactionCount: number;
  blockCount: number;
  mainChainTransactionCount: number;
  mergeTransactionCount: number;
  sideChainTransactionCount: number;
}

export interface IDailyTransactionsData {
  list: Array<IDailyTransactionsDataItem>;
  highestTransactionCount: IDailyTransactionsDataItem;
  lowesTransactionCount: IDailyTransactionsDataItem;
  chainId: string;
}

interface IDailyAddAddressDataItem {
  date: number;
  addressCount: number;
  mainChainAddressCount: number;
  mainChainTotalUniqueAddressees: number;
  mergeAddressCount: number;
  mergeTotalUniqueAddressees: number;
  ownerUniqueAddressees: number;
  sideChainAddressCount: number;
  sideChainTotalUniqueAddressees: number;
  totalUniqueAddressees: number;
}
export interface IDailyAddAddressData {
  list: Array<IDailyAddAddressDataItem>;
  highestIncrease: IDailyAddAddressDataItem;
  lowestIncrease: IDailyAddAddressDataItem;
  chainId: string;
}

interface IDailyActiveAddressDataItem {
  date: number;
  addressCount: number;
  mainChainAddressCount: number;
  mainChainReceiveAddressCount: number;
  mainChainSendAddressCount: number;
  mergeAddressCount: number;
  mergeReceiveAddressCount: number;
  mergeSendAddressCount: number;
  receiveAddressCount: number;
  sendAddressCount: number;
  sideChainAddressCount: number;
  sideChainReceiveAddressCount: number;
  sideChainSendAddressCount: number;
}

export interface IDailyActiveAddressData {
  list: Array<IDailyActiveAddressDataItem>;
  highestActiveCount: IDailyActiveAddressDataItem;
  lowestActiveCount: IDailyActiveAddressDataItem;
  chainId: string;
}

interface IMonthActiveAddressDataItem {
  dateMonth: number;
  addressCount: number;
  mergeAddressCount: number;
  mainChainAddressCount: number;
  sideChainAddressCount: number;
  sendAddressCount: number;
  receiveAddressCount: number;
  mainChainReceiveAddressCount: number;
  mainChainSendAddressCount: number;
  sideChainReceiveAddressCount: number;
  sideChainSendAddressCount: number;
}

export interface IMonthActiveAddressData {
  list: Array<IMonthActiveAddressDataItem>;
  highestActiveCount: IMonthActiveAddressDataItem;
  lowestActiveCount: IMonthActiveAddressDataItem;
  chainId: string;
}
export interface IBlockProductionRateData {
  list: Array<{
    date: number;
    blockProductionRate: string;
    blockCount: number;
    missedBlockCount: number;
  }>;
  highestBlockProductionRate: {
    date: number;
    blockProductionRate: string;
    blockCount: number;
    missedBlockCount: number;
  };
  lowestBlockProductionRate: {
    date: number;
    blockProductionRate: number;
    blockCount: number;
    missedBlockCount: number;
  };
  chainId: string;
}
export interface IAelfDailyCycleCountData {
  list: Array<{
    date: number;
    cycleCount: number;
    missedBlockCount: number;
    missedCycle: number;
  }>;
  highestMissedCycle: {
    date: number;
    missedCycle: number | string;
  };
  chainId: string;
}

export interface IAelfAVGBlockDurationData {
  list: Array<{
    date: number;
    avgBlockDuration: string;
    longestBlockDuration: string;
    shortestBlockDuration: string;
  }>;
  highestAvgBlockDuration: {
    date: number;
    avgBlockDuration: string;
  };
  lowestAvgBlockDuration: {
    date: number;
    avgBlockDuration: string;
  };
  chainId: string;
}

export interface INodeBlockProduceData {
  totalCycle: number;
  durationSeconds: number;
  blocks: number;
  missedBlocks: number;
  blocksRate: string;
  chainIds: TChainID[];
  missedCycle: number;
  cycleRate: string;
  nodeName: string;
  nodeAddress: string;
}
export interface INodeBlockProduceDataItem {
  list: Array<INodeBlockProduceData>;
}

interface IAvgTxFeeDataItem {
  date: number;
  avgFeeUsdt: string;
  avgFeeElf: string;
  mainChainAvgFeeUsdt: string;
  mergeAvgFeeUsdt: string;
  sideChainAvgFeeUsdt: string;
}

export interface IAvgTxFeeData {
  chainId: string;
  highest: IAvgTxFeeDataItem;
  lowest: IAvgTxFeeDataItem;
  list: Array<IAvgTxFeeDataItem>;
}

interface IAvgBlockSizeDataItem {
  date: number;
  avgBlockSize: string;
  mainChainTotalSize: number;
  mergeTotalSize: number;
  sideChainTotalSize: number;
}

export interface IAvgBlockSizeData {
  chainId: string;
  highest: IAvgBlockSizeDataItem;
  lowest: IAvgBlockSizeDataItem;
  list: Array<IAvgBlockSizeDataItem>;
}

export interface IDailyBlockRewardsData {
  chainId: string;
  highest: {
    date: number;
    blockReward: string;
    totalBlockCount: number;
  };
  lowest: {
    date: number;
    blockReward: string;
    totalBlockCount: number;
  };
  list: Array<{
    date: number;
    blockReward: string;
    totalBlockCount: number;
  }>;
}

export interface IDailyPriceDData {
  chainId: string;
  list: Array<{
    date: number;
    price: string;
  }>;
}

interface IDailyBurntDataItem {
  date: number;
  burnt: string;
  mainChainBurnt: number;
  mergeBurnt: number;
  sideChainBurnt: number;
}

export interface IDailyBurntData {
  chainId: string;
  highest: IDailyBurntDataItem;
  lowest: IDailyBurntDataItem;
  list: Array<IDailyBurntDataItem>;
}

interface IDeployedContractsDataItem {
  date: number;
  count: string;
  totalCount: string;
  mainChainTotalCount: string;
  mergeTotalCount: string;
  sideChainTotalCount: string;
}

export interface IDeployedContractsData {
  chainId: string;
  highest: IDeployedContractsDataItem;
  lowest: IDeployedContractsDataItem;
  list: Array<IDeployedContractsDataItem>;
}

export interface ISupplyGrowthData {
  chainId: string;
  list: Array<{
    date: number;
    totalSupply: string;
    reward: string;
    burnt: string;
    organizationUnlock: string;
    mainChainBurnt: string;
    sideChainBurnt: string;
  }>;
}
export interface IStakedData {
  chainId: string;
  list: Array<{
    date: number;
    totalStaked: string;
    bpStaked: string;
    voteStaked: string;
    rate: string;
  }>;
}

interface IDailyTxFeeDataItem {
  date: number;
  totalFeeElf: string;
  mainChainTotalFeeElf: string;
  mergeTotalFeeElf: string;
  sideChainTotalFeeElf: string;
}
export interface IDailyTxFeeData {
  chainId: string;
  highest: IDailyTxFeeDataItem;
  lowest: IDailyTxFeeDataItem;
  list: Array<IDailyTxFeeDataItem>;
}

interface IHoldersAccountDataItem {
  date: number;
  count: number;
  mainCount: number;
  mergeCount: number;
  sideCount: number;
}

export interface IHoldersAccountData {
  chainId: string;
  highest: IHoldersAccountDataItem;
  lowest: IHoldersAccountDataItem;
  list: Array<IHoldersAccountDataItem>;
}

interface IContractCallsItem {
  date: number;
  callAddressCount: number;
  callCount: number;
  mainChainCallCount: number;
  mergeCallCount: number;
  sideChainCallCount: number;
}

export interface IContractCalls {
  chainId: string;
  highest: IContractCallsItem;
  lowest: IContractCallsItem;
  list: Array<IContractCallsItem>;
}

export interface IContractCallItem {
  contractAddress: string;
  contractName: string;
  callCount: string;
  callRate: string;
  callAddressCount: number;
}

export interface ITopContractCalls {
  chainId: string;
  highest: IContractCallItem;
  lowest: IContractCallItem;
  list: Array<IContractCallItem>;
}

export interface IMarkerCapItem {
  date: number;
  fdv: string;
  price: string;
  incrMarketCap: string;
  totalMarketCap: string;
}

export interface IMarkerCap {
  chainId: string;
  highest: IMarkerCapItem;
  lowest: IMarkerCapItem;
  list: Array<IMarkerCapItem>;
}

export interface ITVLDataItem {
  date: number;
  tvl: string;
  bpLocked: string;
  voteLocked: string;
  awakenLocked: string;
}

export interface ITVLData {
  chainId: string;
  highest: ITVLDataItem;
  lowest: ITVLDataItem;
  list: Array<ITVLDataItem>;
}

export const ChartColors = ['#266CD3', '#954CF1', '#EEB420', '#0EAF58'];
