import IconFont from '@_components/IconFont';
import { memo } from 'react';
import './index.css';

function EPSortIcon({ sortOrder }) {
  return (
    <div className="ep-sorter explorer-table-column-sorter-inner ml-1">
      <IconFont
        className="text-base"
        type={
          sortOrder === 'descend'
            ? 'arrow-down-wide-narrow-f6kehlin'
            : sortOrder === 'ascend'
              ? 'arrow-up-wide-narrow'
              : 'arrow-down-up'
        }
      />
    </div>
  );
}

export default memo(EPSortIcon);
