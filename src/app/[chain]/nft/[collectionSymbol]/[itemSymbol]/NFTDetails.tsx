'use client';
import { ITabsProps } from 'aelf-design';
import Overview from './_overview/OverView';
import EPTabs, { EPTabsRef } from '@_components/EPTabs';
import ItemActivityTable from './_itemActivity/ItemActivityTable';
import ItemHoldersTable from './_holders/HoldersTable';
import { ItemSymbolDetailActivity, ItemSymbolDetailOverview } from './type';
import { useRef, useState } from 'react';

export interface NFTDetailsProps {
  activity: ItemSymbolDetailActivity;
  overview: ItemSymbolDetailOverview;
}
const holders = 'Holders';
export default function NFTDetails(props: NFTDetailsProps) {
  const { activity, overview } = props;
  console.log(overview, 'overview');
  const tabRef = useRef<EPTabsRef>(null);
  const [selectKey, setSelectKey] = useState<string>('');
  const tabItems: ITabsProps['items'] = [
    {
      key: '',
      label: 'Item Activity',
      children: <ItemActivityTable activeData={activity} />,
    },
    {
      key: holders,
      label: 'Holders',
      children: <ItemHoldersTable />,
    },
  ];
  const handleHolderClick = () => {
    tabRef.current?.setActiveKey(holders);
  };

  return (
    <div className="nft-wrap">
      <Overview overview={overview} onHolderClick={handleHolderClick} />
      <div className="ntf-list-wrap">
        <EPTabs items={tabItems} selectKey={selectKey} ref={tabRef} />
      </div>
    </div>
  );
}
