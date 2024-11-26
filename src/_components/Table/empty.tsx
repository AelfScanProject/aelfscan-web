import { ReactNode, useMemo } from 'react';
import tableEmptyImg from 'public/image/table-empty.svg';
import Image from 'next/image';
import clsx from 'clsx';

interface ICommonEmptyProps {
  type?: 'nodata' | 'search' | 'internet';
  desc?: ReactNode;
  size?: 'large' | 'middle' | 'small';
  className?: string;
}

export default function CommonEmpty({ type, desc, className, size = 'large' }: ICommonEmptyProps) {
  const sizeStyle = useMemo(() => {
    if (size === 'large') {
      return 'size-large-120';
    } else if (size === 'middle') {
      return 'size-middle-100';
    } else {
      return 'size-small-80';
    }
  }, [size]);

  const emptyStatus = useMemo(() => {
    const typesMap = {
      nodata: {
        src: tableEmptyImg,
        desc: 'No matching entries',
      },
      search: {
        src: tableEmptyImg,
        desc: 'noSearch',
      },
      internet: {
        src: tableEmptyImg,
        desc: 'No Internet',
      },
    };
    let curType;
    if (!type) {
      curType = typesMap['search']; //default
    } else {
      curType = typesMap[type];
    }
    return (
      <div className={clsx('empty-placeholder flex flex-col items-center justify-center gap-6', sizeStyle, className)}>
        {curType.src && <Image width={240} height={213} alt="empty" src={curType.src} />}
        {curType.desc && <span className="text-sm text-muted-foreground">{desc || curType.desc}</span>}
      </div>
    );
  }, [className, desc, sizeStyle, type]);

  return emptyStatus;
}
