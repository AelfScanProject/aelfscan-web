import { NetworkItem } from '@_types';
import { Dropdown } from 'aelf-design';
import IconFont from '@_components/IconFont';
import { MenuProps } from 'rc-menu';
import { useMemo } from 'react';
import './index.css';

export default function NetWorkSwitch({
  networkList,
  isSelect = true,
}: {
  networkList: NetworkItem[];
  isSelect?: boolean;
}) {
  const origin = typeof window !== 'undefined' && window.location.origin;
  const selectNet = useMemo(() => {
    return networkList.find((item) => item.path === 'https://testnet.aelfscan.io');
  }, [networkList, origin]);

  const items: MenuProps['items'] = useMemo(() => {
    return networkList.map((item) => {
      return {
        key: item?.key,
        label: (
          <a
            target="_blank"
            className={`text-sm leading-[22px] ${origin === item?.path ? '!text-link' : '!text-base-100'}`}
            href={item?.path}
            rel="noopener noreferrer">
            {item?.label}
          </a>
        ),
      };
    });
  }, [networkList, origin]);
  return (
    <div className="network-container">
      <Dropdown trigger={['click']} overlayClassName="network-drop w-[140px]" menu={{ items }}>
        {isSelect ? (
          <div className="flex w-[140px] cursor-pointer items-center justify-center gap-1 rounded-md border border-border bg-white px-2 py-[6px]">
            <IconFont className="text-base" type={selectNet?.key || ''} />
            <div className="text-sm leading-6 text-primary">{selectNet?.label}</div>
            <IconFont className="text-base" type="chevron-down" />
          </div>
        ) : (
          <div className="flex items-center justify-center rounded-lg border border-border bg-white p-3">
            <IconFont className="text-base" type="mainChainLogo" />
          </div>
        )}
      </Dropdown>
    </div>
  );
}
