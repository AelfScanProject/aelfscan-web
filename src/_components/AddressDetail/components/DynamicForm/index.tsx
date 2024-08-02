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
  const { connectWallet, walletInfo, isConnected } = useConnectWallet();
  const isMd = useMD();
  const onConnectBtnClickHandler = async () => {
    if (isConnected) return;
    try {
      const rs = await connectWallet();
    } catch (e: any) {
      console.log(e.message, 'e.message');
      // console.log(did, 'diddiddid');
      message.error(e.message);
    }
  };
  const handleCopy = (value) => {
    message.destroy();
    try {
      copy(value);
      message.success('Copied Successfully');
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
      <div className="flex pb-4">
        <div
          className="boder-color-divider flex w-auto cursor-pointer items-center gap-2 rounded-md border border-solid px-2 py-1"
          onClick={onConnectBtnClickHandler}>
          <Image src={WalletIcon} alt="wallet" width={14} height={14} />
          {isConnected ? (
            <div className="wallet-address flex items-center">
              Connected - Portkey Wallet [
              <ContractToken
                showCopy={false}
                count={isMd ? 2 : 4}
                address={walletInfo?.address || ''}
                type={AddressType.address}
                chainId={chain}
              />
              ]
              <Copy value={addressFormat(walletInfo?.address || '', chain)} />
            </div>
          ) : (
            <div className="text-xs leading-5 text-base-100">Connect to wallet</div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {methods.map((item, index) => {
          return (
            <div key={item.name} id={item.name}>
              <Collapse
                collapsible="header"
                expandIconPosition="end"
                expandIcon={({ isActive }) => (
                  <IconFont
                    type="right-arrow-dfna6beo"
                    className={clsx('arrow text-xs', isActive ? 'rotate-90' : 'rotate-0')}
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
                            type="view-copy"
                            onClick={() => {
                              handleCopy(item.name);
                            }}
                          />
                        </EPTooltip>
                        <EPTooltip mode="dark" placement="top" title="Copy Permalink">
                          <IconFont
                            type="link"
                            onClick={() => {
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
