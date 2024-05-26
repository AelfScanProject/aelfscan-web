import SourceCode, { IContractSourceCode } from './sourceCode';
import clsx from 'clsx';
import { useMobileAll } from '@_hooks/useResponsive';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchContractCode } from '@_api/fetchContact';
import { TChainID } from '@_api/type';
import { getAddress } from '@_utils/formatter';
import { Skeleton } from 'antd';
export default function Contract() {
  const isMobile = useMobileAll();
  const { chain, address } = useParams<{ chain: TChainID; address: string }>();
  const [loading, setLoading] = useState<boolean>();
  const [contractInfo, setContractInfo] = useState<IContractSourceCode>();
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchContractCode({
        chainId: chain,
        address: getAddress(address),
      });
      setContractInfo(data);
    } finally {
      setLoading(false);
    }
  }, [address, chain]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return loading ? (
    <div className="p-2">
      <Skeleton active />
    </div>
  ) : (
    <div className="contract-container">
      <div className={clsx(isMobile && 'flex-col', 'contract-header mx-4 flex border-b border-color-divider pb-4')}>
        <div className="list-items mr-4 w-[197px] pr-4">
          <div className="item-label font10px leading-[18px] text-base-200">CONTRACT NAME</div>
          <div className="item-value text-sm leading-[22px] text-base-100">{contractInfo?.contractName}</div>
        </div>
        <div className={clsx(isMobile && 'mt-4 !pl-0', 'list-items pl-4')}>
          <div className="item-label font10px leading-[18px] text-base-200">CONTRACT VERSION</div>
          <div className="item-value text-sm leading-[22px] text-base-100">{contractInfo?.contractVersion}</div>
        </div>
      </div>
      {contractInfo && <SourceCode contractInfo={contractInfo} />}
      {/* <Protocol /> */}
    </div>
  );
}
