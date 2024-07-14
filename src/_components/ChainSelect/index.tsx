'use client';
import { Select } from 'antd';
import { useAppDispatch, useAppSelector } from '@_store';
import { setDefaultChain } from '@_store/features/chainIdSlice';
import { useParams, useRouter } from 'next/navigation';
const { Option } = Select;
import './index.css';
import { useMemo } from 'react';
import { useEffectOnce } from 'react-use';

export default function ChainSelect({ setCurrent }) {
  const { chainArr, defaultChain } = useAppSelector((state) => state.getChainId);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { chain } = useParams();
  const selectChain = useMemo(() => {
    return (chain as string) || defaultChain;
  }, [chain, defaultChain]);

  const onChangeHandler = (value: string) => {
    dispatch(setDefaultChain(value));
    if (value === 'AELF') {
      router.push('/');
    } else {
      router.push(`/${value}`);
    }
    setCurrent('/');
  };

  useEffectOnce(() => {
    if (chain) {
      dispatch(setDefaultChain(chain));
    }
  });

  return (
    <div className="chain-select-container">
      <Select
        className="chain-select common-select-wrapper"
        popupClassName="chain-select-options"
        value={selectChain}
        popupMatchSelectWidth={false}
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
