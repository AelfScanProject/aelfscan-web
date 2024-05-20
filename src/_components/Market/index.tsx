import EPTooltip from '@_components/EPToolTip';
import NFTImage from '@_components/NFTImage';

export default function Market({ url }: { url: string }) {
  return (
    <div>
      <EPTooltip title="Forest" mode="dark">
        <NFTImage className="rounded-full" width={20} height={20} src={url} alt="Forest"></NFTImage>
      </EPTooltip>
    </div>
  );
}
