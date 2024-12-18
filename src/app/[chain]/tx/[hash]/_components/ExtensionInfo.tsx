import DetailContainer from '@_components/DetailContainer';
import { useMemo } from 'react';
import DollarCurrencyRate from '@_components/DollarCurrencyRate';
import Link from 'next/link';
import CodeBlock from '@_components/CodeBlock';
import SizeBytes from '@_components/SizeBytes';
import clsx from 'clsx';
import { useMobileAll } from '@_hooks/useResponsive';
import { ITransactionDetailData } from '@_api/type';
import { useParams } from 'next/navigation';

export default function ExtensionInfo({ data }: { data: ITransactionDetailData }) {
  const isMobile = useMobileAll();
  const { chain } = useParams();
  const renderInfo = useMemo(() => {
    return [
      {
        label: 'Transaction Fee ',
        row: !data.transactionFees?.length,
        tip: 'The amount of token paid to process the transaction in ELF and fiat value. The transaction fee equals the Size fee + Method Fee - Exempted Fee.',
        value: (
          <div className={clsx('flex', isMobile ? 'flex-col items-start' : 'items-center')}>
            {data.transactionFees.length > 0
              ? data.transactionFees.map((transactionFee, idx) => {
                  return (
                    <div
                      key={idx}
                      className={clsx('flex items-center', idx !== 0 && !isMobile && 'border-0 border-l bg-border')}>
                      <span>{transactionFee.amountString}</span>
                      <span>{transactionFee.symbol}</span>
                      <DollarCurrencyRate nowPrice={transactionFee.nowPrice} tradePrice={transactionFee.tradePrice} />
                    </div>
                  );
                })
              : '-'}
          </div>
        ),
      },
      {
        label: 'Resources Fee ',
        row: !data.resourcesFee,
        tip: 'The amount of resource tokens paid to process the transaction.',
        value: <span>{data.resourcesFee ? data.resourcesFee : '-'}</span>,
      },
      {
        label: 'divider1',
        value: 'divider',
      },
      {
        label: 'Burnt Fee ',
        row: !data.burntFees?.length,
        tip: 'Each transaction will burn 10% of its Size Fee.',
        value: (
          <div className={clsx('flex', isMobile ? 'flex-col items-start' : 'items-center')}>
            {data.burntFees.length > 0
              ? data.burntFees.map((burntFee, idx) => {
                  return (
                    <div
                      key={idx}
                      className={clsx('flex items-center', idx !== 0 && !isMobile && 'border-0 border-l bg-border')}>
                      <span>{burntFee.amountString}</span>
                      <span>{burntFee.symbol}</span>
                      <DollarCurrencyRate nowPrice={burntFee.nowPrice} tradePrice={burntFee.tradePrice} />
                    </div>
                  );
                })
              : '-'}
          </div>
        ),
      },
      {
        label: 'divider2',
        value: 'divider',
      },
      {
        label: 'Transaction Ref Block Number ',
        tip: 'The block number referenced by this transaction at the time of its creation.',
        value: <Link href={`/${chain}/block/${data.transactionRefBlockNumber}`}>{data.transactionRefBlockNumber}</Link>,
      },
      {
        label: 'Transaction Ref Block Prefix ',
        tip: 'The hash header referenced by this transaction at the time of its creation.',
        value: <span>{data.transactionRefBlockPrefix || '-'}</span>,
      },
      {
        label: 'Transaction Parameters ',
        tip: 'The input parameters of the transaction.',
        value: <CodeBlock value={data.transactionParams} />,
      },
      {
        label: 'divider3',
        value: 'divider',
      },
      {
        label: 'Return Value ',
        row: !data.returnValue,
        tip: 'The output parameters of the transaction.',
        value: <span>{data.returnValue || '-'}</span>,
      },
      {
        label: 'Transaction Signature ',
        tip: 'The signature of the transaction is used to verify the authenticity and integrity of the transaction, ensuring its security and immutability.',
        value: <span>{data.transactionSignature || '-'}</span>,
      },
      {
        label: 'Transaction Size ',
        tip: 'The size of the transaction.',
        value: <SizeBytes size={Number(data.transactionSize)} />,
      },
      {
        label: 'divider3',
        value: 'divider',
      },
    ];
  }, [data, isMobile, chain]);
  return <DetailContainer infoList={renderInfo} />;
}
