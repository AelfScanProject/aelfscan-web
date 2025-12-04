import Image from 'next/image';
import Link from 'next/link';
import Logo from 'public/image/aelfscan.svg';
export default function AelfscanLogo() {
  return (
    <Link href={'/'}>
      <Image width={111} height={24} alt="logo" src={Logo} />
    </Link>
  );
}
