import { createSlice } from '@reduxjs/toolkit';
import { AppState } from '@_store';
import { HYDRATE } from 'next-redux-wrapper';
import { ChainItem } from '@_types';
import { ChainId } from '@_utils/contant';
import { Chain } from 'global';
import { IBlockchainOverviewResponse } from '@_api/type';

export interface IChainState {
  chainArr: ChainItem[];
  defaultChain: Chain | undefined;
  tokenInfo: IBlockchainOverviewResponse | null;
}
const initialState: IChainState = {
  chainArr: [],
  defaultChain: ChainId,
  tokenInfo: null,
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
export const { setDefaultChain, setChainArr, setTokenInfo } = chainIdSlice.actions;
export const chainInfo = (state: AppState) => state.getChainId;
export default chainIdSlice.reducer;
