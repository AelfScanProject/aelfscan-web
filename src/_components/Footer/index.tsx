/*
 * @author: Peterbjx
 * @Date: 2023-08-16 16:02:25
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-16 16:02:43
 * @Description:
 */
'use client';
import clsx from 'clsx';
import './index.css';
import IconFont from '@_components/IconFont';
import BackToTopButton from '@_components/BackToTopBtn';
import Image from 'next/image';
import { usePad } from '@_hooks/useResponsive';
import { MenuItem } from '@_types';
import { useAppSelector } from '@_store';
import Link from 'next/link';
import Copy from '@_components/Copy';
const clsPrefix = 'footer-container';
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
    <div className={clsx(clsPrefix, isPad && `${clsPrefix}-mobile`)}>
      <div className={clsx(`${clsPrefix}-wrapper`)}>
        <div className={`${clsPrefix}-content`}>
          <div className="left">
            <div className="title flex items-center">
              <IconFont type="aelf-header-top-test-change"></IconFont>
              <span className="text">Powered by AELF</span>
            </div>
            <div className="description">
              AELF Scan is a Block Explorer and Analytics Platform for AELF, a decentralized cloud computing blockchain
              explorer.
            </div>
          </div>
          <div className="right">
            {rightLinkCom}
            <div className="service" key="service">
              <span className="title">Service</span>
              <Link className="text" href={`/${defaultChain}/contactusadvertise`} key="advertise">
                Advertise
              </Link>
              <span className="mt-1 !flex items-center gap-1">
                <a className="text !mt-0" href={`mailto:${email}`} target="_blank" key="Contact Us" rel="noreferrer">
                  Contact Us
                </a>
              </span>
            </div>
          </div>
        </div>
        <BackToTopButton isDark={true}></BackToTopButton>
        <div className={`${clsPrefix}-link`}>
          <a href="https://x.com/aelfblockchain" target="_blank" rel="noopener noreferrer">
            <Image width={32} height={32} src="/image/twitter.svg" alt="twitter"></Image>
          </a>
          <a href="https://t.me/aelfblockchain" target="_blank" rel="noopener noreferrer">
            <Image width={32} height={32} src="/image/telegram.svg" alt="telegram"></Image>
          </a>
          <a href="https://www.youtube.com/c/aelfblockchain" target="_blank" rel="noopener noreferrer">
            <Image width={32} height={32} src="/image/youtube.svg" alt="youtube"></Image>
          </a>
          <a href="https://discord.gg/bgysa9xjvD" target="_blank" rel="noopener noreferrer">
            <Image width={32} height={32} src="/image/discord.svg" alt="discord"></Image>
          </a>
        </div>
      </div>
      <div className="copywrite">aelfscan © {new Date().getFullYear()}</div>
    </div>
  );
}
