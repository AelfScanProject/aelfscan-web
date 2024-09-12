'use client';
import { Select, SelectProps } from 'antd';
import { useParams } from 'next/navigation';
const { Option } = Select;
import './index.css';
import { useMemo } from 'react';
import { useAppSelector } from '@_store';

export default function MultiChainSelect({ props }: { props: SelectProps }) {
  const { chainArr } = useAppSelector((state) => state.getChainId);

  const { chain } = useParams();
  const selectChain = useMemo(() => {
    return chain as string;
  }, [chain]);

  const chainList = useMemo(() => {
    return [
      {
        key: 'multiChain',
        label: 'All Chains',
      },
      ...chainArr,
    ];
  }, [chainArr]);

  return (
    <div className="chain-select-container" id="chain-select-container">
      <Select
        className="chain-select common-select-wrapper"
        popupClassName="chain-select-options"
        popupMatchSelectWidth={false}
        defaultValue={selectChain}
        {...props}>
        {chainList?.map((item) => {
          return (
            <Option className="common-select-option-wrapper chain-select-option" key={item.key} value={item.key}>
              {chainList.find((ele) => ele.key === item.key)!.label}
            </Option>
          );
        })}
      </Select>
    </div>
  );
}
