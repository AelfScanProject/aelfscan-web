import Copy from '@_components/Copy';
import EPTooltip from '@_components/EPToolTip';
import IconFont from '@_components/IconFont';
import { AddressType } from '@_types/common';
import addressFormat, { hiddenAddress } from '@_utils/urlUtils';
import Link from 'next/link';

export default function ContractToken({
  address,
  name,
  type,
  chainId,
  showCopy = true,
  count = 4,
  showContractAddress = false,
}: {
  address: string;
  name?: string;
  count?: number;
  type: AddressType;
  chainId: string;
  showCopy?: boolean;
  showContractAddress?: boolean;
}) {
  return type === AddressType.address || showContractAddress || (type === AddressType.Contract && !name) ? (
    address ? (
      <div className="address flex items-center">
        {showContractAddress && (
          <EPTooltip mode="dark" title="Contract">
            <IconFont className="mr-1 text-sm" type="Contract" />
          </EPTooltip>
        )}
        <EPTooltip pointAtCenter={false} title={addressFormat(address || '', chainId)} mode="dark">
          <Link
            prefetch={false}
            className="text-link"
            href={`/${chainId}/address/${addressFormat(address || '', chainId)}`}>
            {addressFormat(hiddenAddress(address || '', count, count), chainId)}
          </Link>
        </EPTooltip>
        {showCopy && <Copy value={addressFormat(address, chainId)} />}
        <div className="flex items-center"></div>
      </div>
    ) : (
      '-'
    )
  ) : name ? (
    <div className="address w-full truncate">
      <EPTooltip mode="dark" title="Contract">
        <IconFont className="mr-1 text-sm" type="Contract" />
      </EPTooltip>
      <EPTooltip
        title={
          <div>
            <div>Contract Name:{name}</div>
            <div>({addressFormat(address, chainId)})</div>
          </div>
        }
        mode="dark"
        pointAtCenter={false}>
        <Link prefetch={false} className="" href={`/${chainId}/address/${addressFormat(address, chainId)}`}>
          {name}
        </Link>
      </EPTooltip>
      {showCopy && <Copy value={addressFormat(address, chainId)} />}
    </div>
  ) : (
    '-'
  );
}
