import SourceCode, { IContractSourceCode } from './sourceCode';
import clsx from 'clsx';
import { useMobileAll } from '@_hooks/useResponsive';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchContractCode } from '@_api/fetchContact';
import { TChainID } from '@_api/type';
import { getAddress, getFirstHashValue, getSecondHashValue } from '@_utils/formatter';
import { Skeleton } from 'antd';
import { useMobileContext } from '@app/pageProvider';
import { getAElf, getContractInstance } from '@_utils/deserializeLog';
import { getContractMethods } from '@portkey/contracts';
import { useEffectOnce } from 'react-use';
import DynamicForm from '../DynamicForm';
import './index.css';

export interface IInputItem {
  name: string;
  type: string;
}

export interface IMethod {
  name: string;
  input: IInputItem[];
  fn: any;
  address?: string;
  type: 'read' | 'write';
  key?: string | number;
  activeKey?: string | number;
}

export const contractKey = ['ReadContract', 'WriteContract'];

export default function Contract() {
  const isMobile = useMobileAll();
  const { config } = useMobileContext();
  const { chain, address } = useParams<{ chain: TChainID; address: string }>();
  const RPC_URL = config['rpcUrl' + chain];

  const aelfInstance = getAElf(RPC_URL);
  const [loading, setLoading] = useState<boolean>();
  const [contractInfo, setContractInfo] = useState<IContractSourceCode>();
  const [writeMethods, setWriteMethods] = useState<IMethod[]>([]);
  const [readMethods, setReadMethods] = useState<IMethod[]>([]);
  const [contract, setContract] = useState<any>();

  const transferMethods = async (methodsObj: any) => {
    const viewMethod: string[] = await aelfInstance?.chain.getContractViewMethodList(getAddress(address));
    const res: IMethod[] = [];
    const readRes: IMethod[] = [];
    const keysArr = Object.keys(methodsObj);
    for (let i = 0; i < keysArr.length; i++) {
      const temp: any = {};
      temp.name = keysArr[i];
      const fields = methodsObj[keysArr[i]].fields;
      temp.input = Object.keys(fields).map((item) => {
        return {
          name: item,
          type: fields[item].type,
        };
      });
      const isRead = viewMethod.includes(temp.name);
      temp.type = !isRead ? 'write' : 'read';
      temp.fn = methodsObj[keysArr[i]];
      if (isRead) {
        readRes.push(temp);
      } else {
        res.push(temp);
      }
    }
    return {
      readMethods: readRes,
      writeMethods: res,
    };
  };
  const getMethod = useCallback(async () => {
    const methods = await getContractMethods(aelfInstance, address);
    const contract = await getContractInstance(getAddress(address), RPC_URL);
    setContract(contract);
    const { readMethods, writeMethods } = await transferMethods(methods);
    setWriteMethods(writeMethods);
    setReadMethods(readMethods);
    console.log(methods, 'methods', readMethods, writeMethods);
  }, [RPC_URL, address, aelfInstance]);
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchContractCode({
        chainId: chain,
        address: getAddress(address),
      });
      setContractInfo(data);
    } finally {
      setLoading(false);
    }
  }, [address, chain]);

  const [activeKey, setActiveKey] = useState<string>('Code');

  const tabChange = (key) => {
    setActiveKey(key);
    window.location.hash = key;
  };

  const items = useMemo(() => {
    return [
      {
        key: 'Code',
        label: 'Code',
        children: (
          <div className="contract-container">
            <div
              className={clsx(isMobile && 'flex-col', 'contract-header mx-4 flex border-b border-color-divider pb-4')}>
              <div className="list-items mr-4 w-[197px] pr-4">
                <div className="item-label font10px leading-[18px] text-base-200">CONTRACT NAME</div>
                <div className="item-value text-sm leading-[22px] text-base-100">{contractInfo?.contractName}</div>
              </div>
              <div className={clsx(isMobile && 'mt-4 !pl-0', 'list-items pl-4')}>
                <div className="item-label font10px leading-[18px] text-base-200">CONTRACT VERSION</div>
                <div className="item-value text-sm leading-[22px] text-base-100">{contractInfo?.contractVersion}</div>
              </div>
            </div>
            {contractInfo && <SourceCode contractInfo={contractInfo} />}
            {/* <Protocol /> */}
          </div>
        ),
      },
      {
        key: 'ReadContract',
        label: 'Read Contract',
        children: <DynamicForm methods={readMethods} contract={contract} chain={chain} address={address} />,
      },
      {
        key: 'WriteContract',
        label: 'Write Contract',
        children: <DynamicForm methods={writeMethods} contract={contract} chain={chain} address={address} />,
      },
    ];
  }, [address, chain, contract, contractInfo, isMobile, readMethods, writeMethods]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffectOnce(() => {
    const hash = getFirstHashValue(window.location.href);
    setActiveKey(hash);
    getMethod();
  });

  return loading ? (
    <div className="p-2">
      <Skeleton active />
    </div>
  ) : (
    <div className="contract-container px-4">
      <div className="pb-5">
        <ul className="contract-button-container flex gap-[9px]">
          {items.map((item) => {
            return (
              <li key={item.key} className="contract-button" onClick={() => tabChange(item.key)}>
                <a
                  className={clsx('contract-button-link', activeKey === item.key && 'active-button-link')}
                  href="javascript:;">
                  <span>{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="contract-pane-container">
        {items.map((item) => {
          return (
            <div className={clsx('contract-pane', activeKey === item.key ? 'block' : 'hidden')} key={item.key}>
              {item.children}
            </div>
          );
        })}
      </div>
    </div>
  );
}
