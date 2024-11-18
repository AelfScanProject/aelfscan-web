/*
 * @author: Peterbjx
 * @Date: 2023-08-16 16:02:25
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-16 16:02:43
 * @Description:
 */
'use client';
import IconFont from '@_components/IconFont';
import BackToTopButton from '@_components/BackToTopBtn';
import Image from 'next/image';
import { usePad } from '@_hooks/useResponsive';
import { MenuItem } from '@_types';
import { useAppSelector } from '@_store';
import Link from 'next/link';
const email = 'contact@aelfscan.io';
interface IProps {
  isMobileSSR: boolean;
  footerMenuList: {
    footerMenu_id: MenuItem;
  }[];
}
export default function Footer({ footerMenuList }: IProps) {
  const { defaultChain } = useAppSelector((state) => state.getChainId);
  const isPad = usePad();
  const rightLinkCom = footerMenuList.map((ele) => {
    const item = ele.footerMenu_id;
    const subItem = item.children.map((element) => {
      return (
        <span className="text" onClick={() => window.open(element.path, '_blank')} key={element.label}>
          {element.label}
        </span>
      );
    });
    return (
      <div className={item.key} key={item.key}>
        <span className="title">{item.label}</span>
        {subItem}
      </div>
    );
  });
  return (
    <div className="w-full pb-[56px] min-[769px]:pb-0">
      <div className="relative m-auto max-w-[1440px] px-5 pt-6">
        <div className="flex items-center justify-between py-6">
          <div className="flex items-center gap-6">
            <a href="https://x.com/aelfblockchain" target="_blank" rel="noopener noreferrer">
              <Image width={20} height={20} src="/image/X.svg" alt="twitter"></Image>
            </a>
            <a href="https://t.me/aelfblockchain" target="_blank" rel="noopener noreferrer">
              <Image width={20} height={20} src="/image/telegram.svg" alt="telegram"></Image>
            </a>
            <a href="https://www.youtube.com/c/aelfblockchain" target="_blank" rel="noopener noreferrer">
              <Image width={20} height={14.2} src="/image/youtube.svg" alt="youtube"></Image>
            </a>
            <a href="https://discord.gg/bgysa9xjvD" target="_blank" rel="noopener noreferrer">
              <Image width={20} height={20} src="/image/discord.svg" alt="discord"></Image>
            </a>
          </div>
          <BackToTopButton isDark={true}></BackToTopButton>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border py-8 min-[769px]:flex-row min-[769px]:gap-0 ">
          <div className="title flex items-center gap-2">
            <IconFont type="aelf-header-top-test-change"></IconFont>
            <span className="text-sm font-medium text-muted-foreground">
              Powered by{' '}
              <Link href="https://aelf.io" target="_blank" className="text-primary">
                aelf
              </Link>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              className="text-sm text-primary"
              target="_blank"
              href="https://form.aelfscan.io/advertise"
              key="advertise">
              Advertise
            </Link>
            <a
              className="text-sm text-primary"
              href="https://form.aelfscan.io/contactus"
              target="_blank"
              key="Contact Us"
              rel="noreferrer">
              Contact Us
            </a>
            <div className="text-sm text-muted-foreground">aelfscan © {new Date().getFullYear()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
