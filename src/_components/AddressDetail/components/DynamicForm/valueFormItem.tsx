import { Input, Dropdown } from 'aelf-design';
import { Form, MenuProps } from 'antd';
import { IInputItem } from '../Contract';
import { useCallback, useMemo, useState } from 'react';
import Image from 'next/image';
import addIcon from 'public/image/add.svg';
import downIcon from 'public/image/down.svg';
import './index.css';
import BigNumber from 'bignumber.js';
import clsx from 'clsx';

const getLog10 = (value) => {
  const bigX = new BigNumber(value);
  const log10Value = Math.log(bigX.toNumber()) / Math.log(10);
  return Math.ceil(new BigNumber(log10Value).toNumber());
};

export default function ValueFormItem({ data, form, type }: { data: IInputItem; form: any; type: string }) {
  const [value, setValue] = useState('');
  const items: MenuProps['items'] = useMemo(() => {
    return [
      {
        label: (
          <div className="menu-label">
            <span className="max">10</span>
            <span className="min">8</span>
          </div>
        ),
        key: 100000000,
      },
      {
        label: (
          <div className="menu-label">
            <span className="max">10</span>
            <span className="min">12</span>
          </div>
        ),
        key: 1000000000000,
      },
      {
        label: (
          <div className="menu-label">
            <span className="max">10</span>
            <span className="min">16</span>
          </div>
        ),
        key: 10000000000000000,
      },
      {
        label: (
          <div className="menu-label">
            <span className="max">10</span>
            <span className="min">18</span>
          </div>
        ),
        key: 1000000000000000000,
      },
      {
        label: (
          <div className="menu-label">
            <span className="max">10</span>
            <span className="min">20</span>
          </div>
        ),
        key: 100000000000000000000,
      },
      {
        label: (
          <div
            className="menu-label flex items-center gap-2"
            onClick={(e) => {
              e.stopPropagation();
            }}>
            <span className="max">10 ^</span>
            <Input
              allowClear={false}
              onPressEnter={(e) => {
                const target = e.target as HTMLInputElement;
                const bigNumberInstance = new BigNumber(10);
                const result = bigNumberInstance.pow(Number(target.value));
                setValue(result.toString());
              }}
              className="!h-5 w-10 py-0 !text-xs !text-base-100"
              size="small"
            />
          </div>
        ),
        key: 'input',
      },
    ];
  }, []);

  const handleMenuClick: MenuProps['onClick'] = useCallback((e) => {
    console.log('clickMenuProps', e);
    if (e.key !== 'input') {
      console.log('clickMenuProps2', e);
      setValue(e.key);
    }
  }, []);
  const label = useMemo(() => {
    return (
      <div className="menu-container flex items-center gap-2">
        <span>
          {data.name} ({type})
        </span>
        {value && (
          <div
            className="show-count rounded bg-ECEEF2 px-2"
            onClick={() => {
              form.setFieldsValue({ [data.name]: value });
            }}>
            <span className="max">10</span>
            <span className="min">{getLog10(value)}</span>
          </div>
        )}
        <Dropdown
          overlayClassName="contract-count-select"
          autoFocus
          trigger={['click']}
          menu={{ items, onClick: handleMenuClick }}>
          <div className={clsx('cursor-pointer rounded bg-ECEEF2 leading-5', value ? 'p-[6px]' : 'p-1')}>
            {!value ? (
              <Image alt="add" src={addIcon} height={10} width={10} />
            ) : (
              <Image alt="add" src={downIcon} height={10} width={10} />
            )}
          </div>
        </Dropdown>
      </div>
    );
  }, [data, form, handleMenuClick, items, type, value]);
  return (
    <Form.Item key={data.name} label={label} name={data.name}>
      <Input size="small" />
    </Form.Item>
  );
}
