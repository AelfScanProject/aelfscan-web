/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 20:06:58
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-03 17:24:22
 * @Description: the paths to the request module
 */
import { RequestWithParams } from './server';

const BASE_API = '/api'; // server local
const SERVER_BASE_API = `${process.env.NEXT_PUBLIC_API_URL}/api`; // server
const Block_API_List = {
  getBlockList: `${BASE_API}/app/blockchain/blocks`,
  getLatestBlocksList: `${BASE_API}/app/blockchain/latestBlocks`,
  getServerBlockList: `${SERVER_BASE_API}/app/blockchain/blocks`,
  getBlockDetail: `${BASE_API}/app/blockchain/blockDetail`,
  getServerBlockDetail: `${SERVER_BASE_API}/app/blockchain/blockDetail`,
  query: `${BASE_API}/app/blockchain/search`,
};

const Transaction_API_List = {
  getTransactionList: `${BASE_API}/app/blockchain/transactions`,
  getLatestTransactionList: `${BASE_API}/app/blockchain/latestTransactions`,
  getServerTransactionList: `${SERVER_BASE_API}/app/blockchain/transactions`,
  getTransactionDetail: `${SERVER_BASE_API}/app/blockchain/transactionDetail`,
};

const Token_API_List = {
  getTokenList: `${BASE_API}/app/token/list`,
  getServerTokenList: `${SERVER_BASE_API}/app/token/list`,
  getTokenDetail: `${SERVER_BASE_API}/app/token/detail`,
  getTokenDetailTransfers: `${BASE_API}/app/token/transfers`,
  getTokenDetailHolders: `${BASE_API}/app/token/holders`,
};

const NFT_API_List = {
  getNFTSList: `${BASE_API}/app/token/nft/collection-list`,
  getServerNFTSList: `${SERVER_BASE_API}/app/token/nft/collection-list`,
  getServerCollectionDetail: `${SERVER_BASE_API}/app/token/nft/collection-detail`,
  getCollectionDetail: `${BASE_API}/app/token/nft/collection-detail`,
  getCollectionItemDetail: `${BASE_API}/app/token/nft/item-detail`,
  getServerCollectionItemDetail: `${SERVER_BASE_API}/app/token/nft/item-detail`,
  getNFTTransfers: `${BASE_API}/app/token/nft/transfers`,
  getNFTHolders: `${BASE_API}/app/token/nft/holders`,
  getNFTItemHolders: `${BASE_API}/app/token/nft/item-holders`,
  getNFTItemActivity: `${BASE_API}/app/token/nft/item-activity`,
  getNFTInventory: `${BASE_API}/app/token/nft/inventory`,
};

const ADDRESS_API_LIST = {
  getContractList: `${BASE_API}/app/address/contracts`,
  getServerContractList: `${SERVER_BASE_API}/app/address/contracts`,
  getTopAccounts: `${BASE_API}/app/address/accounts`,
  getAccountTransfers: `${BASE_API}/app/address/transfers`,
  getAccountsDetailTokens: `${BASE_API}/app/address/tokens`,
  getAccountsDetailNFTAssets: `${BASE_API}/app/address/nft-assets`,
  getContractHistory: `${BASE_API}/app/address/contract/history`,
  getContractEvents: `${BASE_API}/app/address/contract/events`,
  getContractCode: `${BASE_API}/app/address/contract/file`,
  uploadContractCode: `${BASE_API}/contractfile/upload`,
  getServerTopAccounts: `${SERVER_BASE_API}/app/address/accounts`,
  getServerAccountDetail: `${SERVER_BASE_API}/app/address/detail`,
};

const Common_API_List = {
  getPrice: '',
  getSearchFilter: `${BASE_API}/app/blockchain/filters`,
  getAdsDetail: `${BASE_API}/app/ads/detail`,
  getAdsDetailList: `${BASE_API}/app/ads/detail/list`,
  getLatestTwitter: `${BASE_API}/app/ads/LatestTwitter`,
  getBannerAdsDetail: `${BASE_API}/app/ads/banner/detail`,
  getServerBannerAdsDetail: `${SERVER_BASE_API}/app/ads/banner/detail`,
};

const CHART_API_LIST = {
  getBlockProduceRate: `${BASE_API}/app/statistics/blockProduceRate`,
  getAvgBlockDuration: `${BASE_API}/app/statistics/avgBlockDuration`,
  getCycleCount: `${BASE_API}/app/statistics/cycleCount`,
  getUniqueAddresses: `${BASE_API}/app/statistics/uniqueAddresses`,
  getDailyTransactions: `${BASE_API}/app/statistics/dailyTransactions`,
  getMonthActiveAddresses: `${BASE_API}/app/statistics/monthlyActiveAddresses`,
  getDailyActiveAddresses: `${BASE_API}/app/statistics/dailyActiveAddresses`,
  getNodeBlockProduce: `${BASE_API}/app/statistics/nodeBlockProduce`,
  getDailyElfPrice: `${BASE_API}/app/statistics/dailyElfPrice`,
  getDailyAvgTransactionFee: `${BASE_API}/app/statistics/dailyAvgTransactionFee`,
  getDailyBlockReward: `${BASE_API}/app/statistics/dailyBlockReward`,
  getDailyTotalBurnt: `${BASE_API}/app/statistics/dailyTotalBurnt`,
  getDailyDeployContract: `${BASE_API}/app/statistics/dailyDeployContract`,
  getDailyAvgBlockSize: `${BASE_API}/app/statistics/dailyAvgBlockSize`,
  getDailyContractCall: `${BASE_API}/app/statistics/dailyContractCall`,
  getTopContractCall: `${BASE_API}/app/statistics/topContractCall`,
  getDailyTxFee: `${BASE_API}/app/statistics/dailyTxFee`,
  getDailySupplyGrowth: `${BASE_API}/app/statistics/dailySupplyGrowth`,
  getDailyMarketCap: `${BASE_API}/app/statistics/dailyMarketCap`,
  getDailyStaked: `${BASE_API}/app/statistics/dailyStaked`,
  getDailyHolder: `${BASE_API}/app/statistics/dailyHolder`,
  getDailyTvl: `${BASE_API}/app/statistics/dailyTvl`,
};

const CMS_API_List = {
  getGlobalConfig: `${process.env.NEXT_PUBLIC_CMS_URL}/items/globalConfig?fields%5B%5D=*&fields%5B%5D=networkList.network_id.*&deep%5BnetworkList%5D%5B_sort%5D=-network_id.index&fields%5B%5D=headerMenuList.headerMenu_id.*&fields%5B%5D=headerMenuList.headerMenu_id.children.*&deep%5BheaderMenuList%5D%5B_sort%5D=-headerMenu_id.index&deep%5BheaderMenuList%5D%5BheaderMenu_id%5D%5Bchildren%5D%5B_sort%5D=-index&fields%5B%5D=footerMenuList.footerMenu_id.*&fields%5B%5D=footerMenuList.footerMenu_id.children.*&deep%5BfooterMenuList%5D%5B_sort%5D=-footerMenu_id.index&deep%5BfooterMenuList%5D%5BfooterMenu_id%5D%5Bchildren%5D%5B_sort%5D=-index&fields%5B%5D=chainList.chainList_id.*&deep%5BchainList%5D%5B_sort%5D=-chainList_id.index`,
};

export const Socket_API_List = {
  overview: '/signalr-hubs/overview',
};

export const API_List = {
  block: Block_API_List,
  tx: Transaction_API_List,
  common: Common_API_List,
  cms: CMS_API_List,
  token: Token_API_List,
  nfts: NFT_API_List,
  address: ADDRESS_API_LIST,
  chart: CHART_API_LIST,
};

export type REQUEST_FUNCTION = (opt?: RequestWithParams) => Promise<any>;

export type REQUEST_API_TYPE = {
  [X in keyof typeof API_List]: {
    [Y in keyof (typeof API_List)[X]]: REQUEST_FUNCTION;
  };
};
