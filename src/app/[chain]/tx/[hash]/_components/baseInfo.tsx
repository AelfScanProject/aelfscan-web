import DetailContainer from '@_components/DetailContainer';
import { useMemo } from 'react';
import TransactionsStatus from '@_components/TransactionsStatus';
import ConfirmStatus from '@_components/ConfirmedStatus';
import IconFont from '@_components/IconFont';
import { formatDate } from '@_utils/formatter';
import Copy from '@_components/Copy';
import DollarCurrencyRate from '@_components/DollarCurrencyRate';
import Link from 'next/link';
import Method from '@_components/Method';
import clsx from 'clsx';
import { useMobileAll } from '@_hooks/useResponsive';
import { ITransactionDetailData, TChainID } from '@_api/type';
import { Tag } from 'aelf-design';
import ContractToken from '@_components/ContractToken';
import { useParams } from 'next/navigation';
import { StatusEnum } from '@_types/status';
import TokenImage from '@app/[chain]/tokens/_components/TokenImage';
import NFTImage from '@_components/NFTImage';

export default function BaseInfo({ data }: { data: ITransactionDetailData }) {
  const isMobile = useMobileAll();
  const { chain } = useParams<{ chain: TChainID }>();

  console.log(data, 'dataF');
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
            <IconFont className="mr-1 text-base" type="clock" />
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
              chainIds={[chain as TChainID]}
              showChainId={false}
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
            {data.to?.address ? (
              <ContractToken
                address={data?.to?.address}
                name={data?.to?.name}
                type={data?.to?.addressType}
                showChainId={false}
                chainIds={[chain as TChainID]}
              />
            ) : (
              '-'
            )}
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
                      className={clsx(
                        isMobile && 'flex-col !items-start gap-2',
                        'mb-4 flex  w-full items-center text-base',
                      )}>
                      <div className="flex items-center">
                        <div className="mr-1 shrink-0">From</div>
                        <ContractToken
                          address={tokenTransfer?.from?.address}
                          name={tokenTransfer?.from?.name}
                          type={tokenTransfer?.from?.addressType}
                          showChainId={false}
                          chainIds={[chain]}
                        />
                      </div>
                      <div className="flex items-center">
                        <div className="mx-1 shrink-0">To</div>
                        <ContractToken
                          address={tokenTransfer?.to?.address}
                          name={tokenTransfer?.to?.name}
                          type={tokenTransfer?.to?.addressType}
                          showChainId={false}
                          chainIds={[chain]}
                        />
                      </div>
                      <div className="flex flex-wrap items-center">
                        <div className="mx-1 shrink-0">For</div>
                        <span>{tokenTransfer.amountString}</span>
                        <DollarCurrencyRate nowPrice={tokenTransfer.nowPrice} tradePrice={tokenTransfer.tradePrice} />
                        <div className="ml-1 flex items-center">
                          <TokenImage token={tokenTransfer}></TokenImage>
                          <span className="mx-1 text-primary">{tokenTransfer.name}</span>
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
                        'nft-transferred mb-4 flex items-center text-base',
                      )}>
                      <NFTImage
                        className={clsx('rounded-lg bg-slate-200')}
                        src={nftsTransfer.imageUrl}
                        alt=""
                        width={40}
                        height={40}
                      />
                      <div className="ml-1">
                        <span className="inline-block shrink-0">For</span>
                        <span className="mx-1 inline-block  shrink-0">{nftsTransfer.amountString} Of NFT</span>
                        <span className="inline-block text-primary">{`${nftsTransfer.name}(${nftsTransfer.symbol})`}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mx-1 inline-block shrink-0">From</span>
                        <ContractToken
                          address={nftsTransfer?.from?.address}
                          name={nftsTransfer?.from?.name}
                          type={nftsTransfer?.from?.addressType}
                          chainIds={[chain]}
                          showChainId={false}
                        />
                      </div>
                      <div className="flex items-center">
                        <span className="mx-1 inline-block shrink-0">To</span>
                        <ContractToken
                          address={nftsTransfer?.to?.address}
                          name={nftsTransfer?.to?.name}
                          type={nftsTransfer?.to?.addressType}
                          chainIds={[chain]}
                          showChainId={false}
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
        tip: 'The value transfer of Prime tokens (ELF) generated from transactions.',
        value: (
          <div className={clsx('flex', isMobile ? 'flex-col items-start' : 'flex-col items-start')}>
            {data.transactionValues?.filter((item) => item.symbol === 'ELF').length > 0
              ? data.transactionValues
                  ?.filter((item) => item.symbol === 'ELF')
                  .map((transactionValue, idx) => {
                    return (
                      <div key={idx} className={clsx('flex items-center')}>
                        <span>{transactionValue.amountString}</span>
                        <span>{transactionValue.symbol}</span>
                        {Number(transactionValue.nowPrice) > 0 && (
                          <DollarCurrencyRate
                            nowPrice={transactionValue.nowPrice}
                            tradePrice={transactionValue.tradePrice}
                          />
                        )}
                      </div>
                    );
                  })
              : '-'}
          </div>
        ),
      },
    ];
  }, [data, isMobile, chain]);
  return <DetailContainer infoList={renderInfo} />;
}
