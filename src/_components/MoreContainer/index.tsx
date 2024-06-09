import DetailContainer from '@_components/DetailContainer';
import IconFont from '@_components/IconFont';
import React, { MouseEventHandler } from 'react';

function MoreContainer({
  showMore,
  diver = false,
  onChange,
}: {
  showMore: boolean;
  diver?: boolean;
  onChange: MouseEventHandler;
}) {
  const detail = [
    {
      label: 'More Details ',
      row: true,
      value: (
        <div className="flex items-center justify-start" onClick={onChange}>
          <IconFont className="text-xs" type={showMore ? 'Less' : 'More'} />
          <span className="ml-1 cursor-pointer text-link">Click to show {showMore ? 'less' : 'more'}</span>
        </div>
      ),
    },
  ];
  const infoList = diver
    ? [
        {
          label: 'divider1',
          value: 'divider',
        },
        ...detail,
      ]
    : detail;
  return <DetailContainer infoList={infoList} />;
}

export default React.memo(MoreContainer);
