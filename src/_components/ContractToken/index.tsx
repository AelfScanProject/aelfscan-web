import { TChainID } from '@_api/type';
import EPTooltip from '@_components/EPToolTip';
import IconFont from '@_components/IconFont';
import { AddressType } from '@_types/common';
import { MULTI_CHAIN } from '@_utils/contant';
import addressFormat, { hiddenAddress } from '@_utils/urlUtils';
import Link from 'next/link';
import MultiChain from './multiChain';
import { useMemo } from 'react';

export default function ContractToken({
  address,
  name,
  className,
  type,
  chainId,
  showCopy = true,
  showChainId = true,
  chainIds = [],
  count = 4,
  onlyCopy,
  showContractAddress = false,
}: {
  address: string;
  name?: string;
  className?: string;
  count?: number;
  chainIds?: TChainID[];
  type: AddressType;
  chainId?: string;
  onlyCopy?: boolean;
  showCopy?: boolean;
  showChainId?: boolean;
  showContractAddress?: boolean;
}) {
  const showChain = useMemo(() => {
    return chainIds?.length > 1 ? 'AELF' : chainIds[0];
  }, [chainIds]);

  const contractAddress = useMemo(() => {
    return showContractAddress || (type === AddressType.Contract && !name);
  }, [name, showContractAddress, type]);

  return type === AddressType.address || showContractAddress || (type === AddressType.Contract && !name) ? (
    address ? (
      <div className="address flex items-center">
        {contractAddress && (
          <EPTooltip mode="dark" title="Contract">
            <IconFont className="mr-1 text-base" type="ContractIcon" />
          </EPTooltip>
        )}
        <EPTooltip pointAtCenter={false} title={addressFormat(address || '', showChain)} mode="dark">
          <Link
            prefetch={false}
            className="text-primary"
            href={`/${contractAddress ? showChain : MULTI_CHAIN}/address/${addressFormat(address || '', showChain)}`}>
            {addressFormat(hiddenAddress(address || ''), showChain)}
          </Link>
        </EPTooltip>
        {showCopy && <MultiChain showChainId={showChainId} address={address} onlyCopy={onlyCopy} chainIds={chainIds} />}
        <div className="flex items-center"></div>
      </div>
    ) : (
      '-'
    )
  ) : name ? (
    <div className="address flex w-full truncate">
      <EPTooltip mode="dark" title="Contract">
        <IconFont className="mr-1 text-base" type="ContractIcon" />
      </EPTooltip>
      <EPTooltip
        title={
          <div className="break-all">
            <div className="break-all">Contract Name: {name}</div>
            <div>({addressFormat(address, showChain)})</div>
          </div>
        }
        mode="dark"
        pointAtCenter={false}>
        <Link
          prefetch={false}
          className={`max-w-full truncate ${className}`}
          href={`/${showChain}/address/${addressFormat(address, showChain)}`}>
          {name}
        </Link>
      </EPTooltip>
      {showCopy && <MultiChain showChainId={showChainId} onlyCopy={onlyCopy} address={address} chainIds={chainIds} />}
    </div>
  ) : (
    '-'
  );
}
