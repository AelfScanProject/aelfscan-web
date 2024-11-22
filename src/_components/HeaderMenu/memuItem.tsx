import { useMemo, useState } from 'react';
import { MenuItem } from '@_types';
import { MULTI_CHAIN } from '@_utils/contant';
import { getPathnameFirstSlash, isURL } from '@_utils/urlUtils';
import { Drawer, Menu, MenuProps } from 'antd';
import Link from 'next/link';
import IconFont from '@_components/IconFont';
import { useMD } from '@_hooks/useResponsive';
import AelfscanLogo from '@_components/Header/aelfscanLogo';
import './index.css';

interface IProps {
  headerMenuList: MenuItem[];
  setCurrent: (key: string) => void;
  selectedKey: string;
  type?: 'horizontal' | 'inline';
}

const clsPrefix = 'header-menu-warp';

export default function MenuItemCom({ selectedKey, setCurrent, headerMenuList, type = 'horizontal' }: IProps) {
  const [open, setOpen] = useState(false);

  const isMD = useMD();

  const showDrawer = () => {
    setOpen(true);
  };
  const onClick: MenuProps['onClick'] = (e) => {
    if (!e.key.startsWith('http')) {
      setCurrent(e.key);
    }
  };
  const items: MenuProps['items'] = useMemo(() => {
    return headerMenuList?.map((ele) => {
      if (!ele.children?.length) {
        // one layer
        const path = ele.path;
        return {
          label: isURL(path) ? (
            <a target="_blank" rel="noreferrer" href={path}>
              {ele.label}
            </a>
          ) : (
            <Link href={path === '/' ? '/' : `/${MULTI_CHAIN}${path}`}>{ele.label}</Link>
          ),
          key: ele.path,
        };
      } else {
        // parent of two layer
        const item = {
          label: (
            <div className="flex items-center">
              <span className="submenu-title-wrapper">{ele.label}</span>
              {type === 'horizontal' && <IconFont className="submenu-right-arrow" type="chevron-down1" />}
            </div>
          ),
          key: ele.path,
          popupClassName: `${clsPrefix}-popup`,
          children: [] as MenuProps['items'],
        };
        ele.children.forEach((element) => {
          const { label, path } = element;
          const secondSlashIndex = path.slice(1).indexOf('/');
          item.children?.push({
            label: isURL(path) ? (
              <a target="_blank" rel="noreferrer" href={path}>
                {label}
              </a>
            ) : (
              <Link href={path === '/' ? '/' : `/${MULTI_CHAIN}${path}`}>{label}</Link>
            ),
            key: secondSlashIndex === -1 || isURL(path) ? path : getPathnameFirstSlash(path),
          });
        });
        return item;
      }
    });
  }, [headerMenuList, type]);

  const onClose = () => {
    setOpen(false);
  };
  return (
    <div className="header-menu-warp">
      <Drawer
        title={
          <div className="">
            <AelfscanLogo />
            <div className="absolute -top-[2px] right-[18px] cursor-pointer p-[6px]" onClick={onClose}>
              <IconFont className="text-base" type="x" />
            </div>
          </div>
        }
        closeIcon={null}
        rootClassName="header-menu-warp-Drawer"
        width={isMD ? 294 : 384}
        placement="left"
        onClose={onClose}
        open={open}>
        <Menu onClick={onClick} selectedKeys={[selectedKey]} mode="inline" items={items}></Menu>
      </Drawer>
      {type === 'inline' ? (
        <div
          className="flex cursor-pointer items-center justify-center rounded-lg border border-border bg-white p-3"
          onClick={showDrawer}>
          <IconFont className="text-base" type="menu" />
        </div>
      ) : (
        <Menu
          onClick={onClick}
          selectedKeys={[selectedKey]}
          mode="horizontal"
          style={{ minWidth: 472, flex: 'auto' }}
          items={items}></Menu>
      )}
    </div>
  );
}
