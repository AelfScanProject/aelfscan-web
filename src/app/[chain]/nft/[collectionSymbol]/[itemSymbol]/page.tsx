/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 16:22:39
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-01 17:11:41
 * @Description: collection item
 */
import { notFound } from 'next/navigation';
import './index.css';
// import request from '@_api';
import NFTDetails from './NFTDetails';
import { ChainId, CollectionSymbol, ItemSymbol } from 'global';
import { fetchServerCollectionItemDetail } from '@_api/fetchNFTS';
export default async function NFTDetailsPage({ params }: { params: ChainId & CollectionSymbol & ItemSymbol }) {
  if (!params.collectionSymbol) {
    return notFound();
  }
  const { chain, itemSymbol } = params;
  const [overview] = await Promise.all([
    fetchServerCollectionItemDetail({
      chainId: chain,
      symbol: itemSymbol,
    }),
  ]);

  return <NFTDetails overview={overview} />;
}
