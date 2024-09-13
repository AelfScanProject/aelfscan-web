import { TChainID } from '@_api/type';
import { ReactNode, PropsWithChildren } from 'react';

/*
 * @Author: aelf-lxy
 * @Date: 2023-08-09 11:15:16
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-17 14:51:01
 * @Description: type file for Search Component
 */
export type TSingle = {
  image: string;
  name: string;
  symbol: string;
  price: number;
  unit: string;
  address: string;
  transactionId: string;
  sortIdx: number;
  chainIds: TChainID[];
  blockHeight: number;
  type?: number;
};

export type TItem = {
  total: number;
  list: Partial<TSingle>[];
};

export enum FilterTypeEnum {
  AllFilter,
  Tokens,
  Accounts,
  Contracts,
  Nfts,
}

export type TType = 'tokens' | 'nfts' | 'accounts' | 'contracts' | 'transaction' | 'block';

interface ITokens {
  image: string;
  name: string;
  chainIds: TChainID[];
  symbol: string;
  price: number;
  type?: number;
}

interface IContactItem {
  name: string;
  address: string;
  chainIds: TChainID[];
}

interface IAccountsItem {
  chainIds: TChainID[];
  address: string;
}

export interface ISearchResponse {
  tokens: ITokens[];
  nfts: ITokens[];
  accounts: IAccountsItem[];
  contracts: IContactItem[];
  block?: {
    blockHeight: number;
    blockHash: string;
    chainIds: TChainID[];
  };
  transaction: {
    transactionId: string;
    blockHeight: number;
    blockHash: string;
    chainIds: TChainID[];
  };
}

export type TSearchList = ISearchResponse;

export type TFormatSearchList = {
  dataWithOrderIdx?: TSearchList;
  allList: Partial<TSingle>[];
};

export type TValidator = {
  filterInfo: string;
  filterType: number;
  limitNumber?: number;
};

export type TSearchValidator = Array<TValidator>;

export type TSearchPanelProps = {
  id: string;
  loading: boolean;
  searchHandler: () => void;
  children?: ReactNode;
};

export type TSearchState = {
  // entered keywords
  query: string;
  // selected item
  selectedItem: Partial<TSingle>;
  // query result
  queryResultData: TFormatSearchList;
  // item need to be highlight
  highLight: {
    idx: number;
    txt: string;
  };
  // identifies whether to display the listbox
  canShowListBox: boolean;
  // filter flag
  filterType?: TValidator;
};

export type BasicActions<T = string> = {
  dispatch: (actions: { type: T; payload: any }) => void;
};

export interface ISearchProps {
  lightMode?: boolean;
  isMobile?: boolean;
  searchValidator?: TSearchValidator;
  placeholder?: string;
  searchIcon?: boolean | React.ReactNode;
  onSearchButtonClickHandler?: (query: string) => void;
  searchButton?: boolean;
  enterIcon?: boolean;
  label: string;
  deleteIcon?: boolean;
  searchWrapClassNames?: string;
  searchInputClassNames?: string;
}

export enum SearchActions {
  SET_QUERY_RESULT = 'SET_QUERY_RESULT',
  SET_QUERY = 'SET_QUERY',
  SELECT_ITEM = 'SELECT_ITEM',
  CLEAR = 'CLEAR',
  SET_HIGHLIGHTED = 'SET_HIGHLIGHTED',
  PREV_HIGHLIGHTED = 'PREV_HIGHLIGHTED',
  NEXT_HIGHLIGHTED = 'NEXT_HIGHLIGHTED',
  SET_FILTER_TYPE = 'SET_FILTER_TYPE',
}
