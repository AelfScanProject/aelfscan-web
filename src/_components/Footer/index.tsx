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
import { useEffect, useState } from 'react';
import { isMobileDevices } from '@_utils/isMobile';
import { isMainNet } from '@_utils/isMainNet';
import useResponsive from '@_hooks/useResponsive';
const FoorterBgTets = '/image/footer-bg.png';
const clsPrefix = 'footer-container';
interface IProps {
  isMobileSSR: boolean;
  // footerMenuList:
}
export default function Footer({ isMobileSSR, footerMenuList }: IProps) {
  const [isMobile, setIsMobile] = useState(isMobileSSR);
  const { isMobile: isClientMobile } = useResponsive();
  useEffect(() => {
    setIsMobile(isClientMobile);
  }, [isClientMobile]);
  return (
    <div className={clsx(clsPrefix, isMainNet && `${clsPrefix}-main`, isMobile && `${clsPrefix}-mobile`)}>
      {!isMainNet && (
        <Image src={`${FoorterBgTets}`} alt={''} width="1400" height="330" className={`${clsPrefix}-bg`}></Image>
      )}
      <div className={clsx(`${clsPrefix}-wrapper`)}>
        <div className={`${clsPrefix}-content`}>
          <div className="left">
            <div className="title">
              <IconFont type={isMainNet ? 'aelf-header-top-change' : 'aelf-header-top-test-change'}></IconFont>
              <span className="text">Powered by AELF</span>
            </div>
            <div className="description">
              AELF Explorer is a Block Explorer and Analytics Platform for AELF, a decentralized cloud computing
              blockchain explorer.
            </div>
          </div>
          <div className="right">
            <div className="ecosystem">
              <span className="title">AELF Ecosystem</span>
              <span className="text">aelf.io</span>
              <span className="text">Wallet</span>
            </div>
            <div className="community">
              <span className="title">Community</span>
              <span className="text">Telegram</span>
              <span className="text">Medium</span>
              <span className="text">Twitter</span>
              <span className="text">Youtube</span>
              <span className="text">Discord</span>
            </div>
            <div className="developer">
              <span className="title">Developer</span>
              <span className="text">Dev Docs</span>
              <span className="text">Github</span>
            </div>
          </div>
        </div>
        <BackToTopButton isDark={isMainNet}></BackToTopButton>
        <div className={`${clsPrefix}-link`}>
          <IconFont type="telegram" onClick={() => (window.location.href = 'https://t.me/aelfblockchain')}></IconFont>
          <IconFont
            type="medium"
            onClick={() => (window.location.href = 'https://medium.com/aelfblockchain')}></IconFont>
          <IconFont
            type="twitter"
            onClick={() => (window.location.href = 'https://twitter.com/aelfblockchain')}></IconFont>
          <IconFont
            type="youtube"
            onClick={() => (window.location.href = 'http://www.youtube.com/c/aelfblockchain')}></IconFont>
          <IconFont type="discord" onClick={() => (window.location.href = 'https://discord.gg/bgysa9xjvD')}></IconFont>
        </div>
      </div>
      <div className="copywrite">AELF © {new Date().getFullYear()}</div>
    </div>
  );
}
