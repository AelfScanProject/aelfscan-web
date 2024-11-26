'use client';
import { Select, SelectProps } from 'antd';
import { useSearchParams } from 'next/navigation';
const { Option } = Select;
import './index.css';
import { memo, useMemo } from 'react';
import clsx from 'clsx';
import IconFont from '@_components/IconFont';
import { MULTI_CHAIN } from '@_utils/contant';
import { useHeaderContext } from '@app/pageProvider';

function MultiChainSelect({ props, className }: { props: SelectProps; className?: string }) {
  const { chainList } = useHeaderContext();
  const chainArr = useMemo(() => {
    return chainList.map((ele) => ele.chainList_id);
  }, [chainList]);

  const params = useSearchParams();
  const chain = useMemo(() => {
    return params.get('chain') || MULTI_CHAIN;
  }, [params]);
  const selectChain = useMemo(() => {
    return chain as string;
  }, [chain]);

  return (
    <div className="chain-select-container w-full !py-0" id="chain-select-container" suppressHydrationWarning>
      <Select
        className={clsx('chain-select common-select-wrapper w-full max-w-[304px] min-[769px]:w-[160px]', className)}
        popupClassName="chain-select-options"
        popupMatchSelectWidth={false}
        suffixIcon={<IconFont width={16} height={16} type="chevron-down" />}
        defaultValue={selectChain}
        {...props}>
        {chainArr?.map((item) => {
          return (
            <Option className="common-select-option-wrapper chain-select-option" key={item.key} value={item.key}>
              <span className="flex items-center gap-2" suppressHydrationWarning>
                {item.key === (props.value || selectChain) ? (
                  <IconFont className="check text-base" type="Check" />
                ) : (
                  <div className="check size-4"></div>
                )}
                {chainArr.find((ele) => ele.key === item.key)!.label}
              </span>
            </Option>
          );
        })}
      </Select>
    </div>
  );
}

export default memo(MultiChainSelect);
