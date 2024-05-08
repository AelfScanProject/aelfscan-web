import EPTooltip from '@_components/EPToolTip';
import clsx from 'clsx';

export default function Method({ text, tip, truncate = true }: { text: string; tip: string; truncate?: boolean }) {
  return (
    <EPTooltip title={tip} mode="dark" pointAtCenter={false}>
      <div
        className={clsx(
          'border-box method box-border inline-block h-6 rounded border border-D0 bg-F7 px-[15px] text-center leading-6',
          truncate && 'w-24',
        )}>
        <div className="truncate text-[10px] leading-6">{text}</div>
      </div>
    </EPTooltip>
  );
}
