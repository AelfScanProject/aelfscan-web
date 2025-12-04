import EPTooltip from '@_components/EPToolTip';
import clsx from 'clsx';

export default function Method({ text, tip, truncate = true }: { text: string; tip: string; truncate?: boolean }) {
  return (
    <EPTooltip title={tip} mode="dark" pointAtCenter={false}>
      <div
        className={clsx(
          'border-box method box-border inline-block h-5 rounded-[9px]  bg-secondary px-[10px] py-[2px] text-center',
          truncate && 'w-[98px]',
        )}>
        <div className="truncate text-xs font-semibold text-secondary-foreground">{text}</div>
      </div>
    </EPTooltip>
  );
}
