import React from 'react';
import { Tooltip } from 'aelf-design';
import { PropertyItem } from '../type';

export interface OverViewPropertyProps {
  properties: PropertyItem[];
}

export default function OverViewDetail(props: OverViewPropertyProps) {
  const { properties } = props;
  return (
    <ul className="nft-detail-ul nft-detail-block-wrap">
      {properties?.map((item, index) => {
        return (
          <li className="nft-detail-block" key={index}>
            <h1>{item.title}</h1>
            <h2 className="w-full truncate text-center">
              <Tooltip title={item.value}>
                <span>{item.value}</span>
              </Tooltip>
            </h2>
          </li>
        );
      })}
    </ul>
  );
}
