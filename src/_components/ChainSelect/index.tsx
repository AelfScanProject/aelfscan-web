'use client';
import { Select } from 'antd';
import { useAppSelector } from '@_store';
import { useParams, useSearchParams } from 'next/navigation';
const { Option } = Select;
import './index.css';
import { useMemo } from 'react';
import { MenuItem } from '@_types';
import useChainSelect from '@_hooks/useChainSelect';

export default function ChainSelect({
  setCurrent,
  headerList,
}: {
  headerList: MenuItem[];
  setCurrent: (key: string) => void;
}) {
  const { chainArr, defaultChain } = useAppSelector((state) => state.getChainId);

  const { chain } = useParams();
  const chainId = useSearchParams().get('chainId');
  const selectChain = useMemo(() => {
    return chainId || (chain as string) || defaultChain;
  }, [chain, chainId, defaultChain]);

  const onChangeHandler = useChainSelect(headerList, setCurrent);
  return (
    <div className="chain-select-container" id="chain-select-container">
      {chainArr && chainArr.length > 0 && (
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
      )}
    </div>
  );
}
