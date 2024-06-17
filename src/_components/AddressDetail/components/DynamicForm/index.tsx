import { Collapse } from 'antd';

import FormItem from './formItem';
import { IMethod } from '../Contract';
import { Button } from 'aelf-design';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';

const { Panel } = Collapse;

export default function DynamicForm({
  methods,
  address,
  contract,
}: {
  methods: IMethod[];
  address: string;
  contract: any;
}) {
  const { connectWallet, walletInfo, isConnected } = useConnectWallet();

  const onConnectBtnClickHandler = async () => {
    try {
      const rs = await connectWallet();
    } catch (e: any) {
      console.log(e.message);
    }
  };
  return (
    <div className="px-4 pb-4">
      <div>
        {isConnected ? (
          walletInfo?.address
        ) : (
          <Button type="primary" onClick={onConnectBtnClickHandler}>
            Connect Wallet
          </Button>
        )}
      </div>
      <Collapse defaultActiveKey={['0']} className="rounded-md">
        {methods.map((ele) => {
          return (
            <Panel key={ele.name} showArrow={true} header={<span className="font-semibold">{ele.name}</span>}>
              <FormItem
                address={address}
                contract={contract}
                type={ele.type}
                name={ele.name}
                input={ele.input}
                fn={ele.fn}></FormItem>
            </Panel>
          );
        })}
      </Collapse>
    </div>
  );
}
