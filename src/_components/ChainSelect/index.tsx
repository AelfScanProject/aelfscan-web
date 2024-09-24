'use client';
import { Select } from 'antd';
import { useAppDispatch, useAppSelector } from '@_store';
import { setDefaultChain } from '@_store/features/chainIdSlice';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
const { Option } = Select;
import './index.css';
import { useMemo } from 'react';
import { useEffectOnce } from 'react-use';
import { DEFAULT_CHAIN } from '@_utils/contant';

export default function ChainSelect({ setCurrent }) {
  const { chainArr, defaultChain } = useAppSelector((state) => state.getChainId);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { chain } = useParams();
  const chainId = useSearchParams().get('chainId');
  const selectChain = useMemo(() => {
    return (chain as string) || defaultChain;
  }, [chain, defaultChain]);

  const onChangeHandler = (value: string) => {
    dispatch(setDefaultChain(value));
    if (value === DEFAULT_CHAIN) {
      router.push('/');
    } else {
      router.push(`/${value}`);
    }
    setCurrent('/');
  };

  useEffectOnce(() => {
    const defaultChain = chain || chainId;
    if (defaultChain) {
      dispatch(setDefaultChain(defaultChain));
    }
  });

  return (
    <div className="chain-select-container" id="chain-select-container">
      <Select
        className="chain-select common-select-wrapper !h-10 min-w-[126px]"
        popupClassName="chain-select-options"
        value={selectChain}
        popupMatchSelectWidth={false}
        getPopupContainer={() => document.getElementById('chain-select-container')!}
        onChange={onChangeHandler}>
        {chainArr?.map((item) => {
          return (
            <Option className="common-select-option-wrapper chain-select-option" key={item.key} value={item.key}>
              {chainArr.find((ele) => ele.key === item.key)!.label}
            </Option>
          );
        })}
      </Select>
    </div>
  );
}
