import { Button, ButtonProps } from 'antd';
import IconFont from '@_components/IconFont';

export default function SwitchButton({ hidden, buttonProps }: { hidden: boolean; buttonProps?: ButtonProps }) {
  return (
    <Button
      className="rounded-mg flex h-10 items-center justify-center gap-4 !border-border px-3 py-2"
      {...buttonProps}>
      <div className="text-sm">{hidden ? 'Hide' : 'Show'} assets</div>
      <IconFont className={`${hidden && 'rotate-180'} text-base`} type="chevron-down1" />
    </Button>
  );
}
