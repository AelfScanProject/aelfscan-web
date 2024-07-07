import request from '@_api';
import {
  IAelfAVGBlockDurationData,
  IAelfDailyCycleCountData,
  IAvgBlockSizeData,
  IAvgTxFeeData,
  IBlockProductionRateData,
  IDailyActiveAddressData,
  IDailyAddAddressData,
  IDailyBlockRewardsData,
  IDailyBurntData,
  IDailyPriceDData,
  IDailyTransactionsData,
  IDeployedContractsData,
  INodeBlockProduceDataItem,
} from '@app/[chain]/chart/type';

export async function fetchBlockProduceRate(params: { chainId: string }): Promise<IBlockProductionRateData> {
  const result = await request.chart.getBlockProduceRate({
    params: params,
  });
  const data = result?.data;
  return data;
}
export async function fetchAvgBlockDuration(params: { chainId: string }): Promise<IAelfAVGBlockDurationData> {
  const result = await request.chart.getAvgBlockDuration({
    params: params,
  });
  const data = result?.data;
  return data;
}
export async function fetchCycleCount(params: { chainId: string }): Promise<IAelfDailyCycleCountData> {
  const result = await request.chart.getCycleCount({
    params: params,
  });
  const data = result?.data;
  return data;
}
export async function fetchUniqueAddresses(params: { chainId: string }): Promise<IDailyAddAddressData> {
  const result = await request.chart.getUniqueAddresses({
    params: params,
  });
  const data = result?.data;
  return data;
}
export async function fetchDailyActiveAddresses(params: { chainId: string }): Promise<IDailyActiveAddressData> {
  const result = await request.chart.getDailyActiveAddresses({
    params: params,
  });
  const data = result?.data;
  return data;
}
export async function fetchDailyTransactions(params: { chainId: string }): Promise<IDailyTransactionsData> {
  const result = await request.chart.getDailyTransactions({
    params: params,
  });
  const data = result?.data;
  return data;
}

export async function fetchNodeBlockProduce(params: {
  chainId: string;
  startDate: number;
  endDate: number;
}): Promise<INodeBlockProduceDataItem> {
  const result = await request.chart.getNodeBlockProduce({
    params: params,
  });
  const data = result?.data;
  return data;
}

export async function fetchDailyElfPrice(params: { chainId: string }): Promise<IDailyPriceDData> {
  const result = await request.chart.getDailyElfPrice({
    params: params,
  });
  const data = result?.data;
  return data;
}

export async function fetchDailyAvgTransactionFee(params: { chainId: string }): Promise<IAvgTxFeeData> {
  const result = await request.chart.getDailyAvgTransactionFee({
    params: params,
  });
  const data = result?.data;
  return data;
}

export async function fetchDailyBlockReward(params: { chainId: string }): Promise<IDailyBlockRewardsData> {
  const result = await request.chart.getDailyBlockReward({
    params: params,
  });
  const data = result?.data;
  return data;
}

export async function fetchDailyTotalBurnt(params: { chainId: string }): Promise<IDailyBurntData> {
  const result = await request.chart.getDailyTotalBurnt({
    params: params,
  });
  const data = result?.data;
  return data;
}

export async function fetchDailyDeployContract(params: { chainId: string }): Promise<IDeployedContractsData> {
  const result = await request.chart.getDailyDeployContract({
    params: params,
  });
  const data = result?.data;
  return data;
}

export async function fetchDailyAvgBlockSize(params: { chainId: string }): Promise<IAvgBlockSizeData> {
  const result = await request.chart.getDailyAvgBlockSize({
    params: params,
  });
  const data = result?.data;
  return data;
}
