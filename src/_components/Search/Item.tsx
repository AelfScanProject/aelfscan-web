import { useSearchContext } from './SearchProvider';
import { setHighlighted, selectItem } from './action';
import { TSingle, TType } from './type';
import clsx from 'clsx';
import IconFont from '@_components/IconFont';
import TokenImage from '@app/[chain]/tokens/_components/TokenImage';
import { useAppSelector } from '@_store';
import EPTooltip from '@_components/EPToolTip';
import addressFormat from '@_utils/urlUtils';
import Link from 'next/link';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import BasicTag from '@_components/BasicTag';

const Item = ({ index, item, searchType }: { index: number; searchType: TType; item: Partial<TSingle> }) => {
  const { state, dispatch } = useSearchContext();
  const { highLight } = state;
  const isHighlighted = highLight && index === highLight.idx;
  const { defaultChain } = useAppSelector((state) => state.getChainId);
  const router = useRouter();

  function itemMouseEnterHandler() {
    dispatch(setHighlighted(index));
  }

  const url = useMemo(() => {
    const { transactionId, chainIds, blockHeight } = item;
    if (searchType === 'transaction') {
      return `/${chainIds && chainIds[0]}/tx/${transactionId}`;
    } else if (searchType === 'blocks') {
      return `/${chainIds && chainIds[0]}/block/${blockHeight}`;
    } else if (searchType === 'nfts') {
      if (item.type === 2) {
        // collection
        return `/nft/?chainId=${defaultChain}&&collectionSymbol=${item.symbol}`;
      } else {
        return `/nftItem?chainId=${chainIds && chainIds[0]}&&itemSymbol=${item.symbol}`;
      }
    } else if (searchType === 'tokens') {
      return `/${defaultChain}/token/${item.symbol}`;
    } else if (searchType === 'contracts') {
      return `/${chainIds && chainIds[0]}/address/${addressFormat(item.address || '', defaultChain)}`;
    } else if (searchType === 'accounts') {
      return `/${defaultChain}/address/${addressFormat(item.address || '', defaultChain)}`;
    }

    return '';
  }, [searchType, item, defaultChain]);
  function itemMouseDownHandler() {
    dispatch(selectItem(item));
    router.push(url);
  }

  return (
    <Link className="text-base-100" href={url}>
      <li
        onMouseDown={itemMouseDownHandler}
        onMouseMove={itemMouseEnterHandler}
        data-sort-idx={index}
        className={clsx('search-result-ul-item', isHighlighted && 'bg-[#D8DDE5]')}>
        {searchType === 'nfts' || searchType === 'tokens' ? (
          <div className="flex flex-wrap items-center gap-1">
            {item.address && <span className="search-result-ul-item-circle">C</span>}
            <span className="size-6">
              <TokenImage
                className="!rounded"
                token={{
                  symbol: item.symbol,
                  imageUrl: item.image,
                }}
              />
            </span>
            <EPTooltip mode="dark" title={item.name}>
              <span>{item.name && item.name?.length > 10 ? item.name?.slice(0, 10) + '...' : item.name}</span>
            </EPTooltip>
            <span className="search-result-ul-item-gray">({item.symbol})</span>
            <span className="search-result-ul-item-button">
              <span>$</span>
              <span>{item.price || 0.0}</span>
            </span>
          </div>
        ) : searchType === 'contracts' ? (
          <div className="flex-1 flex-col">
            <div className="leading-20">Name : {item.name || 'Unknown'}</div>
            <div className="search-result-ul-item-gray leading-20">
              <IconFont type="Contract" className="mr-1 size-3" />
              <span>{addressFormat(item.address || '', defaultChain)}</span>
            </div>
          </div>
        ) : (
          <div className="max-w-full flex-1 break-words text-sm leading-[22px] text-base-100">
            {searchType === 'transaction'
              ? item?.transactionId
              : searchType === 'blocks'
                ? item.blockHeight
                : addressFormat(item.address || '', defaultChain)}
          </div>
        )}
        <BasicTag chainIds={item.chainIds || []} />
      </li>
    </Link>
  );
};

export default Item;
