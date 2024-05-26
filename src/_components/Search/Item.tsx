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
import { AddressType } from '@_types/common';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';

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
    if (searchType === 'nfts') {
      if (item.type === 2) {
        // collection
        return `/${defaultChain}/nft/${item.symbol}`;
      } else {
        return `/${defaultChain}/nft/item/${item.symbol}`;
      }
    } else if (searchType === 'tokens') {
      return `/${defaultChain}/token/${item.symbol}`;
    } else if (searchType === 'contracts') {
      return `/${defaultChain}/address/${addressFormat(item.address || '', defaultChain)}/${AddressType.Contract}`;
    } else if (searchType === 'accounts') {
      `/${defaultChain}/address/${addressFormat((item as string) || '', defaultChain)}/${AddressType.address}`;
    }

    return '';
  }, [item, defaultChain, searchType]);

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
          <>
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
              <span>{item.name?.slice(0, 10)}</span>
            </EPTooltip>
            <span className="search-result-ul-item-gray">({item.symbol})</span>
            <span className="search-result-ul-item-button">
              <span>$</span>
              <span>{item.price || 0.0}</span>
            </span>
          </>
        ) : searchType === 'contracts' ? (
          <div className="flex-col">
            <div className="leading-20">Name : {item.name || 'Unknown'}</div>
            <div className="search-result-ul-item-gray leading-20">
              <IconFont type="Contract" className="mr-1 size-3" />
              <span>{addressFormat(item.address || '', defaultChain)}</span>
            </div>
          </div>
        ) : (
          <div className="text-sm leading-[22px] text-base-100">
            {addressFormat((item as string) || '', defaultChain)}
          </div>
        )}
      </li>
    </Link>
  );
};

export default Item;
