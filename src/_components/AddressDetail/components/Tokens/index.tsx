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
      <div className="token-header  flex flex-col  gap-4 px-4 pb-6 pt-2 min-769:flex-row min-769:items-center min-769:gap-6 min-[1025px]:gap-6">
        <TokensValue
          total={totalTokenValue}
          main={mainTokenValue}
          side={sideTokenValue}
          title="Total Value"
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
        <div className="flex items-center gap-4 min-769:gap-6 min-[1025px]:gap-6">
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
      <div className={`${hidden ? 'block' : 'hidden'}`}>
        <TokensList totalTokenValue={totalTokenValue} totalTokenValueOfElf={totalTokenValueOfElf} />
      </div>
    </div>
  );
}
