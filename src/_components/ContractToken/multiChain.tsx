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
}: {
  address: string;
  chainIds?: TChainID[];
  showChainId?: boolean;
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
              <div className="text-sm">{item === 'AELF' ? 'aelf MainChain' : 'aelf dAppChain'}</div>
            </div>
            <div className="ml-8 flex gap-2 py-[2px]">
              <div className="text-xs text-muted-foreground">{addressFormat(hiddenAddress(address), item)}</div>
              <Copy value={addressFormat(address, item)} />
              <QrCodeModal address={addressFormat(address, item)} />
            </div>
          </div>
        ),
      };
    });
  }, [address, chainIds]);
  return (
    <div className="multiChain-drop-container flex items-center">
      {showChainId && (
        <div className="ml-1 rounded-[9px] border border-border px-[10px] py-[2px] text-xs">{showChain}</div>
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
