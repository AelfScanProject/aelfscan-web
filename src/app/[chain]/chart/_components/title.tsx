import Link from 'next/link';
import IconFont from '@_components/IconFont';
import '../index.css';
import { MULTI_CHAIN } from '@_utils/contant';
import { Button } from 'antd';
export default function Title({ title, hiddenBorder }: { title: string; hiddenBorder?: boolean }) {
  return (
    <div className={`pb-3 pt-8  ${hiddenBorder && '!mb-0 !border-none'}`}>
      <div className="flex items-center gap-[10px]">
        <Link
          className="nav flex  items-center text-xs leading-5 !text-base-100 hover:!text-link"
          href={`/${MULTI_CHAIN}/chart`}>
          <Button className="flex size-9 items-center !border-border">
            <IconFont className="rotate-180 text-base" type="arrow-right" />
          </Button>
        </Link>
        <div className="text-xl font-bold">{title}</div>
      </div>
    </div>
  );
}
