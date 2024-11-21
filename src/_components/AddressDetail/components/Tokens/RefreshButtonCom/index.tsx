import IconFont from '@_components/IconFont';
import { Button, ButtonProps } from 'antd';

export default function RefreshButtonCom(params: ButtonProps) {
  return (
    <Button className="flex size-[42px] items-center justify-center rounded-lg !border-border" {...params}>
      <IconFont className="text-base" type="refresh-cw"></IconFont>
    </Button>
  );
}
