import { ReactNode } from 'react';

export interface IHIGHLIGHTDataItem {
  hiddenTitle?: boolean;
  text: string | ReactNode;
  key: string;
}

export interface IDailyTransactionsData {
  list: Array<{
    date: number;
    transactionCount: number;
    blockCount: number;
  }>;
  highestTransactionCount: {
    date: number;
    transactionCount: number;
    blockCount: number;
  };
  lowesTransactionCount: {
    date: number;
    transactionCount: number;
    blockCount: number;
  };
  chainId: string;
}
export interface IDailyAddAddressData {
  list: Array<{
    date: number;
    addressCount: number;
    totalUniqueAddressees: number;
  }>;
  highestIncrease: {
    date: number;
    addressCount: number;
  };
  lowestIncrease: {
    date: number;
    addressCount: number;
  };
  chainId: string;
}

export interface IDailyActiveAddressData {
  list: Array<{
    date: number;
    addressCount: number;
    sendAddressCount: number;
    receiveAddressCount: number;
  }>;
  highestActiveCount: {
    date: number;
    addressCount: number;
    sendAddressCount: number;
    receiveAddressCount: number;
  };
  lowestActiveCount: {
    date: number;
    addressCount: number;
    sendAddressCount: number;
    receiveAddressCount: number;
  };
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
  missedCycle: number;
  cycleRate: string;
  nodeName: string;
  nodeAddress: string;
}
export interface INodeBlockProduceDataItem {
  list: Array<INodeBlockProduceData>;
}

export interface IAvgTxFeeData {
  chainId: string;
  highest: {
    date: number;
    avgFeeUsdt: string;
    avgFeeElf: string;
  };
  lowest: {
    date: number;
    avgFeeUsdt: string;
    avgFeeElf: string;
  };
  list: Array<{
    date: number;
    avgFeeUsdt: string;
    avgFeeElf: string;
  }>;
}

export interface IAvgBlockSizeData {
  chainId: string;
  highest: {
    date: number;
    avgSize: string;
  };
  lowest: {
    date: number;
    avgSize: string;
  };
  list: Array<{
    date: number;
    avgSize: string;
  }>;
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

export interface IDailyBurntData {
  chainId: string;
  highest: {
    date: number;
    burnt: string;
  };
  lowest: {
    date: number;
    burnt: string;
  };
  list: Array<{
    date: number;
    burnt: string;
  }>;
}

export interface IDeployedContractsData {
  chainId: string;
  highest: {
    date: number;
    count: string;
    totalCount: string;
  };
  lowest: {
    date: number;
    count: string;
    totalCount: string;
  };
  list: Array<{
    date: number;
    totalCount: number;
    count: number;
  }>;
}

export const ChartColors = ['#266CD3'];
