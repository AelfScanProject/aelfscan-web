import { Search } from 'aelf-design';
import './index.css';
import { ISearchProps } from 'aelf-design';

export default function EPSearch(props: ISearchProps) {
  return (
    <div className="ep-search flex-1">
      <Search {...props} />
    </div>
  );
}
