import Copy from '@_components/Copy';
import { MULTI_CHAIN } from '@_utils/contant';
import { getAddress } from '@_utils/formatter';
import addressFormat, { hiddenAddress } from '@_utils/urlUtils';
import Link from 'next/link';
import { useMemo } from 'react';

export interface IAddressWithCopyProps {
  address: string;
  chain: string;
  hidden?: boolean;
}

const AddressWithCopy = ({ address, hidden, chain }: IAddressWithCopyProps) => {
  const addressStr = useMemo(() => {
    const str = hidden ? hiddenAddress(address, 4, 4) : address;
    return getAddress(str);
  }, [address, hidden]);

  const previewAddress = useMemo(() => {
    return chain === MULTI_CHAIN ? addressStr : addressFormat(addressStr, chain);
  }, [addressStr, chain]);

  return (
    <>
      <Link className="text-link" href={`/${chain}/address/${previewAddress}`}>
        {previewAddress}
      </Link>
      <Copy value={previewAddress} />
    </>
  );
};

export default AddressWithCopy;
