import { Input, Dropdown } from 'aelf-design';
import { Form, MenuProps } from 'antd';
import { IInputItem } from '../Contract';
import { useCallback, useMemo, useState } from 'react';
import Image from 'next/image';
import addIcon from 'public/image/add.svg';
import downIcon from 'public/image/down.svg';
import './index.css';
import clsx from 'clsx';

export default function ValueFormItem({ data, form, type }: { data: IInputItem; form: any; type: string }) {
  const [value, setValue] = useState('');

  const [customValue, setCustomValue] = useState('');
  const [customValueView, setCustomValueView] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if (reg.test(inputValue) || inputValue === '' || inputValue === '-') {
      setCustomValue(inputValue);
    }
  };

  const handleBlur = useCallback((e) => {
    const target = e.target as HTMLInputElement;
    if (!target.value) {
      return;
    }
    setValue(1 + '0'.repeat(Number(target.value)));
    setCustomValueView(target.value);
  }, []);
  const items: MenuProps['items'] = useMemo(() => {
    return [
      {
        label: (
          <div className="menu-label">
            <span className="max">10</span>
            <span className="min">8</span>
          </div>
        ),
        key: '10,8',
      },
      {
        label: (
          <div className="menu-label">
            <span className="max">10</span>
            <span className="min">12</span>
          </div>
        ),
        key: '10,12',
      },
      {
        label: (
          <div className="menu-label">
            <span className="max">10</span>
            <span className="min">16</span>
          </div>
        ),
        key: '10,16',
      },
      {
        label: (
          <div className="menu-label">
            <span className="max">10</span>
            <span className="min">18</span>
          </div>
        ),
        key: '10,18',
      },
      {
        label: (
          <div className="menu-label">
            <span className="max">10</span>
            <span className="min">20</span>
          </div>
        ),
        key: '10,20',
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
              value={customValue}
              onChange={handleChange}
              onBlur={handleBlur}
              onPressEnter={handleBlur}
              className="!h-5 w-10 py-0 !text-xs !text-base-100"
              size="small"
            />
          </div>
        ),
        key: 'input',
      },
    ];
  }, [customValue, handleBlur]);

  const handleMenuClick: MenuProps['onClick'] = useCallback((e) => {
    if (e.key !== 'input') {
      const [, log] = e.key.split(',');
      setValue(1 + '0'.repeat(log));
      setCustomValueView(log);
    }
  }, []);
  const label = useMemo(() => {
    return (
      <div className="menu-container flex items-center gap-2 text-sm">
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
            <span className="min">{customValueView}</span>
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
  }, [customValueView, data.name, form, handleMenuClick, items, type, value]);
  return (
    <Form.Item key={data.name} label={label} name={data.name}>
      <Input size="small" />
    </Form.Item>
  );
}
