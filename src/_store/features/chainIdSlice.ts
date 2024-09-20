import { createSlice } from '@reduxjs/toolkit';
import { AppState } from '@_store';
import { HYDRATE } from 'next-redux-wrapper';
import { ChainItem } from '@_types';
import { ChainId } from '@_utils/contant';
import { Chain } from 'global';
import {
  IBlockchainOverviewResponse,
  IBlocksResponseItem,
  ITopTokensItem,
  ITransactionsResponseItem,
} from '@_api/type';
import { ITPSData } from '@pageComponents/home/_components/TPSChart';
import { TSearchValidator } from '@_components/Search/type';

export interface IChainState {
  chainArr: ChainItem[];
  defaultChain: Chain | undefined;
  tokenInfo: IBlockchainOverviewResponse | null;
  blocks: {
    loading: boolean;
    data: IBlocksResponseItem[];
  };
  transactions: {
    loading: boolean;
    data: ITransactionsResponseItem[];
  };
  tokens: {
    loading: boolean;
    data: ITopTokensItem[];
  };
  tpsData: {
    loading: boolean;
    data: ITPSData | null;
  };
  homeFilters: TSearchValidator;
}
const initialState: IChainState = {
  chainArr: [],
  defaultChain: ChainId,
  tokenInfo: null,
  blocks: {
    loading: true,
    data: [],
  },
  transactions: {
    loading: true,
    data: [],
  },
  tokens: {
    loading: true,
    data: [],
  },
  tpsData: {
    loading: true,
    data: null,
  },
  homeFilters: [],
};

export const chainIdSlice = createSlice({
  name: 'getChainId',
  initialState,
  reducers: {
    setDefaultChain: (state, action) => {
      state.defaultChain = action.payload;
    },
    setChainArr: (state, action) => {
      state.chainArr = action.payload;
    },
    setTokenInfo: (state, action) => {
      state.tokenInfo = action.payload;
    },
    setHomeBlocks: (state, action) => {
      state.blocks = action.payload;
    },
    setHomeTransactions: (state, action) => {
      state.transactions = action.payload;
    },
    setHomeTokens: (state, action) => {
      state.tokens = action.payload;
    },
    setHomeTpsData: (state, action) => {
      state.tpsData = action.payload;
    },
    setHomeFilters: (state, action) => {
      state.homeFilters = action.payload;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});
export const {
  setDefaultChain,
  setChainArr,
  setTokenInfo,
  setHomeBlocks,
  setHomeTransactions,
  setHomeTokens,
  setHomeTpsData,
  setHomeFilters,
} = chainIdSlice.actions;
export const chainInfo = (state: AppState) => state.getChainId;
export default chainIdSlice.reducer;
