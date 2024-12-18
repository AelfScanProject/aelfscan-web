import TokensList from './List';
import { IPortfolio } from '@_types/commonDetail';
import { TChainID } from '@_api/type';
import TokensValue from './TokenValue';
import RefreshButton from './RefreshButtonCom';
import useRefreshDetail from './hooks/useRefreshDetail';
import SwitchButton from './SwitchButton';
import { useState } from 'react';

export default function Tokens({ portfolio, chainIds }: { portfolio: IPortfolio; chainIds: TChainID[] }) {
  const { data, loading, refreshData } = useRefreshDetail(portfolio);

  const {
    totalTokenValue,
    totalTokenCount,
    mainTokenCount,
    sideTokenCount,
    mainTokenValue,
    sideTokenValue,
    totalTokenValueOfElf,
  } = data;

  const [hidden, setHidden] = useState(false);

  return (
    <div className="token-container">
      <div className="token-header  flex flex-col  gap-4 px-4 pb-6 pt-2 md:flex-row md:items-center md:gap-6 min-[1025px]:gap-6">
        <TokensValue
          total={totalTokenValue}
          main={mainTokenValue}
          side={sideTokenValue}
          title="Total value"
          chainIds={chainIds}
          loading={loading}
          dolar={true}
        />
        <TokensValue
          total={totalTokenCount}
          main={mainTokenCount}
          side={sideTokenCount}
          title="Total token"
          suffix="Tokens"
          chainIds={chainIds}
          loading={loading}
        />
        <div className="flex items-center gap-4 md:gap-6 min-[1025px]:gap-6">
          <RefreshButton onClick={refreshData} />
          <SwitchButton
            hidden={hidden}
            buttonProps={{
              onClick: () => {
                setHidden(!hidden);
              },
            }}
          />
        </div>
      </div>
      <div
        className={`${hidden ? 'visible overflow-visible' : 'invisible h-0 min-h-0 overflow-hidden'} transition-height ease-[cubic-bezier(0.4, 0, 0.2, 1)] delay-0 duration-300`}>
        {/* <TokensList totalTokenValue={totalTokenValue} totalTokenValueOfElf={totalTokenValueOfElf} /> */}
      </div>
    </div>
  );
}
