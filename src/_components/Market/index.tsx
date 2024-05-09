import EPTooltip from '@_components/EPToolTip';
import Image from 'next/image';
const ForestIcon = '/image/forest.svg';

export default function Market() {
  return (
    <div>
      <EPTooltip title="Forest" mode="dark">
        <Image width={20} height={20} src={ForestIcon} alt="Forest"></Image>
      </EPTooltip>
    </div>
  );
}
