import { numberFormatter, thousandsNumber } from '@_utils/formatter';
import TokensList from './List';
import clsx from 'clsx';
import { useMobileAll } from '@_hooks/useResponsive';
import { IAddressTokensDetail } from '@_types/commonDetail';

export default function Tokens({ tokenDetail }: { tokenDetail: IAddressTokensDetail }) {
  // const isMobile = useMobileAll();
  return (
    <div className="token-container">
      {/* <div className={clsx(isMobile && 'flex-col', 'token-header mx-4 flex border-b border-color-divider pb-4')}>
        <div className="list-items mr-4 box-border w-[197px] pr-4">
          <div className="item-label font10px leading-[18px] text-base-200">NET WORTH IN USD</div>
          <div className="item-value text-sm leading-[22px] text-base-100">
            <span className="inline-block text-sm leading-[22px] text-base-100">
              {typeof tokenDetail.totalValueOfUsd === 'number'
                ? `${thousandsNumber(tokenDetail.totalValueOfUsd)}`
                : '-'}
            </span>
            <span
              className={clsx(
                'ml-1 inline-block text-xs leading-5',
                tokenDetail.totalValueOfUsdChangeRate >= 0 ? '!text-positive' : 'text-red-500',
              )}>
              (
              {typeof tokenDetail.totalValueOfUsdChangeRate === 'number'
                ? `${tokenDetail.totalValueOfUsdChangeRate}%`
                : '-'}
              )
            </span>
          </div>
        </div>
        <div className={clsx(isMobile && 'mt-4 !pl-0', 'list-items pl-4')}>
          <div className="item-label font10px leading-[18px] text-base-200">NET WORTH IN ELF</div>
          <div className="item-value text-sm leading-[22px] text-base-100">
            {numberFormatter(tokenDetail.totalValueOfElf || '', '')}
          </div>
        </div>
      </div> */}
      <TokensList />
    </div>
  );
}
