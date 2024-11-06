import { TChainID } from '@_api/type';
import { AddressType } from '@_types/common';

type HashParams = {
  address: string;
  chain: TChainID;
  hash: string;
  addressType: AddressType;
};

type ChainId = {
  chain: TChainID;
};

type TokenSymbol = {
  tokenSymbol: string;
};

type CollectionSymbol = {
  collectionSymbol: string;
};

type ItemSymbol = {
  itemSymbol: string;
};

type NftCollectionPageParams = ChainId & CollectionSymbol;
type Chain = 'AELF' | 'tDVV' | 'tDVW' | 'multiChain';

type TSearchParamsForTransactionDetail = {
  blockHeight: number;
};

declare global {
  interface Window {
    turnstileCallback: (token: string) => void;
    handleTurnstileError?: () => void;
    handleTurnstileExpired?: () => void;
  }
}
