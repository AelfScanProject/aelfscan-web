import DetailContainer from '@_components/DetailContainer';
import { useMemo } from 'react';
import TransactionsStatus from '@_components/TransactionsStatus';
import ConfirmStatus from '@_components/ConfirmedStatus';
import IconFont from '@_components/IconFont';
import { divDecimals, formatDate, numberFormatter } from '@_utils/formatter';
import dayjs from 'dayjs';
import Copy from '@_components/Copy';
import DollarCurrencyRate from '@_components/DollarCurrencyRate';
import Link from 'next/link';
import Method from '@_components/Method';
import addressFormat, { hiddenAddress } from '@_utils/urlUtils';
import clsx from 'clsx';
import { useMobileAll } from '@_hooks/useResponsive';
import { ITransactionDetailData } from '@_api/type';
import { HashAddress, Tag } from 'aelf-design';
import Image from 'next/image';
import ContractToken from '@_components/ContractToken';
import { useParams } from 'next/navigation';
import { StatusEnum } from '@_types/status';
import TokenImage from '@app/[chain]/tokens/_components/TokenImage';
import NFTImage from '@_components/NFTImage';

export default function BaseInfo({ data }: { data: ITransactionDetailData }) {
  const isMobile = useMobileAll();
  const { chain } = useParams();
  const renderInfo = useMemo(() => {
    return [
      {
        label: 'Transactions Hash',
        tip: 'A TxHash or transaction hash is a unique 64 character identifier that is generated whenever a transaction is executed.',
        value: (
          <div className="break-all">
            {data.transactionId}
            <Copy value={data.transactionId} />
          </div>
        ),
      },
      {
        label: 'Status',
        tip: 'The status of the transaction.',
        row: true,
        value: (
          <div className="flex">
            <TransactionsStatus status={data.status} />
          </div>
        ),
      },
      {
        label: 'Block',
        tip: 'Number of the block in which the transaction is recorded.',
        value: (
          <div className="flex items-center">
            {data.confirmed && <IconFont className="mr-1" type="correct" />}
            <Link href={`/${chain}/block/${data.blockHeight}`} className="mr-2 text-link">
              {data.blockHeight}
            </Link>
            <ConfirmStatus status={data.confirmed ? StatusEnum.Confirmed : StatusEnum.Unconfrimed} />
          </div>
        ),
      },
      {
        label: 'Timestamp ',
        tip: 'The date and time at which the transaction is produced.',
        value: (
          <div>
            <IconFont className="mr-1" type="Time" />
            <span>
              {formatDate(data.timestamp, 'age')}({formatDate(data.timestamp, 'Date Time (UTC)')})
            </span>
          </div>
        ),
      },
      {
        label: 'Method ',
        tip: 'Function executed based on input data.',
        row: true,
        value: <Method text={data.method} tip={data.method} truncate={false} />,
      },
      {
        label: 'divider1',
        value: 'divider',
      },
      {
        label: 'From ',
        tip: 'The sending party of the transaction.',
        value: (
          <div className="flex flex-row items-center gap-1">
            <ContractToken
              address={data?.from?.address}
              name={data?.from?.name}
              type={data?.from?.addressType}
              chainId={chain as string}
            />
            {data.from?.isManager && <Tag color="processing">Manager</Tag>}
          </div>
        ),
      },
      {
        label: 'Interacted With(To) ',
        tip: 'The receiving party of the transaction (could be a contract address).',
        value: (
          <div>
            {/* <ContractToken address="AELF.Contract.Token" /> */}
            {data.to?.address ? (
              <ContractToken
                address={data?.to?.address}
                name={data?.to?.name}
                type={data?.to?.addressType}
                chainId={chain as string}
              />
            ) : (
              '-'
            )}

            {/* <div className={clsx('mt-2 flex items-center leading-[18px]', isMobile && 'flex-col !items-start')}>
              <div>
                <IconFont className="text-xs" type="Tab" />
                <span className="font10px mx-1 inline-block leading-[18px] text-base-200">Transferred</span>
                <span className="font10px inline-block leading-[18px]">{numberFormatter('2113.0231222')}</span>
              </div>
              <div>
                <span className="font10px mx-1 inline-block leading-[18px] text-base-200">From</span>
                <span className="font10px inline-block leading-[18px] text-link">
                  {addressFormat(hiddenAddress(data.transactionId))}
                </span>
                <Copy value={addressFormat(data.transactionId)} />
                <span className="font10px mx-1 inline-block leading-[18px] text-base-200">To</span>
                <span className="font10px inline-block leading-[18px] text-link">OKEX3</span>
                <Copy value="OKEX3" />
              </div>
            </div> */}
          </div>
        ),
      },
      {
        label: 'divider2',
        value: 'divider',
      },
      {
        label: 'Tokens Transferred ',
        tip: 'List of tokens transferred in the transaction.',
        hidden: !(data.tokenTransferreds?.length > 0),
        value: (
          <div>
            {data.tokenTransferreds?.length > 0
              ? data.tokenTransferreds.map((tokenTransfer, idx) => {
                  return (
                    <div
                      key={idx}
                      className={clsx(isMobile && 'flex-col !items-start gap-2', 'mb-4 flex w-full items-center')}>
                      <div className="flex items-center">
                        <IconFont type="arrow" />
                        <div className="mx-1 shrink-0 text-base-200">From</div>
                        <ContractToken
                          address={tokenTransfer?.from?.address}
                          name={tokenTransfer?.from?.name}
                          type={tokenTransfer?.from?.addressType}
                          chainId={chain as string}
                        />
                      </div>
                      <div className="flex items-center">
                        <div className="mx-1 shrink-0 text-base-200">To</div>
                        <ContractToken
                          address={tokenTransfer?.to?.address}
                          name={tokenTransfer?.to?.name}
                          type={tokenTransfer?.to?.addressType}
                          chainId={chain as string}
                        />
                      </div>
                      <div className="flex flex-wrap items-center">
                        <div className="mx-1 shrink-0 text-base-200">For</div>
                        <span>{tokenTransfer.amountString}</span>
                        <DollarCurrencyRate nowPrice={tokenTransfer.nowPrice} tradePrice={tokenTransfer.tradePrice} />
                        <div className="ml-1 flex items-center">
                          <TokenImage token={tokenTransfer}></TokenImage>
                          <span className="mx-1 text-link">{tokenTransfer.name}</span>
                          <span>{`(${tokenTransfer.symbol})`}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              : '-'}
          </div>
        ),
      },
      {
        label: 'divider3',
        hidden: !(data.tokenTransferreds?.length > 0),
        value: 'divider',
      },
      {
        label: 'NFTs Transferred ',
        tip: 'The amount of txn fee token transacted.',
        hidden: !(data.nftsTransferreds?.length > 0),
        value: (
          <div>
            {data.nftsTransferreds?.length > 0
              ? data.nftsTransferreds.map((nftsTransfer, idx) => {
                  return (
                    <div
                      key={idx}
                      className={clsx(
                        isMobile && 'flex-col !items-start gap-2',
                        'nft-transferred mb-4 flex items-center',
                      )}>
                      <NFTImage
                        className={clsx('rounded-lg bg-slate-200')}
                        src={nftsTransfer.imageUrl}
                        alt=""
                        width={40}
                        height={40}
                      />
                      <div className="text-xs leading-5">
                        <span className="inline-block shrink-0 text-base-200">For</span>
                        <span className="mx-1 inline-block  shrink-0">{nftsTransfer.amountString} Of NFT</span>
                        <span className="inline-block text-link">{`${nftsTransfer.name}(${nftsTransfer.symbol})`}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mx-1 inline-block shrink-0">From</span>
                        <ContractToken
                          address={nftsTransfer?.from?.address}
                          name={nftsTransfer?.from?.name}
                          type={nftsTransfer?.from?.addressType}
                          chainId={chain as string}
                        />
                      </div>
                      <div className="flex items-center">
                        <span className="mx-1 inline-block shrink-0">From</span>
                        <ContractToken
                          address={nftsTransfer?.from?.address}
                          name={nftsTransfer?.from?.name}
                          type={nftsTransfer?.from?.addressType}
                          chainId={chain as string}
                        />
                      </div>
                    </div>
                  );
                })
              : '-'}
          </div>
        ),
      },
      {
        label: 'divider4',
        hidden: !(data.nftsTransferreds?.length > 0),
        value: 'divider',
      },
      {
        label: 'Value ',
        tip: 'The amount of txn fee token transacted.',
        value: (
          <div className={clsx('flex', isMobile ? 'flex-col items-start' : 'items-center')}>
            {data.transactionValues?.map((transactionValue, idx) => {
              return (
                <div
                  key={idx}
                  className={clsx('flex items-center', idx !== 0 && !isMobile && 'border-0 border-l bg-color-divider')}>
                  <span>{transactionValue.amountString}</span>
                  <span>{transactionValue.symbol}</span>
                  <DollarCurrencyRate nowPrice={transactionValue.nowPrice} tradePrice={transactionValue.tradePrice} />
                </div>
              );
            })}
          </div>
        ),
      },
    ];
  }, [data, isMobile, chain]);
  return <DetailContainer infoList={renderInfo} />;
}
