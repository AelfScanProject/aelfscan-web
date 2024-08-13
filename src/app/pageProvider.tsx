/*
 * @Author: aelf-lxy
 * @Date: 2023-08-01 20:31:39
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-02 15:02:03
 * @Description: empty
 */

'use client';

import { PREFIXCLS, THEME_CONFIG } from '@_lib/AntdThemeConfig';
import { makeStore, AppStore } from '@_store';
// import { wrapper } from '@_store';
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AELFDProvider } from 'aelf-design';
import 'aelf-design/css';
import { ConfigProvider } from 'antd';
import { Provider as ReduxProvider } from 'react-redux';
import useResponsive from '@_hooks/useResponsive';
import dynamic from 'next/dynamic';
import WebLoginProvider from './webLoginProvider';
// const OpentelemetryProvider = dynamic(
//   () => import('./opentelemetryProvider').then((mod) => mod.OpentelemetryProvider),
//   { ssr: false },
// );

const MobileContext = createContext<any>({});

const useMobileContext = () => {
  return useContext(MobileContext);
};
export { useMobileContext };

function RootProvider({ children, isMobileSSR, config, chartImg }) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  const [isMobile, setIsMobile] = useState(isMobileSSR);
  const { isMobile: isMobileClient } = useResponsive();
  useEffect(() => {
    setIsMobile(isMobileClient);
  }, [isMobileClient]);

  // const WebLoginProvider = useMemo(() => {
  //   return dynamic(
  //     async () => {
  //       return import('./webLoginProvider');
  //     },
  //     { ssr: false },
  //   );
  // }, []);

  return (
    <AELFDProvider prefixCls={PREFIXCLS} theme={THEME_CONFIG}>
      <ConfigProvider prefixCls={PREFIXCLS} theme={THEME_CONFIG}>
        <MobileContext.Provider value={{ isMobileSSR: isMobileSSR, config, chartImg }}>
          <ReduxProvider store={storeRef.current}>
            <WebLoginProvider config={config}>
              {/* <OpentelemetryProvider config={config}> */}
              <div id="scroll-content" className="flex min-h-screen flex-col justify-between">
                {children}
              </div>
              {/* </OpentelemetryProvider> */}
            </WebLoginProvider>
          </ReduxProvider>
        </MobileContext.Provider>
      </ConfigProvider>
    </AELFDProvider>
  );
}

export default RootProvider;
