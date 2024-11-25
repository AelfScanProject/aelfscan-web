import { Collapse, message } from 'antd';

import FormItem from './formItem';
import { IMethod } from '../Contract';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import WalletIcon from 'public/image/wallet.svg';
import Image from 'next/image';
import ContractToken from '@_components/ContractToken';
import { AddressType } from '@_types/common';
import './index.css';
import Copy from '@_components/Copy';
import addressFormat from '@_utils/urlUtils';
import { useMD } from '@_hooks/useResponsive';
import IconFont from '@_components/IconFont';
import clsx from 'clsx';
import copy from 'copy-to-clipboard';
import EPTooltip from '@_components/EPToolTip';
import { useEffect } from 'react';
import { getSecondHashValue } from '@_utils/formatter';
import { TelegramPlatform } from '@portkey/did-ui-react';
import { TChainID } from '@_api/type';

export default function DynamicForm({
  methods,
  address,
  contract,
  chain,
  activeKey,
}: {
  methods: IMethod[];
  address: string;
  contract: any;
  chain: string;
  activeKey: string;
}) {
  const { connectWallet, walletInfo, isConnected, disConnectWallet } = useConnectWallet();
  const isMd = useMD();
  const onConnectBtnClickHandler = async () => {
    if (isConnected) return;
    try {
      const rs = await connectWallet();
    } catch (e: any) {
      console.log(e.message, 'e.message');
      message.error(e.message);
    }
  };
  const handleCopy = (value) => {
    message.destroy();
    try {
      copy(value);
      message.success('Copied');
    } catch (e) {
      message.error('Copy failed, please copy by yourself.');
    }
  };

  useEffect(() => {
    const hash = getSecondHashValue(window.location.href);
    if (hash) {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  return (
    <div className="contract-collapse-container pb-4">
      <div className="flex flex-wrap items-center gap-2 pb-4">
        <div
          className="boder-border flex h-9 w-auto cursor-pointer items-center gap-1 rounded-md border border-solid px-2 py-[6px]"
          onClick={onConnectBtnClickHandler}>
          <Image className="rounded-[50%]" src={WalletIcon} alt="wallet" width={16} height={16} />
          {isConnected ? (
            <div className="wallet-address flex items-center text-sm">
              <span className="mr-px">Connected:</span>
              <ContractToken
                showCopy={false}
                count={isMd ? 2 : 4}
                address={walletInfo?.address || ''}
                type={AddressType.address}
                chainIds={[chain as TChainID]}
              />
            </div>
          ) : (
            <div className="text-sm text-primary">Connect wallet</div>
          )}
        </div>
        {isConnected && (
          <div className="flex items-center gap-2">
            <div className="item-center flex size-9 justify-center rounded-md border border-border bg-white ">
              <Copy value={addressFormat(walletInfo?.address || '', chain)} type="copy-f731al63" />
            </div>
            {!TelegramPlatform.isTelegramPlatform() && (
              <div
                className="logout-warpper boder-border flex size-9 cursor-pointer items-center justify-center rounded-md border border-border bg-white"
                onClick={disConnectWallet}>
                <IconFont className="text-base" type="log-out"></IconFont>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4">
        {methods.map((item, index) => {
          return (
            <div key={item.name} id={item.name}>
              <Collapse
                expandIconPosition="end"
                expandIcon={({ isActive }) => (
                  <IconFont
                    type="chevron-down-f731al7b"
                    className={clsx('arrow text-base', isActive ? 'rotate-180' : 'rotate-0')}
                  />
                )}
                items={[
                  {
                    key: item.name,
                    label: (
                      <div className={`w-full truncate pr-1 ${isMd && 'min-w-0'}`}>
                        {index + 1}.
                        <EPTooltip mode="dark" placement="top" title={item.name}>
                          <span>{item.name}</span>
                        </EPTooltip>
                      </div>
                    ),
                    extra: (
                      <div className="flex items-center gap-4">
                        <EPTooltip mode="dark" placement="top" title="Copy Method Name">
                          <IconFont
                            type="copy-f731al8a"
                            className="text-base"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(item.name);
                            }}
                          />
                        </EPTooltip>
                        <EPTooltip mode="dark" placement="top" title="Copy Permalink">
                          <IconFont
                            type="link-f731al7a"
                            className="text-base"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(window.location.href + `&type=${activeKey}` + '#' + item.name);
                            }}
                          />
                        </EPTooltip>
                      </div>
                    ),
                    children: (
                      <FormItem
                        address={address}
                        contract={contract}
                        type={item.type}
                        name={item.name}
                        input={item.input}
                        fn={item.fn}></FormItem>
                    ),
                  },
                ]}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
