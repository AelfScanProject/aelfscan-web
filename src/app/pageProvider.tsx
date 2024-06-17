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
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { AELFDProvider } from 'aelf-design';
import 'aelf-design/css';
import { ConfigProvider } from 'antd';
import { Provider as ReduxProvider } from 'react-redux';
import useResponsive from '@_hooks/useResponsive';
import WebLoginProvider from './webLoginProvider';

const MobileContext = createContext<any>({});

const useMobileContext = () => {
  return useContext(MobileContext);
};
export { useMobileContext };

function RootProvider({ children, isMobileSSR, config }) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  const [isMobile, setIsMobile] = useState(isMobileSSR);
  const { isMobile: isMobileClient } = useResponsive();
  useEffect(() => {
    setIsMobile(isMobileClient);
  }, [isMobileClient]);

  return (
    <AELFDProvider prefixCls={PREFIXCLS} theme={THEME_CONFIG}>
      <ConfigProvider prefixCls={PREFIXCLS} theme={THEME_CONFIG}>
        <MobileContext.Provider value={{ isMobileSSR: isMobileSSR, config }}>
          <ReduxProvider store={storeRef.current}>
            <WebLoginProvider config={config}>
              <div className="flex min-h-screen flex-col justify-between">{children}</div>
            </WebLoginProvider>
          </ReduxProvider>
        </MobileContext.Provider>
      </ConfigProvider>
    </AELFDProvider>
  );
}

export default RootProvider;
