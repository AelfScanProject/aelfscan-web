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
  showContractAddress = false,
}: {
  address: string;
  name?: string;
  type: AddressType;
  chainId: string;
  showCopy?: boolean;
  showContractAddress?: boolean;
}) {
  return type === AddressType.address || showContractAddress ? (
    <div className="address flex items-center">
      {showContractAddress && (
        <EPTooltip mode="dark" title="Contract">
          <IconFont className="mr-1 text-sm" type="Contract" />
        </EPTooltip>
      )}
      <EPTooltip pointAtCenter={false} title={addressFormat(address || '', chainId)} mode="dark">
        <Link className="text-link" href={`/${chainId}/address/${addressFormat(address || '', chainId)}/${type}`}>
          {addressFormat(hiddenAddress(address || '', 4, 4), chainId)}
        </Link>
      </EPTooltip>
      {showCopy && <Copy value={addressFormat(address, chainId)} />}
      <div className="flex items-center"></div>
    </div>
  ) : (
    <div className="address w-full truncate">
      <IconFont className="mr-1 text-sm" type="Contract" />
      <EPTooltip
        title={
          <div>
            <div>Contract Name:{name}</div>
            <div>({addressFormat(address, chainId)})</div>
          </div>
        }
        mode="dark"
        pointAtCenter={false}>
        <Link className="" href={`/${chainId}/address/${addressFormat(address, chainId)}`}>
          {name}
        </Link>
      </EPTooltip>
      {showCopy && <Copy value={addressFormat(address, chainId)} />}
    </div>
  );
}
