'use client';
import React from 'react';
import Overview from './_overview/OverView';
import EPTabs, { EPTabsRef } from '@_components/EPTabs';
import TransfersTable from './_transfers/Table';
import HoldersTable from './_holders/HoldersTable';
import Inventory from './_inventory/Inventory';
import { CollectionDetailData } from './type';
import { useRef, useState } from 'react';

export interface NFTDetailsProps {
  overview: CollectionDetailData;
  search?: string;
}

enum TabKey {
  holders = 'holders',
  empty = '',
  inventory = 'inventory',
}
const tabMap = {
  [TabKey.holders]: 'Holders',
  [TabKey.empty]: 'Transfers',
  [TabKey.inventory]: 'Inventory',
};

const unSearchItem = {
  key: TabKey.holders,
};
const tabItems: { key: string }[] = [
  {
    key: TabKey.empty,
  },
  unSearchItem,
  {
    key: TabKey.inventory,
  },
];

export default function NFTDetails(props: NFTDetailsProps) {
  const { overview } = props;
  console.log(overview, 'collection detail');
  const tabRef = useRef<EPTabsRef>(null);
  const [tabList] = useState(tabItems);

  // init search value from url query

  const list = tabList.map((obj) => {
    const { key } = obj;
    let children = <div></div>;
    if (key === TabKey.empty) {
      children = <TransfersTable />;
    } else if (key === TabKey.holders) {
      children = <HoldersTable />;
    } else {
      children = <Inventory />;
    }
    return {
      key,
      label: tabMap[key],
      children: children,
    };
  });
  return (
    <div>
      <Overview overview={overview} />
      <div className="collection-tab-wrap">
        <EPTabs items={list} ref={tabRef} />
      </div>
    </div>
  );
}
