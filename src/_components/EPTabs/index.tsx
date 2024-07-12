import { Tabs } from 'aelf-design';
import type { ITabsProps } from 'aelf-design';
import { useEffect, useImperativeHandle, useState, forwardRef } from 'react';
import './index.css';
import { useEffectOnce } from 'react-use';
import { useDeleteQueryParam, useUpdateQueryParams } from '@_hooks/useUpdateQueryParams';
import { contractKey } from '@_components/AddressDetail/components/Contract';
import { getFirstHashValue } from '@_utils/formatter';
import { useSearchParams } from 'next/navigation';

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

  const Search = useSearchParams();
  useEffectOnce(() => {
    const activeKey = Search.get('tab') as string;
    setActiveKey(activeKey || '');
  });

  useEffect(() => {
    if (selectKey) {
      if (selectKey) {
        deleteQueryParam(['p', 'ps', 'pageType', 'tab', 'type', 'searchAfter'], {
          tab: selectKey,
        });
      } else {
        deleteQueryParam(['p', 'ps', 'pageType', 'tab', 'type', 'searchAfter']);
      }
      setActiveKey(selectKey as string);
    }
  }, [selectKey]);

  console.log(activeKey, 'activeKey');
  const tabChange = (activeKey) => {
    onTabChange?.(activeKey);
    window.location.hash = '';
    if (activeKey) {
      deleteQueryParam(['p', 'ps', 'pageType', 'tab', 'type', 'searchAfter'], {
        tab: activeKey,
      });
    } else {
      deleteQueryParam(['p', 'ps', 'pageType', 'tab', 'type', 'searchAfter']);
    }
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
