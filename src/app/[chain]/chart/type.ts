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

interface IBlockProductionRateDataItem {
  date: number;
  mainBlockProductionRate: number;
  mergeBlockProductionRate: number;
  sideBlockProductionRate: number;
}

export interface IBlockProductionRateData {
  list: Array<IBlockProductionRateDataItem>;
  highestBlockProductionRate: IBlockProductionRateDataItem;
  lowestBlockProductionRate: IBlockProductionRateDataItem;
  chainId: string;
}
export interface IAelfDailyCycleCountData {
  list: Array<{
    date: number;
    mainCycleCount: number;
    mergeCycleCount: number;
    sideCycleCount: number;
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
    mainAvgBlockDuration: string;
    sideAvgBlockDuration: string;
  }>;
  highestAvgBlockDuration: {
    date: number;
  };
  lowestAvgBlockDuration: {
    date: number;
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
  mainChainAvgBlockSize: string;
  mergeAvgBlockSize: string;
  sideChainAvgBlockSize: string;
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

export const ChartData = [
  {
    id: 'section-market-data',
    title: 'Market Data',
    charts: [
      {
        title: 'ELF Daily Price (USD) Chart',
        path: '/chart/price',
        key: 'price',
      },
      {
        title: 'aelf Market Cap Chart',
        path: '/chart/marketcap',
        key: 'marketcap',
      },
      {
        title: 'ELF Circulating Supply Growth Chart',
        path: '/chart/supply-growth',
        key: 'supply-growth',
      },
      {
        title: 'ELF Staked Chart',
        path: '/chart/staked',
        key: 'staked',
      },
      {
        title: 'TVL Chart',
        path: '/chart/tvl',
        key: 'tvl',
      },
    ],
  },
  {
    id: 'section-blockchain-data',
    title: 'Blockchain Data',
    charts: [
      {
        title: 'aelf Daily Transactions Chart',
        path: '/chart/transactions',
        key: 'transactions',
      },
      {
        title: 'aelf Cumulative Addresses Chart',
        path: '/chart/address',
        key: 'address',
      },
      {
        title: 'Monthly Active aelf Addresses',
        path: '/chart/month-address',
        key: 'month-address',
      },
      {
        title: 'Daily Active aelf Addresses',
        path: '/chart/active-address',
        key: 'active-address',
      },
      {
        title: 'ELF Holders',
        path: '/chart/holders',
        key: 'holders',
      },
      {
        title: 'Daily ELF Burnt Chart',
        path: '/chart/burnt',
        key: 'burnt',
      },
      {
        title: 'Average Transaction Fee',
        path: '/chart/avg-txfee',
        key: 'avg-txfee',
      },
      {
        title: 'aelf Daily Transaction Fee',
        path: '/chart/txfee',
        key: 'txfee',
      },
      {
        title: 'Average Block Size Chart',
        path: '/chart/blocksize',
        key: 'blocksize',
      },
      {
        title: 'aelf Daily Block Rewards Chart',
        path: '/chart/rewards',
        key: 'rewards',
      },
    ],
  },
  {
    id: 'section-network-data',
    title: 'Network Data',
    charts: [
      {
        title: 'aelf Block Production Rate Chart',
        path: '/chart/production-rate',
        key: 'production-rate',
      },
      {
        title: 'aelf Daily Cycle Count Chart',
        path: '/chart/cycle-count',
        key: 'cycle-count',
      },
      {
        title: 'aelf AVG Block Duration Chart',
        path: '/chart/avg-duration',
        key: 'avg-duration',
      },
      {
        title: 'aelf MainChain Block Producers',
        path: '/chart/produce/mainChain',
        key: 'produceMain',
      },
      {
        title: 'aelf dAppChain Block Producers',
        path: '/chart/produce/dappChain',
        key: 'produceDapp',
      },
    ],
  },
  {
    id: 'section-contracts-data',
    title: 'Contracts Data',
    charts: [
      {
        title: 'aelf Deployed Contracts Chart',
        path: '/chart/deployed-contracts',
        key: 'deployed-contracts',
      },
      {
        title: 'Contract Calls Chart',
        path: '/chart/contract-calls',
        key: 'contract-calls',
      },
    ],
  },
];

export const chartItems = [
  {
    key: '1',
    href: '#section-market-data',
    title: 'Market Data',
  },
  {
    key: '2',
    href: '#section-blockchain-data',
    title: 'Blockchain Data',
  },
  {
    key: '3',
    href: '#section-network-data',
    title: 'Network Data',
  },
  {
    key: '4',
    href: '#section-contracts-data',
    title: 'Contracts Data',
  },
];
