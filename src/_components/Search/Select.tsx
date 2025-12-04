/*
 * @Author: aelf-lxy
 * @Date: 2023-08-09 20:35:48
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-17 14:41:44
 * @Description: filter condition
 */
import { Dropdown, MenuProps } from 'antd';
import { TSearchValidator } from './type';
import IconFont from '@_components/IconFont';
import { ReactElement, cloneElement, memo } from 'react';
import { useSearchContext } from './SearchProvider';
import { setFilterType } from './action';

function SearchSelect({ searchValidator }: { searchValidator?: TSearchValidator }) {
  const { state, dispatch } = useSearchContext();
  const { filterType } = state;

  if (!searchValidator || Object.keys(searchValidator).length === 0) {
    return null;
  }

  const items = searchValidator.map((ele) => ({ label: ele.filterInfo, key: ele.filterType }));

  const filterClickHandler: MenuProps['onClick'] = (obj) => {
    dispatch(setFilterType(searchValidator[obj.key]));
  };

  return (
    <Dropdown
      // open={true}
      trigger={['click']}
      menu={{ items, onClick: filterClickHandler, selectable: true, defaultSelectedKeys: [items[0]?.key.toString()] }}
      dropdownRender={(menu) => (
        <div>
          {cloneElement(menu as ReactElement, {
            className: '!flex !gap-1 !flex-col !shadow-search !w-[126px] !p-2',
          })}
        </div>
      )}>
      <div className="filter-wrap">
        <span>{filterType?.filterInfo}</span>
        <IconFont className="right-arrow" type="Down" />
      </div>
    </Dropdown>
  );
}

export default memo(SearchSelect);
