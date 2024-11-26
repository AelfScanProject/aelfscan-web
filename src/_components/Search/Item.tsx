import { useSearchContext } from './SearchProvider';
import { setHighlighted } from './action';
import { TSingle, TType } from './type';
import clsx from 'clsx';
import IconFont from '@_components/IconFont';
import TokenImage from '@app/[chain]/tokens/_components/TokenImage';
import EPTooltip from '@_components/EPToolTip';
import addressFormat from '@_utils/urlUtils';
import Link from 'next/link';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { MULTI_CHAIN } from '@_utils/contant';

const Item = ({
  index,
  item,
  searchType,
  clearHandler,
}: {
  index: number;
  searchType: TType;
  item: Partial<TSingle>;
  clearHandler: () => void;
}) => {
  const { state, dispatch } = useSearchContext();
  const { highLight } = state;
  const isHighlighted = highLight && index === highLight.idx;
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
        return `/nft/?chainId=${MULTI_CHAIN}&&collectionSymbol=${item.symbol}`;
      } else {
        return `/nftItem?chainId=${MULTI_CHAIN}&&itemSymbol=${item.symbol}`;
      }
    } else if (searchType === 'tokens') {
      return `/${MULTI_CHAIN}/token/${item.symbol}`;
    } else if (searchType === 'contracts') {
      return `/${chainIds && chainIds[0]}/address/${addressFormat(item.address || '', chainIds && chainIds[0])}`;
    } else if (searchType === 'accounts') {
      return `/${MULTI_CHAIN}/address/${addressFormat(item.address || '', chainIds && chainIds.sort()[0])}`;
    }

    return '';
  }, [searchType, item]);
  function itemMouseDownHandler() {
    // dispatch(selectItem(item));
    clearHandler();
    router.push(url);
  }

  return (
    <Link onClick={clearHandler} href={url}>
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
                className="!rounded-[50%] !border-border"
                token={{
                  symbol: item.symbol,
                  imageUrl: item.image,
                }}
              />
            </span>
            <EPTooltip mode="dark" title={item.name}>
              <span className="inline-block w-full flex-1 truncate text-sm text-foreground">{item.name}</span>
            </EPTooltip>
            <span className="search-result-ul-item-gray ">({item.symbol})</span>
            <span className="search-result-ul-item-button">
              <span>$</span>
              <span>{item.price || 0.0}</span>
            </span>
          </div>
        ) : searchType === 'contracts' ? (
          <div className="flex-1 flex-col truncate">
            <div className="text-sm text-foreground">Name : {item.name || 'Unknown'}</div>
            <div className="search-result-ul-item-gray w-full flex-1 truncate leading-20">
              <IconFont type="ContractIcon" className="mr-1 size-4" />
              <span>{addressFormat(item.address || '', item.chainIds?.sort()[0])}</span>
            </div>
          </div>
        ) : (
          <div className="max-w-full flex-1 truncate text-sm text-foreground">
            {searchType === 'transaction'
              ? item?.transactionId
              : searchType === 'blocks'
                ? item.blockHeight
                : addressFormat(item.address || '', item.chainIds?.sort()[0])}
          </div>
        )}
      </li>
    </Link>
  );
};

export default Item;
