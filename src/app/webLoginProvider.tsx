'use client';
import { PortkeyDiscoverWallet } from '@aelf-web-login/wallet-adapter-portkey-discover';
import { PortkeyAAWallet } from '@aelf-web-login/wallet-adapter-portkey-aa';
import { NightElfWallet } from '@aelf-web-login/wallet-adapter-night-elf';
import { IBridgeAPI, IConfigProps } from '@aelf-web-login/wallet-adapter-bridge';
import { TChainId, SignInDesignEnum, NetworkEnum } from '@aelf-web-login/wallet-adapter-base';
// import { WebLoginProvider, init } from '@aelf-web-login/wallet-adapter-react';
import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { init } from '@aelf-web-login/wallet-adapter-react';

const APP_NAME = 'explorer.aelf.io';
const WEBSITE_ICON = 'https://explorer.aelf.io/favicon.main.ico';

export default function ExWebLoginProvider({ children, config }) {
  const NETWORK_TYPE = config.NETWORK_TYPE === 'test' ? NetworkEnum.TESTNET : NetworkEnum.MAINNET;
  const chain = config.chain;
  console.log(config, 'config');
  const chainId = useMemo(() => {
    return chain as TChainId;
  }, [chain]);

  const didConfig = {
    graphQLUrl: config.GRAPHQL_SERVER,
    connectUrl: config.CONNECT_SERVER,
    requestDefaults: {
      baseURL: config.BASE_URL,
      timeout: 30000,
    },
    socialLogin: {
      Portkey: {
        websiteName: APP_NAME,
        websiteIcon: WEBSITE_ICON,
      },
    },
  };

  const baseConfig = {
    networkType: NETWORK_TYPE,
    chainId: chainId,
    keyboard: true,
    noCommonBaseModal: false,
    design: SignInDesignEnum.CryptoDesign,
    titleForSocialDesign: 'Crypto wallet',
    iconSrcForSocialDesign: 'url or base64',
  };

  const wallets = [
    new PortkeyAAWallet({
      appName: APP_NAME,
      chainId: chainId,
      autoShowUnlock: true,
    }),
    new PortkeyDiscoverWallet({
      networkType: NETWORK_TYPE,
      chainId: chainId,
      autoRequestAccount: true,
      autoLogoutOnDisconnected: true,
      autoLogoutOnNetworkMismatch: true,
      autoLogoutOnAccountMismatch: true,
      autoLogoutOnChainMismatch: true,
    }),
    new NightElfWallet({
      chainId: chainId,
      appName: APP_NAME,
      connectEagerly: true,
      defaultRpcUrl: config.rpcUrlAELF,
      nodes: {
        AELF: {
          chainId: 'AELF',
          rpcUrl: config.rpcUrlAELF,
        },
        tDVW: {
          chainId: 'tDVW',
          rpcUrl: config.rpcUrltDVW,
        },
        tDVV: {
          chainId: 'tDVV',
          rpcUrl: config.rpcUrltDVV,
        },
      },
    }),
  ];

  const WebLoginProvider = dynamic(
    async () => {
      const weblogin = await import('@aelf-web-login/wallet-adapter-react').then((module) => module);
      return weblogin.WebLoginProvider;
    },
    { ssr: false },
  ) as any;

  const loginConfig: IConfigProps = {
    didConfig,
    baseConfig,
    wallets,
  };

  const bridgeAPI = init(loginConfig); // upper config
  return <WebLoginProvider bridgeAPI={bridgeAPI}>{children}</WebLoginProvider>;
}
