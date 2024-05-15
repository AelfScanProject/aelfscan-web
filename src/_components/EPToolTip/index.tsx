import { Tooltip, ITooltipProps } from 'aelf-design';
import clsx from 'clsx';
import { ReactNode } from 'react';
import './index.css';
import { useMobileContext } from '@app/pageProvider';
import { TooltipPlacement } from 'antd/es/tooltip';
import useResponsive, { useMobileAll } from '@_hooks/useResponsive';
import { TriggerType } from 'antd/es/color-picker/interface';

interface IToolTip extends Omit<ITooltipProps, 'children' | 'color' | 'overlayClassName' | 'arrow' | 'placement'> {
  pointAtCenter?: boolean;
  children: ReactNode;
  mode: 'light' | 'dark';
  className?: string;
  placement?: TooltipPlacement;
}

export default function EPTooltip({
  children,
  pointAtCenter = true,
  trigger,
  className,
  placement = 'topLeft',
  mode = 'dark',
  ...params
}: IToolTip) {
  const isMobile = useMobileAll();
  return (
    <Tooltip
      overlayClassName={clsx(mode === 'light' ? 'tooltip-light' : 'tooltip-dark', className)}
      color={mode === 'dark' ? '#1D2A51' : '#FFFFFF'}
      trigger={trigger || (isMobile ? 'click' : 'hover')}
      arrow={{ pointAtCenter: pointAtCenter }}
      placement={placement}
      {...params}>
      {children}
    </Tooltip>
  );
}
