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
import type { ICMSChartImageConfig } from '@_api/fetchCMS';
// import { wrapper } from '@_store';
import { createContext, useContext, useRef } from 'react';
import { AELFDProvider } from 'aelf-design';
import 'aelf-design/css';
import { ConfigProvider } from 'antd';
import { Provider as ReduxProvider } from 'react-redux';
import WebLoginProvider from './webLoginProvider';
// const OpentelemetryProvider = dynamic(
//   () => import('./opentelemetryProvider').then((mod) => mod.OpentelemetryProvider),
//   { ssr: false },
// );

interface IMobileContextValue {
  isMobileSSR: boolean;
  config: Record<string, any>;
  chartImg?: ICMSChartImageConfig;
}

interface IRootProviderProps {
  children: React.ReactNode;
  isMobileSSR: boolean;
  config: Record<string, any>;
  chartImg?: ICMSChartImageConfig;
  networkList: any[];
  headerMenuList: any[];
  chainList: any[];
}

const MobileContext = createContext<IMobileContextValue>({
  isMobileSSR: false,
  config: {},
});
const HeaderContext = createContext<any>({});

const useMobileContext = () => {
  return useContext(MobileContext);
};
const useHeaderContext = () => {
  return useContext(HeaderContext);
};
export { useMobileContext, useHeaderContext };

function RootProvider({
  children,
  isMobileSSR,
  config,
  chartImg,
  networkList,
  headerMenuList,
  chainList,
}: IRootProviderProps) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return (
    <AELFDProvider prefixCls={PREFIXCLS} theme={THEME_CONFIG}>
      <ConfigProvider prefixCls={PREFIXCLS} theme={THEME_CONFIG}>
        <HeaderContext.Provider value={{ networkList, headerMenuList, chainList }}>
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
        </HeaderContext.Provider>
      </ConfigProvider>
    </AELFDProvider>
  );
}

export default RootProvider;
