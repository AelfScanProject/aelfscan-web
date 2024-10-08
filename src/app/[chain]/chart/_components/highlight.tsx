import { Divider } from 'antd';
import { IHIGHLIGHTDataItem } from '../type';
import '../index.css';
import tipsIcon from 'public/image/tips.svg';
import Image from 'next/image';

export default function Highlight({ highlightData, title }: { highlightData: IHIGHLIGHTDataItem[]; title: string }) {
  return (
    <div className="col-xl-3 col-lg-4 min-[993px]:pl-6">
      <div className="title mb-1 text-[16px] font-medium leading-6 text-base-100">About</div>
      <div className="text-sm leading-[22px] text-base-100">{title}</div>
      {highlightData.map((item) => {
        return (
          !item.hidden && (
            <div key={item.key}>
              <Divider className="my-4" />
              {!item.hiddenTitle && (
                <div className="mb-1 flex items-center text-sm leading-[22px] text-base-200">
                  <Image className="mr-1" src={tipsIcon} alt="tips"></Image>HIGHLIGHT
                </div>
              )}
              <div className="text-sm leading-[22px] text-base-100">{item.text}</div>
            </div>
          )
        );
      })}
    </div>
  );
}
