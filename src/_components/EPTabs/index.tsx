import { Tabs } from 'aelf-design';
import type { ITabsProps } from 'aelf-design';
import { useEffect, useImperativeHandle, useState, forwardRef } from 'react';
import './index.css';
import { useEffectOnce } from 'react-use';
import { useDeleteQueryParam } from '@_hooks/useUpdateQueryParams';
import { contractKey } from '@_components/AddressDetail/components/Contract';
import { getFirstHashValue } from '@_utils/formatter';

export interface EPTabsRef {
  setActiveKey: (key: string) => void;
}
interface EPTabsProps {
  selectKey?: string;
  onTabChange?: (key: string) => void;
  items: ITabsProps['items'];
}
// eslint-disable-next-line react/display-name
const EPTabs = forwardRef<EPTabsRef, EPTabsProps>(({ items, selectKey, onTabChange }, ref) => {
  const [activeKey, setActiveKey] = useState<string>('');
  const deleteQueryParam = useDeleteQueryParam();
  useEffectOnce(() => {
    const hash = getFirstHashValue(window.location.href);
    console.log('hash', hash);
    setActiveKey(contractKey.includes(hash) ? 'Code' : hash);
  });

  useEffect(() => {
    if (!selectKey) return;
    window.location.hash = selectKey as string;
    setActiveKey(selectKey as string);
  }, [selectKey]);

  const tabChange = (activeKey) => {
    onTabChange?.(activeKey);
    if (activeKey === '') {
      window.location.hash = '';
    } else {
      window.location.hash = activeKey;
    }
    deleteQueryParam(['p', 'ps', 'pageType', 'tab', 'searchAfter']);
    setActiveKey(activeKey);
  };

  useImperativeHandle(ref, () => ({
    setActiveKey,
  }));

  return (
    <div className="tab-container">
      <Tabs defaultActiveKey={activeKey} activeKey={activeKey} items={items} onChange={tabChange} />
    </div>
  );
});

export default EPTabs;
