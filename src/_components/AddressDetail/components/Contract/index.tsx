import SourceCode, { IContractSourceCode } from './sourceCode';
import clsx from 'clsx';
import { useMobileAll } from '@_hooks/useResponsive';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { fetchContractCode } from '@_api/fetchContact';
import { TChainID } from '@_api/type';
import { getAddress } from '@_utils/formatter';
import { Skeleton } from 'antd';
import { useMobileContext } from '@app/pageProvider';
import { getAElf, getContractInstance } from '@_utils/deserializeLog';
import { getContractMethods } from '@portkey/contracts';
import { useEffectOnce } from 'react-use';
import DynamicForm from '../DynamicForm';
import './index.css';
import Link from 'next/link';
import ContractInfoIcon from 'public/image/contract-info.svg';
import Image from 'next/image';
import ContractSuccessIcon from 'public/image/contract-success.svg';

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

export default function Contract({ setIsVerify, isVerify }) {
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

  const transferMethods = useCallback(
    async (methodsObj: any) => {
      let viewMethod: string[] = [];
      try {
        const response = await fetch(`${RPC_URL}/api/contract/ContractViewMethodList?address=${getAddress(address)}`);
        if (response.ok) {
          viewMethod = await response.json();
        } else {
          console.log('fetch fail');
        }
      } catch (error) {
        console.log(error, 'error');
      }

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
    },
    [RPC_URL, address],
  );
  const getMethod = useCallback(async () => {
    const methods = await getContractMethods(aelfInstance, address);
    const contract = await getContractInstance(getAddress(address), RPC_URL);
    setContract(contract);
    const { readMethods, writeMethods } = await transferMethods(methods);
    setWriteMethods(writeMethods);
    setReadMethods(readMethods);
  }, [RPC_URL, address, aelfInstance, transferMethods]);
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchContractCode({
        chainId: chain,
        address: getAddress(address),
      });

      setContractInfo(data);

      setIsVerify(data.isVerify);
    } finally {
      setLoading(false);
    }
  }, [address, chain, setIsVerify]);

  const searchParams = useSearchParams();
  const defaultKey = searchParams.get('type');

  const [activeKey, setActiveKey] = useState<string>((defaultKey as string) || 'code');

  const tabChange = (key) => {
    setActiveKey(key);
  };

  const items = useMemo(() => {
    return [
      {
        key: 'code',
        label: 'Code',
        children: (
          <div className="contract-container">
            {isVerify && (
              <div className="code-title mb-4 flex items-center gap-1 text-sm font-medium leading-[22px] text-base-100">
                <Image alt="" src={ContractSuccessIcon} width={16} height={16}></Image>Contract Source Code Verified
                <span className="font-normal text-base-200">(Exact Match)</span>
              </div>
            )}
            <div
              className={clsx(isMobile && 'flex-col', 'contract-header mx-4 flex border-b border-color-divider pb-4')}>
              <div className="list-items mr-4 min-w-[197px] pr-4">
                <div className="item-label font10px leading-[18px] text-base-200">CONTRACT NAME</div>
                <div className="item-value text-wrap break-words text-sm leading-[22px] text-base-100">
                  {contractInfo?.contractName}
                </div>
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
        key: 'readcontract',
        label: 'Read Contract',
        children: (
          <DynamicForm
            activeKey={activeKey}
            methods={readMethods}
            contract={contract}
            chain={chain}
            address={address}
          />
        ),
      },
      {
        key: 'writecontract',
        label: 'Write Contract',
        children: (
          <DynamicForm
            activeKey={activeKey}
            methods={writeMethods}
            contract={contract}
            chain={chain}
            address={address}
          />
        ),
      },
    ];
  }, [isVerify, isMobile, contractInfo, activeKey, readMethods, contract, chain, address, writeMethods]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffectOnce(() => {
    getMethod();
  });

  return loading ? (
    <div className="p-2">
      <Skeleton active />
    </div>
  ) : (
    <div className="contract-container px-4">
      {!isVerify && (
        <div className="title mb-2 flex items-start   gap-1 text-sm font-medium leading-[22px] text-base-100 min-[769px]:items-center">
          <Image
            alt=""
            className="mt-[3px] align-middle min-[769px]:mt-0"
            src={ContractInfoIcon}
            width={16}
            height={16}
          />
          <span className="inline-block">
            Are you the contract creator?{' '}
            <Link className="!inline" href={`/${chain}/source-code/${address}`}>
              Verify and Publish
            </Link>{' '}
            your contract source code today!
          </span>
        </div>
      )}
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
