import Link from 'next/link';
import IconFont from '@_components/IconFont';
import '../index.css';
import { useParams } from 'next/navigation';
export default function Title({ title, hiddenBorder }: { title: string; hiddenBorder?: boolean }) {
  const { chain } = useParams();
  return (
    <div className={`mb-5 border-b border-solid border-color-divider py-6 ${hiddenBorder && '!mb-0 !border-none'}`}>
      <div className="flex">
        <Link
          className="nav mb-2 flex  items-center text-xs leading-5 !text-base-100 hover:!text-link"
          href={`/${chain}/chart`}>
          <IconFont className="mr-1 rotate-180" type="right-arrow-dfna6beo" />
          <div className="text-[20px] font-medium leading-[28px]">{title}</div>
        </Link>
      </div>
    </div>
  );
}
