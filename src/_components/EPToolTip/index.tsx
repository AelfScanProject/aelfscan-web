import { Tooltip, ITooltipProps } from 'aelf-design';
import clsx from 'clsx';
import { ReactNode } from 'react';
import './index.css';
import { TooltipPlacement } from 'antd/es/tooltip';
import { useMobileAll } from '@_hooks/useResponsive';

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
      color={'#FFFFFF'}
      trigger={trigger || (isMobile ? 'click' : 'hover')}
      arrow={false}
      placement={'top'}
      {...params}>
      {children}
    </Tooltip>
  );
}
