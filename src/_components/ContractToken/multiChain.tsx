import { TChainID } from '@_api/type';
import Copy from '@_components/Copy';
import IconFont from '@_components/IconFont';
import addressFormat, { hiddenAddress } from '@_utils/urlUtils';
import { Dropdown } from 'aelf-design';
import { useMemo } from 'react';
import './index.css';
import clsx from 'clsx';
import QrCodeModal from './qrCode';

export default function MultiChain({
  address,
  chainIds = [],
  showChainId = true,
  breakAll = false,
  hidden = true,
}: {
  address: string;
  chainIds?: TChainID[];
  showChainId?: boolean;
  breakAll?: boolean;
  hidden?: boolean;
}) {
  const showChain = useMemo(() => {
    return chainIds?.length > 1 ? 'Multichain' : chainIds[0] === 'AELF' ? 'MainChain' : 'dAppChain';
  }, [chainIds]);
  const multi = useMemo(() => {
    return chainIds?.length > 1;
  }, [chainIds]);
  const items = useMemo(() => {
    return chainIds?.sort().map((item, index) => {
      return {
        key: item,
        label: (
          <div
            className={clsx(
              'flex w-full flex-col px-1 py-2',
              index === 0 ? 'border-b-solid border-b border-b-border' : '',
            )}>
            <div className="flex items-center py-[2px]">
              <div className="flex items-center px-2">
                <IconFont className="text-base" type={item === 'AELF' ? 'mainChainLogo' : 'dappChainLogo'} />
              </div>
              <div className="shrink-0 text-sm">{item === 'AELF' ? 'aelf MainChain' : 'aelf dAppChain'}</div>
            </div>
            <div className="ml-8 flex items-center gap-2 py-[2px] pr-2">
              <div className="break-all text-xs text-muted-foreground">
                {hidden ? addressFormat(hiddenAddress(address), item) : addressFormat(address, item)}
              </div>
              <Copy value={addressFormat(address, item)} />
              <QrCodeModal address={addressFormat(address, item)} />
            </div>
          </div>
        ),
      };
    });
  }, [address, chainIds, hidden]);

  if (breakAll) {
    return (
      <>
        <div className="ml-1 inline-block h-[22px] shrink-0 whitespace-nowrap rounded-[9px] border border-border px-[10px] py-[2px]  text-xs leading-4">
          {showChain}
        </div>
        {multi ? (
          <Dropdown
            trigger={['click']}
            overlayClassName="multiChain-drop min-w-[240px] max-w-[395px]"
            menu={{ items: items }}>
            <IconFont className="text-base" type="chevron-down1" />
          </Dropdown>
        ) : (
          <>
            <span className="relative mr-1 inline-block w-5">
              <Copy className="absolute -top-[12px]" value={addressFormat(address, chainIds[0])} />
            </span>
            <span className="relative inline-block">
              <QrCodeModal className="absolute -top-[12px]" address={addressFormat(address, chainIds[0])} />
            </span>
          </>
        )}
      </>
    );
  }

  return (
    <div className="multiChain-drop-container flex items-center whitespace-nowrap">
      {showChainId && (
        <div className="ml-1 shrink-0 whitespace-nowrap rounded-[9px] border border-border px-[10px] py-[2px] text-xs">
          {showChain}
        </div>
      )}
      {multi ? (
        <Dropdown trigger={['click']} overlayClassName="multiChain-drop w-[240px]" menu={{ items }}>
          <IconFont className="text-base" type="chevron-down1" />
        </Dropdown>
      ) : (
        <Copy value={addressFormat(address, chainIds[0])} />
      )}
    </div>
  );
}
