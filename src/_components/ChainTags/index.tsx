import { TChainID } from '@_api/type';
import IconFont from '@_components/IconFont';

export default function ChainTags({
  chainIds = [],
  className,
  showIcon,
}: {
  chainIds: TChainID[];
  className?: string;
  showIcon?: boolean;
}) {
  return (
    <div>
      {showIcon ? (
        <div className="flex items-center gap-[2px]">
          {[...chainIds].sort().map((chain) => {
            return (
              <IconFont
                key={chain}
                className="text-[24px]"
                type={chain === 'AELF' ? 'mainChainLogo' : 'dappChainLogo'}
              />
            );
          })}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <IconFont className="text-[24px]" type={chainIds[0] === 'AELF' ? 'mainChainLogo' : 'dappChainLogo'} />
          <span className="text-sm text-foreground">{chainIds[0] === 'AELF' ? 'MainChain' : 'dAppChain'}</span>
        </div>
      )}
    </div>
  );
}
