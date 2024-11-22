'use client';
import clsx from 'clsx';
import './index.css';
import { MenuItem, NetworkItem } from '@_types';
import useResponsive from '@_hooks/useResponsive';
import AelfscanLogo from '@_components/Header/aelfscanLogo';
import NetWorkSwitch from '@_components/NetWorkSwitch';
import MenuItemCom from './memuItem';
interface IProps {
  headerMenuList: MenuItem[];
  setCurrent: (key: string) => void;
  selectedKey: string;
  networkList: NetworkItem[];
}

const clsPrefix = 'header-menu-container';
export default function HeaderMenu({ selectedKey, setCurrent, headerMenuList, networkList }: IProps) {
  const { isLG } = useResponsive();

  return (
    <div className={clsx(`${clsPrefix}`)}>
      <div className={`${clsPrefix}-content`}>
        <div>
          <AelfscanLogo />
        </div>
        <div className="flex items-center gap-[10px]">
          {isLG && (
            <div className="flex items-center">
              <NetWorkSwitch isSelect={false} networkList={networkList} />
            </div>
          )}
          <MenuItemCom
            selectedKey={selectedKey}
            type={isLG ? 'inline' : 'horizontal'}
            headerMenuList={headerMenuList}
            setCurrent={setCurrent}
          />
        </div>
      </div>
    </div>
  );
}
