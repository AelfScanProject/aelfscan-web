import addressFormat from '@_utils/urlUtils';
import { useState } from 'react';
import { IHistory } from './type';
import { formatDate, getAddress } from '@_utils/formatter';
import './index.css';
import { useEffectOnce } from 'react-use';
import clsx from 'clsx';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useMobileAll } from '@_hooks/useResponsive';
import { fetchContractHistory } from '@_api/fetchContact';
import { TChainID } from '@_api/type';
import dayjs from 'dayjs';
import { Skeleton } from 'antd';
import { MULTI_CHAIN } from '@_utils/contant';

export default function History({
  SSRData = [],
  onTabClick,
  chainIds,
}: {
  SSRData: IHistory[];
  onTabClick: (string) => void;
  chainIds: TChainID[];
}) {
  const [history, setHistory] = useState<IHistory[]>(SSRData);
  const isMobile = useMobileAll();
  const router = useRouter();
  const { address } = useParams<{
    chain: string;
    address: string;
  }>();
  const [loading, setLoading] = useState<boolean>(false);
  useEffectOnce(() => {
    async function getData() {
      setLoading(true);
      const res = await fetchContractHistory({
        chainId: chainIds[0],
        address: getAddress(address as string),
      });
      setHistory(res.record || []);
      setLoading(false);
    }
    getData();
  });
  const StepDescription = (props) => {
    const { address, author, codeHash, transactionId, version, blockTime, blockHeight, onTabClick } = props;
    return (
      <>
        <div className="description-item">
          <span className="label">Author: </span>
          <div
            className="cursor-pointer break-all text-primary"
            onClick={() => {
              if (author !== address)
                router.push(`/${MULTI_CHAIN}/address/${addressFormat(author, chainIds[0])}?tab=contract`);
              onTabClick('contract');
            }}>
            {addressFormat(author, chainIds[0])}
          </div>
        </div>
        <div className="description-item">
          <span className="label">Code Hash: </span>
          <div className="value">{codeHash}</div>
        </div>
        <div className="description-item">
          <span className="label">Version: </span>
          <div className="value">{version ? version : '-'}</div>
        </div>
        <div className="description-item">
          <span className="label">Transaction Hash: </span>
          <Link className="break-words text-primary" href={`/${chainIds[0]}/tx/${transactionId}`}>
            {transactionId}
          </Link>
        </div>
        <div className="description-item">
          <span className="label">Date Time : </span>
          <div className="value">{formatDate(dayjs(blockTime).unix().valueOf(), 'Date Time (UTC)')}</div>
        </div>
        <div className="description-item">
          <span className="label">Block: </span>
          <Link className="break-words text-primary" href={`/${chainIds[0]}/block/${blockHeight}`}>
            {blockHeight}
          </Link>
        </div>
      </>
    );
  };
  const items = history?.map((v, index) => {
    return {
      key: v.transactionId,
      title: (
        <>
          <div className={clsx('active-bot', 'history-bot')}></div>
          <div className="header-title">{v.contractOperationType}</div>
        </>
      ),
      description: StepDescription({ ...v, isLast: index === 0, onTabClick }),
    };
  });
  return loading ? (
    <div className="p-2">
      <Skeleton active />
    </div>
  ) : (
    <div className="history-pane">
      {items.map((item, index) => {
        return (
          <div key={item.key} className="history-item">
            <div className="header">{item.title}</div>
            <div
              className={clsx(
                index === items.length - 1 && 'history-description-last',
                'history-description',
                isMobile && 'history-description-mobile',
              )}>
              {item.description}
            </div>
          </div>
        );
      })}
    </div>
  );
}
