/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 14:37:10
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-16 15:57:46
 * @Description: root layout
 */

import '@_style/globals.css';
import type { Metadata } from 'next';
import RootProvider from './pageProvider';
import Header from '@_components/Header';
import Footer from '@_components/Footer';
import MainContainer from '@_components/Main';
import { headers } from 'next/headers';
import { isMobileOnServer } from '@_utils/isMobile';
import { Suspense } from 'react';
import StyleRegistry from './StyleRegistry';
import { fetchCMS } from '@_api/fetchCMS';
import { PublicEnvProvider } from 'next-runtime-env';
import type { Viewport } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'AELF Block Explorer',
  description: 'AELF explorer',
  icons: {
    icon: process.env?.NEXT_PUBLIC_NETWORK_TYPE === 'TESTNET' ? '/favicon.test.ico' : '/favicon.ico',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = headers();
  const isMobile = isMobileOnServer(headersList);
  const { headerMenuList, footerMenuList, chainList, networkList, config, chartImg } = await fetchCMS();
  const mockChainlist = [
    {
      chainList_id: {
        date_created: '2024-04-25T12:42:17.000Z',
        date_updated: '2024-05-30T06:26:22.000Z',
        id: 3,
        index: 1,
        key: 'multiChain',
        label: 'All Chains',
        user_created: '16285d01-1de1-4eeb-ab7a-a26d6323a488',
        user_updated: '16285d01-1de1-4eeb-ab7a-a26d6323a488',
      },
    },
    ...chainList,
  ];
  return (
    <html lang="en">
      <Script
        id="google-tag-manager"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-NZFQDZCT');`,
        }}></Script>

      <body>
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe
                src="https://www.googletagmanager.com/ns.html?id=GTM-NZFQDZCT"
                height="0"
                width="0"
                style="display:none;visibility:hidden"></iframe>`,
          }}></noscript>
        <div className="relative box-border min-h-screen bg-[#FBFBFB]">
          <PublicEnvProvider>
            <StyleRegistry>
              <RootProvider isMobileSSR={isMobile} config={config} chartImg={chartImg}>
                <Suspense>
                  <Header chainList={mockChainlist} networkList={networkList} headerMenuList={headerMenuList} />
                </Suspense>
                <Suspense>
                  <MainContainer>{children}</MainContainer>
                </Suspense>
                <Suspense>
                  <Footer isMobileSSR={isMobile} footerMenuList={footerMenuList} />
                </Suspense>
              </RootProvider>
            </StyleRegistry>
          </PublicEnvProvider>
        </div>
      </body>
    </html>
  );
}

// By default server components are statically generated at build-time. To make
// sure the env vars are actually loaded use, add the following line to server
// components that use [env]. 👇
export const dynamic = 'force-dynamic';

// https://nextjs.org/docs/app/api-reference/functions/generate-viewport#the-viewport-object
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};
